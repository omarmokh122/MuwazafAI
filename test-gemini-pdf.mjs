import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

async function run() {
  try {
    // Generate a simple PDF with a string
    const PDFDocument = (await import('pdfkit')).default;
    const doc = new PDFDocument();
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', async () => {
      const pdfData = Buffer.concat(buffers);
      console.log('PDF created, size:', pdfData.length);
      
      const result = await model.generateContent([
        'Extract text',
        { inlineData: { data: pdfData.toString('base64'), mimeType: 'application/pdf' } }
      ]);
      console.log('Result:', result.response.text());
    });
    doc.text('Hello from Gemini PDF Vision test!');
    doc.end();
  } catch (e) {
    console.error('Error:', e);
  }
}
run();
