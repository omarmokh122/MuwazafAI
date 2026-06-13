import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import fs from 'fs';
import os from 'os';
import path from 'path';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

async function run() {
  try {
    const PDFDocument = (await import('pdfkit')).default;
    const doc = new PDFDocument();
    const tmpPath = path.join(os.tmpdir(), `test-${Date.now()}.pdf`);
    
    doc.pipe(fs.createWriteStream(tmpPath));
    doc.text('Hello from Gemini PDF File API test!');
    doc.end();
    
    // Wait for file to write
    await new Promise(r => setTimeout(r, 1000));
    
    console.log('Uploading to Gemini...');
    const uploadResult = await fileManager.uploadFile(tmpPath, {
      mimeType: 'application/pdf',
      displayName: 'test.pdf'
    });
    console.log('Uploaded as:', uploadResult.file.uri);
    
    const result = await model.generateContent([
      'Extract text',
      { fileData: { fileUri: uploadResult.file.uri, mimeType: 'application/pdf' } }
    ]);
    console.log('Result:', result.response.text());
    
    await fileManager.deleteFile(uploadResult.file.name);
    fs.unlinkSync(tmpPath);
    console.log('Cleaned up');
  } catch (e) {
    console.error('Error:', e);
  }
}
run();
