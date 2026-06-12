import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(req: NextRequest) {
  try {
    const { cvText, jobText } = await req.json()

    if (!cvText || !jobText) {
      return NextResponse.json({ error: 'Missing cvText or jobText' }, { status: 400 })
    }

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing Gemini API Key' }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    
    // We use gemini-2.5-flash for speed and lower latency
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: "application/json"
      }
    })

    const prompt = `You are an expert HR recruiter and rigorous ATS (Applicant Tracking System) simulator.
Your job is to meticulously analyze the provided CV against the Job Description.

You MUST respond with purely valid JSON matching this exact schema:
{
  "score": <number between 0 and 100 representing the exact skill match percentage>,
  "matching": ["<array of specific skills/keywords found in BOTH the CV and the JD>"],
  "gaps": ["<array of specific critical skills/keywords required by the JD but MISSING from the CV>"],
  "analysis": "<a highly professional, actionable paragraph (max 3 sentences) explaining the fit and advising the candidate on what to fix>"
}

Ensure the matching and gaps arrays contain short, concise skill names (e.g., "React", "Project Management", "Python").

CV CONTENT:
---
${cvText}
---

JOB DESCRIPTION:
---
${jobText}
---
`

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()
    const parsedData = JSON.parse(responseText)

    return NextResponse.json(parsedData)
  } catch (error) {
    console.error('CV Matcher API Error:', error)
    return NextResponse.json({ error: 'Failed to process AI analysis.' }, { status: 500 })
  }
}
