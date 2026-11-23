import PDFDocument from 'pdfkit'
import { withJsonGuard } from '@/lib/security/api-guard'
import { apiError } from '@/lib/security/http'
import { exportPdfRequestSchema } from '@/lib/security/schemas'
import { describeError, logEvent } from '@/lib/observability/logger'

export const runtime = 'nodejs'
export const maxDuration = 30

export const POST = withJsonGuard(
  {
    scope: 'export-pdf',
    schema: exportPdfRequestSchema,
    limit: 6,
    windowMs: 60_000,
    maxBytes: 64 * 1024,
  },
  async (_request, data) => {
    const text = data.text.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')

    if (!text.trim()) {
      return apiError('Text is required.', 400)
    }

    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 72, bottom: 72, left: 72, right: 72 },
      info: { Title: 'Cover Letter', Producer: 'Muwaazaf' },
    })

    const buffers: Buffer[] = []
    doc.on('data', (chunk: Buffer) => buffers.push(chunk))

    const pdfReady = new Promise<Buffer>((resolve, reject) => {
      doc.on('end', () => resolve(Buffer.concat(buffers)))
      doc.on('error', reject)
    })

    doc.font('Helvetica').fontSize(11).lineGap(6)
    doc.text(text, { align: 'left' })
    doc.end()

    try {
      const pdfBuffer = await pdfReady

      return new Response(new Uint8Array(pdfBuffer), {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="Cover_Letter.pdf"',
          'Cache-Control': 'no-store, max-age=0',
          'X-Content-Type-Options': 'nosniff',
        },
      })
    } catch (error) {
      await logEvent('error', 'export_pdf_failed', { error: describeError(error) })
      return apiError('Failed to generate PDF. Please try again.', 500)
    }
  }
)
