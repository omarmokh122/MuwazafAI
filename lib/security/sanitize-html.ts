import sanitizeHtml from 'sanitize-html'

export function sanitizeAiHtml(input: string): string {
  const cleaned = sanitizeHtml(input, {
    allowedTags: [
      'p',
      'br',
      'strong',
      'b',
      'em',
      'i',
      'u',
      'ul',
      'ol',
      'li',
      'h3',
      'h4',
      'h5',
      'div',
      'span',
      'pre',
      'code',
      'blockquote',
      'hr',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
    ],
    allowedAttributes: {
      div: ['class'],
      span: ['class'],
      code: ['class'],
      th: ['colspan', 'rowspan'],
      td: ['colspan', 'rowspan'],
    },
    allowedClasses: {
      div: ['bg-slate-50', 'p-4', 'rounded-xl', 'border', 'mt-4'],
      span: [],
      code: [],
    },
    disallowedTagsMode: 'discard',
    allowedSchemes: [],
    allowedSchemesByTag: {},
    allowProtocolRelative: false,
    parser: { lowerCaseTags: true },
  })

  return cleaned.slice(0, 30000)
}
