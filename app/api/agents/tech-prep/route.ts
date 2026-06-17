import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(req: NextRequest) {
  try {
    const { targetRole, jobText } = await req.json()

    if (!targetRole && !jobText) {
      return NextResponse.json({ error: 'Missing target role or job description' }, { status: 400 })
    }

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'Missing Gemini API Key' }, { status: 500 })

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: { responseMimeType: "application/json" }
    })

    const prompt = `You are a world-class Technical Interview Coach. 
Create a comprehensive technical interview preparation module tailored for the following role/context:

TARGET ROLE: ${targetRole || 'Not specified'}
JOB DESCRIPTION: ${jobText ? '\n---\n' + jobText + '\n---\n' : 'Not provided. Provide generic top-tier prep for the target role.'}

Output purely valid JSON following this exact schema so it integrates directly into the UI:
{
  "id": "technical_custom",
  "title": "Custom Technical: ${targetRole || 'Specific Role'}",
  "description": "A tailored technical curriculum based on the provided job description and role requirements.",
  "lessons": [
    {
      "title": "<string> Lesson Title (e.g. Core System Design, Role-Specific Algorithm, specific stack)",
      "contentHtml": "<string> Highly detailed HTML content for the lesson using <p>, <ul>, <li>, <strong>, <em>, and occasional <div className='bg-slate-50 p-4 rounded-xl border mt-4'> for resources. Provide concrete frameworks and examples."
    },
    {
      "title": "<string> Lesson 2 Title",
      "contentHtml": "<string> HTML content..."
    },
    {
      "title": "<string> Lesson 3 Title",
      "contentHtml": "<string> HTML content..."
    }
  ],
  "quiz": {
    "question": "<string> A challenging multiple-choice question based on the lessons",
    "options": ["<string> option 1", "<string> option 2", "<string> option 3"],
    "correctAnswer": <number> (0, 1, or 2),
    "explanation": "<string> Why the correct answer is right and the others are wrong."
  }
}

Ensure the HTML in contentHtml uses only Tailwind-friendly classes we might expect, or basic tags that will render nicely in React's dangerouslySetInnerHTML.`

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()
    const parsedData = JSON.parse(responseText)

    return NextResponse.json(parsedData)
  } catch (error) {
    console.error('Tech Prep API Error:', error)
    return NextResponse.json({ error: 'Failed to generate technical prep guide' }, { status: 500 })
  }
}
