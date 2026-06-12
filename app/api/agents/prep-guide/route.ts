import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(req: NextRequest) {
  try {
    const { cvText, jobText, gaps, matching } = await req.json()

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'Missing Gemini API Key' }, { status: 500 })

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: { responseMimeType: "application/json" }
    })

    const prompt = `You are a world-class Executive Interview Coach. 
Analyze the candidate's CV and the Job Description, focusing heavily on the identified missing skills (Gaps: ${gaps.join(', ')}) and the matching skills (Matching: ${matching.join(', ')}).

Generate a personalized "Skill Demonstration Playbook" for the candidate in purely valid JSON format.
Follow this strict JSON schema:
{
  "interviewFlow": ["<string> Expected phase 1", "<string> Expected phase 2", "..."],
  "matchingPitch": "<string> A 2-sentence elevator pitch on how to professionally highlight the matching skills they DO have.",
  "gapBridges": [
    {
      "gapSkill": "<string> The missing skill",
      "bridgeStrategy": "<string> How they should pivot or frame their lack of experience positively using existing parallel skills from their CV."
    }
  ],
  "keywordsToDrop": ["<string> Important keyword from JD 1", "<string> keyword 2", "..."]
}

CV CONTENT:
---
${cvText}
---

JOB DESCRIPTION:
---
${jobText}
---`

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()
    const parsedData = JSON.parse(responseText)

    return NextResponse.json(parsedData)
  } catch (error) {
    console.error('Prep Guide API Error:', error)
    return NextResponse.json({ error: 'Failed to generate prep guide' }, { status: 500 })
  }
}
