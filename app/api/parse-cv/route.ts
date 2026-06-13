import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 5MB limit' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    let parsedText = ''

    const ext = file.name?.substring(file.name.lastIndexOf('.')).toLowerCase() || ''

    if (file.type === 'application/pdf' || ext === '.pdf') {
      try {
        const pdfParse = require('pdf-parse')
        const data = await pdfParse(buffer, {
          // Prevent pdf-parse from trying to load test files
          max: 0, // no page limit
        })
        parsedText = data.text || ''
      } catch (pdfError: any) {
        console.error('PDF parse error:', pdfError)
        return NextResponse.json(
          { error: 'Could not read this PDF. It may be image-based or corrupted. Please try a different file.' },
          { status: 422 }
        )
      }
    } else if (
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      ext === '.docx'
    ) {
      try {
        const mammoth = require('mammoth')
        const data = await mammoth.extractRawText({ buffer })
        parsedText = data.value || ''
      } catch (docxError: any) {
        console.error('DOCX parse error:', docxError)
        return NextResponse.json(
          { error: 'Could not read this Word document. Please ensure it is a valid .docx file.' },
          { status: 422 }
        )
      }
    } else if (file.type === 'application/msword' || ext === '.doc') {
      // .doc format (legacy Word) - mammoth doesn't support it well
      return NextResponse.json(
        { error: 'Legacy .doc format is not fully supported. Please save your file as .docx or .pdf and try again.' },
        { status: 422 }
      )
    } else {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload a PDF or DOCX file.' },
        { status: 400 }
      )
    }

    if (!parsedText || parsedText.trim().length < 10) {
      return NextResponse.json(
        { error: 'Could not extract meaningful text from this file. It may be image-based. Please try a different file.' },
        { status: 422 }
      )
    }

    // Clean up excessive whitespace/newlines to save tokens
    const cleanText = parsedText.replace(/\s+/g, ' ').trim()

    return NextResponse.json({ text: cleanText, fileName: file.name })
  } catch (error: any) {
    console.error('File parsing error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to process file. Please try again.' },
      { status: 500 }
    )
  }
}
