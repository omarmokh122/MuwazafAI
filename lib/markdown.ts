const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char])
}

/**
 * Renders a tiny, safe Markdown subset. Input is escaped before any markup is
 * inserted, so model or user content can never inject HTML.
 */
export function renderSafeMarkdown(input: string): string {
  return escapeHtml(input)
    .replace(/^###### (.*)$/gm, '<strong>$1</strong>')
    .replace(/^##### (.*)$/gm, '<strong>$1</strong>')
    .replace(/^#### (.*)$/gm, '<strong>$1</strong>')
    .replace(/^### (.*)$/gm, '<strong>$1</strong>')
    .replace(/^## (.*)$/gm, '<strong>$1</strong>')
    .replace(/^# (.*)$/gm, '<strong>$1</strong>')
    .replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^\w*])\*([^*\n]+)\*(?!\w)/g, '$1<em>$2</em>')
    .replace(/`([^`\n]+)`/g, '<code>$1</code>')
    .replace(/\n{2,}/g, '<br /><br />')
    .replace(/\n/g, '<br />')
}

const ALLOWED_TAGS = new Set([
  'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 'h3', 'h4', 'h5',
  'div', 'span', 'pre', 'code', 'blockquote', 'hr', 'table', 'thead', 'tbody',
  'tr', 'th', 'td',
])
const ALLOWED_ATTRS: Record<string, string[]> = {
  div: ['class'],
  span: ['class'],
  code: ['class'],
  th: ['colspan', 'rowspan'],
  td: ['colspan', 'rowspan'],
}
const ALLOWED_CLASSES = new Set(['bg-slate-50', 'p-4', 'rounded-xl', 'border', 'mt-4'])

/**
 * Defence-in-depth sanitizer for model-generated HTML. The API already
 * sanitizes server-side; this re-validates in the browser before it reaches
 * dangerouslySetInnerHTML.
 */
export function sanitizeAiHtmlClient(input: string): string {
  if (typeof input !== 'string' || !input) return ''
  if (typeof DOMParser === 'undefined') return escapeHtml(input)

  const doc = new DOMParser().parseFromString(`<div>${input}</div>`, 'text/html')
  const root = doc.body.firstElementChild

  const serialize = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) {
      return escapeHtml(node.nodeValue || '')
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return ''

    const element = node as Element
    const tag = element.tagName.toLowerCase()
    const children = Array.from(element.childNodes).map(serialize).join('')

    if (!ALLOWED_TAGS.has(tag)) return children
    if (tag === 'br' || tag === 'hr') return `<${tag} />`

    const allowed = ALLOWED_ATTRS[tag]
    let attrs = ''
    if (allowed) {
      for (const name of allowed) {
        const raw = element.getAttribute(name)
        if (!raw) continue
        if (name === 'class') {
          const classes = raw.split(/\s+/).filter((token) => ALLOWED_CLASSES.has(token))
          if (classes.length) attrs += ` class="${classes.join(' ')}"`
        } else if (/^\d{1,2}$/.test(raw)) {
          attrs += ` ${name}="${raw}"`
        }
      }
    }

    return `<${tag}${attrs}>${children}</${tag}>`
  }

  return root ? Array.from(root.childNodes).map(serialize).join('') : ''
}
