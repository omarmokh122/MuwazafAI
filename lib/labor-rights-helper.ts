import fs from 'fs';
import path from 'path';
import { PDFParse } from 'pdf-parse';
import { GoogleGenerativeAI } from '@google/generative-ai';

const PDF_URL = 'https://www.labor.gov.lb/Temp/Files/574b61dd-1233-4507-9da1-d4a3e3a6129a.pdf';

const DATA_DIR = path.join(process.cwd(), 'lib/data');
const PDF_PATH = path.join(DATA_DIR, 'labor_law.pdf');
const TEXT_PATH = path.join(DATA_DIR, 'labor_law_text.txt');
const JSON_PATH = path.join(DATA_DIR, 'labor_rights_structured.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export async function getLaborLawText(): Promise<string> {
  ensureDataDir();
  if (fs.existsSync(TEXT_PATH)) {
    return fs.readFileSync(TEXT_PATH, 'utf-8');
  }
  
  if (fs.existsSync(PDF_PATH)) {
    try {
      const buffer = fs.readFileSync(PDF_PATH);
      const parser = new PDFParse({ data: buffer });
      const result = await parser.getText();
      fs.writeFileSync(TEXT_PATH, result.text);
      return result.text;
    } catch (e) {
      console.error('Failed to parse cached PDF, falling back to dynamic sync', e);
    }
  }

  await syncLaborLaw();
  if (fs.existsSync(TEXT_PATH)) {
    return fs.readFileSync(TEXT_PATH, 'utf-8');
  }
  return '';
}

function cleanJsonString(str: string): string {
  const jsonMatch = str.match(/\{[\s\S]*\}/);
  return jsonMatch ? jsonMatch[0] : str.trim();
}

export async function getLaborRightsCategories(): Promise<any> {
  ensureDataDir();
  if (fs.existsSync(JSON_PATH)) {
    try {
      const data = fs.readFileSync(JSON_PATH, 'utf-8');
      const cleaned = cleanJsonString(data);
      return JSON.parse(cleaned);
    } catch (e) {
      console.error('Error parsing structured labor rights JSON from cache. Triggering forced sync...', e);
      try {
        if (fs.existsSync(JSON_PATH)) {
          fs.unlinkSync(JSON_PATH);
        }
      } catch (unlinkError) {
        console.error('Failed to delete corrupt JSON file:', unlinkError);
      }
    }
  }

  // Force sync because the JSON was missing or corrupted
  await syncLaborLaw(true);
  
  if (fs.existsSync(JSON_PATH)) {
    try {
      const data = fs.readFileSync(JSON_PATH, 'utf-8');
      const cleaned = cleanJsonString(data);
      return JSON.parse(cleaned);
    } catch (e) {
      console.error('Error parsing newly synced structured labor rights JSON:', e);
    }
  }
  return { categories: [] };
}

export async function syncLaborLaw(force: boolean = false): Promise<{ synced: boolean; message: string }> {
  ensureDataDir();
  console.log('Syncing Lebanese Labor Law from:', PDF_URL);
  
  try {
    const res = await fetch(PDF_URL);
    if (!res.ok) {
      return { synced: false, message: `Failed to download PDF from government site. Status: ${res.status}` };
    }
    
    const buffer = Buffer.from(await res.arrayBuffer());
    
    if (!force && fs.existsSync(PDF_PATH)) {
      const oldStats = fs.statSync(PDF_PATH);
      if (oldStats.size === buffer.length) {
        return { synced: false, message: 'Labor Law PDF matches local cache. No update needed.' };
      }
    }
    
    fs.writeFileSync(PDF_PATH, buffer);
    
    const parser = new PDFParse({ data: buffer });
    const textResult = await parser.getText();
    const text = textResult.text;
    fs.writeFileSync(TEXT_PATH, text);
    
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
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
    
    fs.writeFileSync(JSON_PATH, cleanedText);
    
    return { synced: true, message: 'Successfully downloaded PDF, parsed text, and regenerated structured JSON via Gemini.' };
  } catch (error: any) {
    console.error('Error syncing Labor Law PDF:', error);
    return { synced: false, message: `Sync failed: ${error.message}` };
  }
}
