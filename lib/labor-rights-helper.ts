import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { describeError, logEvent } from '@/lib/observability/logger';

const PDF_URL = 'https://www.labor.gov.lb/Temp/Files/574b61dd-1233-4507-9da1-d4a3e3a6129a.pdf';
const MAX_PDF_BYTES = 12 * 1024 * 1024;
const MAX_JSON_BYTES = 2 * 1024 * 1024;
const MAX_TEXT_CHARS = 400_000;

const DATA_DIR = path.join(process.cwd(), 'lib/data');
const PDF_PATH = path.join(DATA_DIR, 'labor_law.pdf');
const TEXT_PATH = path.join(DATA_DIR, 'labor_law_text.txt');
const JSON_PATH = path.join(DATA_DIR, 'labor_rights_structured.json');

function readBounded(filePath: string, maxBytes: number): string | null {
  try {
    const stats = fs.statSync(filePath);
    if (!stats.isFile() || stats.size > maxBytes) return null;
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return null;
  }
}

// pdf-parse v2 touches browser globals (DOMMatrix) at import time and crashes on
// Vercel's Node runtime, so only load it when a PDF actually has to be parsed.
const loadPdfParse = () => import('pdf-parse');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export async function getLaborLawText(): Promise<string> {
  ensureDataDir();

  const cachedText = readBounded(TEXT_PATH, MAX_TEXT_CHARS * 2);
  if (cachedText) return cachedText.slice(0, MAX_TEXT_CHARS);

  if (fs.existsSync(PDF_PATH)) {
    try {
      const buffer = fs.readFileSync(PDF_PATH);
      const { PDFParse } = await loadPdfParse();
      const parser = new PDFParse({ data: buffer });
      const result = await parser.getText();
      const text = (result.text || '').slice(0, MAX_TEXT_CHARS);
      fs.writeFileSync(TEXT_PATH, text);
      return text;
    } catch (e) {
      logEvent('warn', 'labor_law_cached_pdf_parse_failed', { error: describeError(e) });
    }
  }

  await syncLaborLaw();
  const syncedText = readBounded(TEXT_PATH, MAX_TEXT_CHARS * 2);
  return syncedText ? syncedText.slice(0, MAX_TEXT_CHARS) : '';
}

function cleanJsonString(str: string): string {
  const jsonMatch = str.match(/\{[\s\S]*\}/);
  return jsonMatch ? jsonMatch[0] : str.trim();
}

export async function getLaborRightsCategories(): Promise<unknown> {
  ensureDataDir();

  const cached = readBounded(JSON_PATH, MAX_JSON_BYTES);
  if (cached) {
    try {
      return JSON.parse(cleanJsonString(cached));
    } catch (e) {
      logEvent('warn', 'labor_law_cached_json_invalid', { error: describeError(e) });
      try {
        if (fs.existsSync(JSON_PATH)) {
          fs.unlinkSync(JSON_PATH);
        }
      } catch (unlinkError) {
        logEvent('warn', 'labor_law_cache_unlink_failed', { error: describeError(unlinkError) });
      }
    }
  }

  await syncLaborLaw(true);

  const synced = readBounded(JSON_PATH, MAX_JSON_BYTES);
  if (synced) {
    try {
      return JSON.parse(cleanJsonString(synced));
    } catch (e) {
      logEvent('error', 'labor_law_synced_json_invalid', { error: describeError(e) });
    }
  }
  return { categories: [] };
}

export async function syncLaborLaw(force: boolean = false): Promise<{ synced: boolean; message: string }> {
  ensureDataDir();
  logEvent('info', 'labor_law_sync_started', { force });
  
  try {
    const res = await fetch(PDF_URL, {
      cache: 'no-store',
      signal: AbortSignal.timeout(20_000),
      headers: { Accept: 'application/pdf' },
    });
    if (!res.ok) {
      return { synced: false, message: `Failed to download PDF from government site. Status: ${res.status}` };
    }

    const declaredLength = Number(res.headers.get('content-length') || 0);
    if (Number.isFinite(declaredLength) && declaredLength > MAX_PDF_BYTES) {
      return { synced: false, message: 'Downloaded PDF exceeds the size limit.' };
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length > MAX_PDF_BYTES) {
      return { synced: false, message: 'Downloaded PDF exceeds the size limit.' };
    }
    if (buffer.subarray(0, 5).toString('latin1') !== '%PDF-') {
      return { synced: false, message: 'Downloaded file is not a valid PDF.' };
    }

    if (!force && fs.existsSync(PDF_PATH)) {
      const oldStats = fs.statSync(PDF_PATH);
      if (oldStats.size === buffer.length) {
        return { synced: false, message: 'Labor Law PDF matches local cache. No update needed.' };
      }
    }
    
    fs.writeFileSync(PDF_PATH, buffer);
    
    const { PDFParse } = await loadPdfParse();
    const parser = new PDFParse({ data: buffer });
    const textResult = await parser.getText();
    const text = (textResult.text || '').slice(0, MAX_TEXT_CHARS);
    fs.writeFileSync(TEXT_PATH, text);
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return { synced: true, message: 'PDF downloaded and text parsed, but structured JSON could not be generated (missing Gemini API Key).' };
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const prompt = `You are a legal expert in Lebanese Labor Law.
We have provided the official Lebanese Labor Law PDF content.
Please extract the following information and structure it into a JSON format:
For each of these 6 categories:
1. Working Hours & Conditions (ساعات وظروف العمل)
2. Minimum Wage & Compensation (الحد الأدنى للأجور والتعويضات)
3. Leave Entitlements (الإجازات والعطل)
4. Women & Youth Protections (حماية النساء والأحداث)
5. Termination & Severance (نهاية الخدمة والتسريح)
6. Disputes & NSSF (النزاعات والضمان الاجتماعي)

For each category, extract 3-5 key legal articles/rules, specifying:
- Title / Subtitle (in English and Arabic)
- The precise law / rule (in English and Arabic)
- Relevant Article Numbers if mentioned.

Ensure the output is valid JSON matching this schema:
{
  "categories": [
    {
      "id": "string (e.g. hours, wages, leave, protections, severance, disputes)",
      "title_en": "string",
      "title_ar": "string",
      "summary_en": "string",
      "summary_ar": "string",
      "details": [
        {
          "subtitle_en": "string",
          "subtitle_ar": "string",
          "text_en": "string",
          "text_ar": "string",
          "article": "string or null"
        }
      ]
    }
  ]
}

Only return the JSON object, do not wrap in markdown or anything else.`;

    const geminiResult = await model.generateContent([
      prompt,
      { inlineData: { data: buffer.toString('base64'), mimeType: 'application/pdf' } }
    ]);
    
    const responseText = geminiResult.response.text();
    const cleanedText = cleanJsonString(responseText);
    JSON.parse(cleanedText); // Validates JSON format

    if (Buffer.byteLength(cleanedText, 'utf8') > MAX_JSON_BYTES) {
      return { synced: false, message: 'Generated structured data exceeded the size limit.' };
    }

    fs.writeFileSync(JSON_PATH, cleanedText);
    
    return { synced: true, message: 'Successfully downloaded PDF, parsed text, and regenerated structured JSON via Gemini.' };
  } catch (error) {
    logEvent('error', 'labor_law_sync_failed', { error: describeError(error) });
    return { synced: false, message: `Sync failed: ${error instanceof Error ? error.message : 'unknown error'}` };
  }
}
