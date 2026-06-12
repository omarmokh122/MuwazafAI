import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '')

export async function POST(req: Request) {
  try {
    const { messages, context } = await req.json()

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: `You are an expert AI Compensation Analyst and Negotiation Coach.
Your goal is to help the user understand their market value, interpret salary benchmark data, and provide strategies for salary negotiation.
Focus specifically on the Lebanese and broader MENA job market.
Provide concise, actionable, and professional advice.
Use Markdown formatting for readability.
If the user provides context about a recently generated benchmark, refer to that data in your answers.`,
    })

    // Filter out the initial assistant greeting because Gemini requires history to start with 'user'
    const conversationHistory = messages.slice(0, -1).filter((msg: any, index: number) => {
      // Keep all messages EXCEPT the very first one if it's an assistant greeting
      if (index === 0 && msg.role === 'assistant') return false
      return true
    }).map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }))

    const chat = model.startChat({
      history: conversationHistory
    })

    const latestMessage = messages[messages.length - 1].content
    const prompt = context 
      ? `[CONTEXT: The user is currently looking at the following salary benchmark data: ${JSON.stringify(context)}]\n\nUser Question: ${latestMessage}`
      : latestMessage

    const result = await chat.sendMessage(prompt)
    
    return NextResponse.json({ response: result.response.text() })
    
  } catch (error: any) {
    console.error('Benchmark Chat Error:', error)
    return NextResponse.json({ error: 'Failed to generate chat response' }, { status: 500 })
  }
}
