import { aiRequestOptions, getGenAI } from '@/lib/ai/gemini'
import { aiErrorResponse } from '@/lib/ai/errors'
import { withJsonGuard } from '@/lib/security/api-guard'
import { PROMPT_INJECTION_DEFENSE, parseJsonFromModel, untrusted } from '@/lib/security/prompt'
import { cvMatcherRequestSchema, cvMatcherResponseSchema } from '@/lib/security/schemas'
import { json } from '@/lib/security/http'

export const runtime = 'nodejs'

export const POST = withJsonGuard(
  {
    scope: 'agents:cv-matcher',
    schema: cvMatcherRequestSchema,
    limit: 10,
    windowMs: 60_000,
  },
  async (_request, data) => {
    try {
      const genAI = getGenAI()
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        systemInstruction: `You are an expert HR recruiter and rigorous ATS simulator.
Analyze the untrusted CV against the untrusted job description and respond with JSON only:
{
  "score": <number 0-100>,
  "matching": ["<skills in both>"],
  "gaps": ["<skills required but missing>"],
  "analysis": "<max 3 sentences of actionable advice>"
}
Keep skill names short and concise.

${PROMPT_INJECTION_DEFENSE}`,
        generationConfig: { responseMimeType: 'application/json' },
      })

      const prompt = `CV CONTENT:
${untrusted('candidate_cv', data.cvText)}

JOB DESCRIPTION:
${untrusted('job_description', data.jobText)}`

      const result = await model.generateContent(prompt, aiRequestOptions())
      const parsed = cvMatcherResponseSchema.parse(parseJsonFromModel(result.response.text()))

      return json(parsed)
    } catch (error) {
      return aiErrorResponse('cv-matcher', error)
    }
  }
)
