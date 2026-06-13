import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import fs from 'fs';
import os from 'os';
import path from 'path';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

async function run() {
  try {
    const PDFDocument = (await import('pdfkit')).default;
    const doc = new PDFDocument();
    const tmpPath = path.join(os.tmpdir(), `test-${Date.now()}.pdf`);
    
    doc.pipe(fs.createWriteStream(tmpPath));
    doc.text('Hello from Gemini PDF File API test!');
    doc.end();
    
    await new Promise(r => setTimeout(r, 1000));
    const uploadResult = await fileManager.uploadFile(tmpPath, {
      mimeType: 'application/pdf',
      displayName: 'test.pdf'
    });
    
    const result = await model.generateContent([
      'Extract text',
      { fileData: { fileUri: uploadResult.file.uri, mimeType: 'application/pdf' } }
    ]);
    console.log('Result:', result.response.text());
  } catch (e) {
    console.error('Error:', e);
  }
}
run();
