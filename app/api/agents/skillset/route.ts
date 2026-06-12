import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(req: NextRequest) {
  try {
    const { role } = await req.json()

    if (!role) {
      return NextResponse.json({ error: 'Role is required' }, { status: 400 })
    }

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'Missing API Key' }, { status: 500 })

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: { responseMimeType: "application/json" }
    })

    const prompt = `You are a specialized AI Web Scraper and Career Data Analyst. 
Your objective is to aggregate data specifically from the latest Coursera and edX course catalogs, career path certificates (e.g., Google, IBM, Meta Professional Certificates), and syllabi.
Based strictly on the current curriculum taught by top universities and companies on Coursera and edX, provide the absolute latest, most up-to-date skill requirements for the role of: "${role}".

Return the response ONLY as valid JSON using this exact schema:
{
  "role": "<string> The normalized name of the role",
  "description": "<string> A 2-sentence summary of what this role actually does in the modern market.",
  "hardSkills": [
    {
      "name": "<string> The specific technology or hard skill (e.g., React, Python, Financial Modeling)",
      "importance": "<string> Why it matters currently"
    }
  ],
  "softSkills": [
    {
      "name": "<string> Important soft skill (e.g., Cross-functional leadership)",
      "importance": "<string> Why it's needed"
    }
  ],
  "emergingTrends": [
    {
      "name": "<string> A cutting-edge tool or trend changing this role right now (e.g., GitHub Copilot, Generative AI)",
      "importance": "<string> Why they must learn this soon"
    }
  ]
}`

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()
    
    // Parse it safely
    const parsedData = JSON.parse(responseText)

    return NextResponse.json(parsedData)
  } catch (error) {
    console.error('Skillset API Error:', error)
    return NextResponse.json({ error: 'Failed to generate skillset' }, { status: 500 })
  }
}
