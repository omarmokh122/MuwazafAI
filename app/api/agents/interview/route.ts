import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(req: NextRequest) {
  try {
    const { messages, jobText, gaps, tone } = await req.json()

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'Missing API Key' }, { status: 500 })

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const systemInstruction = `You are the Hiring Manager for the following job description.
Tone: ${tone || 'Professional & rigorous'}
The candidate has the following skill gaps: ${gaps.join(', ')}.
Your goal is to conduct a mock interview focusing heavily on these missing skills to see how they handle it.
Do NOT break character. Ask ONE question at a time.
When the user answers:
1. Provide very brief feedback (a score 1-10, what was good, how to improve it using the STAR method).
2. Ask your NEXT interview question.
Keep responses concise and realistic.

JOB DESCRIPTION:
${jobText}`

    // Format history for Gemini API
    const formattedHistory = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }))

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: systemInstruction }] },
        { role: 'model', parts: [{ text: 'Understood. I will act as the hiring manager.' }] },
        ...formattedHistory
      ]
    })

    const lastMessage = messages[messages.length - 1].content
    const result = await chat.sendMessage(lastMessage)

    return NextResponse.json({ response: result.response.text() })
  } catch (error) {
    console.error('Interview Chat API Error:', error)
    return NextResponse.json({ error: 'Failed to generate interview response' }, { status: 500 })
  }
}
