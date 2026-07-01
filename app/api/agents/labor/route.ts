import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { getLaborLawText } from '@/lib/labor-rights-helper'

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'Missing API Key' }, { status: 500 })

    // Load the official labor law text dynamically (RAG source)
    const laborLawText = await getLaborLawText()

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const systemInstruction = `You are an expert Legal Consultant specializing in the Lebanese Labor Law.
Your goal is to answer employee questions regarding their rights accurately and factually.

You MUST base your answers strictly on the official Lebanese Labor Law text provided below. If a user asks about something not explicitly covered in this text, politely explain that the provided official text does not specify that detail.

GUIDELINES:
1. Provide highly accurate, concise, and professional answers citing specific article numbers from the text where applicable.
2. If the user asks something complex (like specific calculations for indemnity or leaves), explain the legal framework to calculate it.
3. Language Handling:
   - If the user asks in English, answer in English, translating key Arabic terms and article citations clearly.
   - If the user asks in Arabic, answer in Arabic, quoting the relevant text accurately.
4. ALWAYS include a small disclaimer at the end of your very first response stating: "Disclaimer: I provide educational guidance on the Lebanese Labor Law, but this does not constitute formal legal counsel."
5. Be empathetic to employees who might be dealing with stressful workplace situations.

Keep responses structured using markdown (bullet points, bold text) for readability.

OFFICIAL LEBANESE LABOR LAW TEXT:
---
${laborLawText}
---`

    // Format history for Gemini API
    const formattedHistory = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }))

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: systemInstruction }] },
        { role: 'model', parts: [{ text: 'Understood. I am ready to provide expert guidance on the Lebanese Labor Law based strictly on the official text.' }] },
        ...formattedHistory
      ]
    })

    const lastMessage = messages[messages.length - 1].content
    const result = await chat.sendMessage(lastMessage)

    return NextResponse.json({ response: result.response.text() })
  } catch (error) {
    console.error('Labor AI API Error:', error)
    return NextResponse.json({ error: 'Failed to generate legal response' }, { status: 500 })
  }
}
