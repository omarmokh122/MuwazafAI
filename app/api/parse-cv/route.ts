import { withFormGuard } from '@/lib/security/api-guard'
import { apiError, json } from '@/lib/security/http'
import { MAX_UPLOAD_BYTES } from '@/lib/security/constants'
import { validateUpload } from '@/lib/security/upload'
import { describeError, logEvent } from '@/lib/observability/logger'

export const runtime = 'nodejs'
export const maxDuration = 60

function cleanExtractedText(value: string): string {
  return value
    .replace(/\u0000/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 60000)
}

export const POST = withFormGuard(
  {
    scope: 'parse-cv',
    limit: 6,
    windowMs: 60_000,
    maxBytes: MAX_UPLOAD_BYTES + 512 * 1024,
  },
  async (_request, formData) => {
    const file = formData.get('file')
    if (!(file instanceof File)) {
      return apiError('No file was provided.', 400)
    }

    const upload = await validateUpload(file)
    if ('error' in upload) {
      return apiError(upload.error, upload.status)
    }

    let parsedText = ''

    if (upload.extension === 'pdf') {
      try {
        const { PDFParse } = await import('pdf-parse')
        const parser = new PDFParse({ data: upload.buffer })
        const result = await parser.getText()
        parsedText = result.text || ''
      } catch (error) {
        logEvent('warn', 'parse_cv_pdf_failed', { error: describeError(error) })
        return apiError(
          'Could not read this PDF. It may be corrupted. Please try a different file.',
          422
        )
      }

      if (parsedText.trim().length < 50) {
        return apiError(
          'This PDF appears to be a scanned image without selectable text. Please upload a text-based PDF or a DOCX file.',
          422
        )
      }
    } else {
      try {
        const mammothModule = await import('mammoth')
        const mammoth = mammothModule.default ?? mammothModule
        const result = await mammoth.extractRawText({ buffer: upload.buffer })
        parsedText = result.value || ''
      } catch (error) {
        logEvent('warn', 'parse_cv_docx_failed', { error: describeError(error) })
        return apiError(
          'Could not read this Word document. Please ensure it is a valid .docx file.',
          422
        )
      }
    }

    const cleanText = cleanExtractedText(parsedText)

    if (cleanText.length < 10) {
      return apiError(
        'Could not extract meaningful text from this file. Please try a different file.',
        422
      )
    }

    return json({ text: cleanText, fileName: upload.fileName })
  }
)
