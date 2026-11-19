import { aiRequestOptions, getGenAI } from '@/lib/ai/gemini'
import { aiErrorResponse } from '@/lib/ai/errors'
import { withJsonGuard } from '@/lib/security/api-guard'
import { PROMPT_INJECTION_DEFENSE, parseJsonFromModel, untrusted } from '@/lib/security/prompt'
import { skillsetRequestSchema, skillsetResponseSchema } from '@/lib/security/schemas'
import { json } from '@/lib/security/http'

export const runtime = 'nodejs'

export const POST = withJsonGuard(
  {
    scope: 'agents:skillset',
    schema: skillsetRequestSchema,
    limit: 10,
    windowMs: 60_000,
  },
  async (_request, data) => {
    try {
      const genAI = getGenAI()
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        systemInstruction: `You are a career data analyst who summarizes current skills taught by top Coursera and edX programs.
Return JSON only:
{
  "role": "<normalized role>",
  "description": "<2 sentences>",
  "hardSkills": [{ "name": "...", "importance": "..." }],
  "softSkills": [{ "name": "...", "importance": "..." }],
  "emergingTrends": [{ "name": "...", "importance": "..." }]
}

${PROMPT_INJECTION_DEFENSE}`,
        generationConfig: { responseMimeType: 'application/json' },
      })

      const prompt = `Role to analyze:\n${untrusted('target_role', data.role)}`
      const result = await model.generateContent(prompt, aiRequestOptions())
      const parsed = skillsetResponseSchema.parse(parseJsonFromModel(result.response.text()))

      return json(parsed)
    } catch (error) {
      return aiErrorResponse('skillset', error)
    }
  }
)
