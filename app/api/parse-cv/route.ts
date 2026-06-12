import { NextRequest, NextResponse } from 'next/server'
import pdfParse from 'pdf-parse'
import mammoth from 'mammoth'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    let parsedText = ''

    if (file.type === 'application/pdf') {
      const data = await pdfParse(buffer)
      parsedText = data.text
    } else if (
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
      file.name.endsWith('.docx')
    ) {
      const data = await mammoth.extractRawText({ buffer })
      parsedText = data.value
    } else {
      return NextResponse.json({ error: 'Unsupported file type. Please upload a PDF or DOCX file.' }, { status: 400 })
    }

    // Clean up excessive whitespace/newlines to save tokens
    const cleanText = parsedText.replace(/\s+/g, ' ').trim()

    return NextResponse.json({ text: cleanText, fileName: file.name })
  } catch (error) {
    console.error('File parsing error:', error)
    return NextResponse.json({ error: 'Failed to process file' }, { status: 500 })
  }
}
