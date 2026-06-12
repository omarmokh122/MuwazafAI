import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(req: NextRequest) {
  try {
    const { cvText, jobText, tone } = await req.json()

    if (!cvText || !jobText) {
      return NextResponse.json({ error: 'CV and Job Description are required' }, { status: 400 })
    }

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'Missing Gemini API Key' }, { status: 500 })

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const prompt = `You are a world-class executive resume writer and career coach.
Write a highly targeted, professional cover letter for the candidate based on their CV and the Job Description provided below.

INSTRUCTIONS:
1. Tone: ${tone || 'Professional and confident'}.
2. Structure: 
   - A strong opening hook.
   - 2-3 body paragraphs highlighting specific achievements from the CV that directly match the core requirements in the JD.
   - A confident call-to-action closing.
3. Keep it under 400 words.
4. Do NOT hallucinate skills or experiences the candidate does not have.
5. Use placeholders like [Company Name], [Hiring Manager Name], and [Date] where appropriate.

CANDIDATE CV:
---
${cvText}
---

JOB DESCRIPTION:
---
${jobText}
---

Output the cover letter directly without any extra conversational text.`

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()

    return NextResponse.json({ coverLetter: responseText })
  } catch (error) {
    console.error('Cover Letter API Error:', error)
    return NextResponse.json({ error: 'Failed to generate cover letter' }, { status: 500 })
  }
}
