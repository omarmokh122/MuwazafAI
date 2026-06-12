import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'Missing API Key' }, { status: 500 })

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const systemInstruction = `You are an expert Legal Consultant specializing in the Lebanese Labor Law. 
Your goal is to answer employee questions regarding their rights, including but not limited to:
- Working hours (48 hr max), overtime (1.5x)
- Leaves (15 days annual, sick leave tiers, maternity/paternity)
- NSSF (National Social Security Fund) rights and deductions
- End-of-Service Indemnity and abusive termination payouts (2-12 months)

Guidelines:
1. Provide highly accurate, concise, and professional answers based strictly on Lebanese Labor Law.
2. If the user asks something complex (like specific calculations), give them the legal framework to calculate it.
3. ALWAYS include a small disclaimer at the end of your very first response stating: "Disclaimer: I provide educational guidance on the Lebanese Labor Law, but this does not constitute formal legal counsel."
4. Be empathetic to employees who might be dealing with stressful workplace situations.

Keep responses structured using markdown (bullet points, bold text) for readability.`

    // Format history for Gemini API
    const formattedHistory = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }))

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: systemInstruction }] },
        { role: 'model', parts: [{ text: 'Understood. I am ready to provide expert guidance on the Lebanese Labor Law.' }] },
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
