import { MAX_UPLOAD_BYTES } from './constants'

export type ValidatedUpload = {
  buffer: Buffer
  extension: 'pdf' | 'docx'
  fileName: string
}

export type UploadValidationError = {
  error: string
  status: number
}

const DOCX_MIME =
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

function safeFileName(name: string): string {
  const base = name.split(/[\\/]/).pop() || 'document'
  return base
    .replace(/[\u0000-\u001F<>:"|?*]/g, '_')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120) || 'document'
}

export async function validateUpload(
  file: File
): Promise<ValidatedUpload | UploadValidationError> {
  if (!file || file.size === 0) {
    return { error: 'No file was provided.', status: 400 }
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return { error: 'File size must be less than 10MB.', status: 413 }
  }

  const fileName = safeFileName(file.name)
  const dot = fileName.lastIndexOf('.')
  const extension = dot >= 0 ? fileName.slice(dot).toLowerCase() : ''

  if (extension !== '.pdf' && extension !== '.docx') {
    return {
      error: 'Unsupported file type. Please upload a PDF or DOCX file.',
      status: 415,
    }
  }

  const mime = (file.type || '').toLowerCase()
  const mimeOk =
    mime === '' ||
    (extension === '.pdf' && mime === 'application/pdf') ||
    (extension === '.docx' && (mime === DOCX_MIME || mime === 'application/zip'))

  if (!mimeOk) {
    return { error: 'The file type does not match its contents.', status: 415 }
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  if (extension === '.pdf') {
    if (buffer.subarray(0, 5).toString('latin1') !== '%PDF-') {
      return { error: 'This file is not a valid PDF.', status: 415 }
    }

    const raw = buffer.toString('latin1')
    if (/\/Encrypt\b/.test(raw)) {
      return {
        error: 'Encrypted PDFs are not supported. Please upload an unlocked copy.',
        status: 415,
      }
    }
    if (/\/JavaScript\b|\/JS\b|\/OpenAction\b|\/Launch\b/.test(raw)) {
      return {
        error: 'This PDF contains active content and was rejected for security reasons.',
        status: 415,
      }
    }

    return { buffer, extension: 'pdf', fileName }
  }

  const isZip = buffer.subarray(0, 4).equals(Buffer.from([0x50, 0x4b, 0x03, 0x04]))
  if (!isZip) {
    return { error: 'This file is not a valid DOCX document.', status: 415 }
  }

  const archiveListing = buffer.toString('latin1')
  if (!archiveListing.includes('word/document.xml')) {
    return { error: 'This file is not a valid DOCX document.', status: 415 }
  }

  return { buffer, extension: 'docx', fileName }
}
