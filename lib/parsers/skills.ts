export function extractSkills(text: string): string[] {
  if (!text) return []
  // Basic mock implementation for skill extraction
  const words = text.split(/[\s,\n]+/)
  const skills = new Set<string>()
  
  const commonWords = new Set(['the', 'and', 'with', 'for', 'a', 'in', 'of', 'to', 'is', 'on'])
  
  for (const word of words) {
    const cleanWord = word.trim().replace(/[^a-zA-Z0-9#+.]/g, '')
    if (cleanWord.length > 2 && !commonWords.has(cleanWord.toLowerCase())) {
      skills.add(cleanWord)
    }
  }
  
  return Array.from(skills)
}
