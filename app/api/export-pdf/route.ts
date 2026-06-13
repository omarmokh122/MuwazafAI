import { NextRequest, NextResponse } from 'next/server'
import PDFDocument from 'pdfkit'

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json()
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 72, bottom: 72, left: 72, right: 72 } // 1 inch margins
    })

    const buffers: Buffer[] = []
    doc.on('data', buffers.push.bind(buffers))

    const promise = new Promise<Buffer>((resolve) => {
      doc.on('end', () => {
        resolve(Buffer.concat(buffers))
      })
    })

    // Formatting: Professional and clean
    doc.font('Helvetica')
    doc.fontSize(11)
    doc.lineGap(6)

    // Parse the text slightly to add boldness to standard headers if needed
    // But for a cover letter, standard text is fine.
    doc.text(text, {
      align: 'left'
    })

    doc.end()

    const pdfBuffer = await promise

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Cover_Letter.pdf"',
      },
    })
  } catch (error) {
    console.error('PDF Export Error:', error)
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 })
  }
}
