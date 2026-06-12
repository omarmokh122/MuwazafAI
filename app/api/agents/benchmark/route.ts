import { NextResponse } from 'next/server'
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '')

export async function POST(req: Request) {
  try {
    const { jobTitle, jobDescription, mode } = await req.json()

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: `You are an expert compensation analyst specializing in the Lebanese and MENA job market. 
You will be provided with either a Job Title or a full Job Description.
Analyze the market data and provide a detailed salary benchmark.
Always provide realistic figures based on the 2025 Lebanese market (where tech and professional salaries are typically pegged to USD).
Your response must be strictly structured JSON adhering to the provided schema.`,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            roleName: { type: SchemaType.STRING },
            summary: { type: SchemaType.STRING, description: "A brief summary of the market demand for this role in Lebanon/MENA." },
            localRange: {
              type: SchemaType.OBJECT,
              properties: {
                min: { type: SchemaType.STRING, description: "e.g., $1,000/mo" },
                max: { type: SchemaType.STRING, description: "e.g., $2,500/mo" },
                average: { type: SchemaType.STRING, description: "e.g., $1,800/mo" }
              },
              required: ["min", "max", "average"]
            },
            remoteRange: {
              type: SchemaType.OBJECT,
              properties: {
                min: { type: SchemaType.STRING, description: "e.g., $2,000/mo" },
                max: { type: SchemaType.STRING, description: "e.g., $4,500/mo" },
                average: { type: SchemaType.STRING, description: "e.g., $3,000/mo" }
              },
              required: ["min", "max", "average"]
            },
            seniorityMultipliers: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  level: { type: SchemaType.STRING, description: "e.g., Junior, Mid-Level, Senior" },
                  multiplier: { type: SchemaType.STRING, description: "e.g., 0.7x, 1.0x, 1.6x" },
                  description: { type: SchemaType.STRING, description: "Brief explanation of expectations at this level" }
                },
                required: ["level", "multiplier", "description"]
              }
            },
            premiumSkills: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  skill: { type: SchemaType.STRING },
                  bumpAmount: { type: SchemaType.STRING, description: "e.g., +15%, +$500/mo" },
                  reason: { type: SchemaType.STRING }
                },
                required: ["skill", "bumpAmount", "reason"]
              }
            }
          },
          required: ["roleName", "summary", "localRange", "remoteRange", "seniorityMultipliers", "premiumSkills"]
        }
      }
    })

    const prompt = mode === 'jd' 
      ? `Analyze this full Job Description and provide a market salary benchmark:\n\n${jobDescription}`
      : `Provide a market salary benchmark for the following job title: ${jobTitle}`

    const result = await model.generateContent(prompt)
    const text = result.response.text()
    
    return NextResponse.json(JSON.parse(text))
    
  } catch (error: any) {
    console.error('Benchmark API Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
