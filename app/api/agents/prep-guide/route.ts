import { aiRequestOptions, getGenAI } from '@/lib/ai/gemini'
import { aiErrorResponse } from '@/lib/ai/errors'
import { withJsonGuard } from '@/lib/security/api-guard'
import { PROMPT_INJECTION_DEFENSE, parseJsonFromModel, untrusted } from '@/lib/security/prompt'
import { prepGuideRequestSchema, prepGuideResponseSchema } from '@/lib/security/schemas'
import { json } from '@/lib/security/http'

export const runtime = 'nodejs'

export const POST = withJsonGuard(
  {
    scope: 'agents:prep-guide',
    schema: prepGuideRequestSchema,
    limit: 8,
    windowMs: 60_000,
  },
  async (_request, data) => {
    try {
      const genAI = getGenAI()
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        systemInstruction: `You are a world-class executive interview coach.
Analyze the untrusted CV and job description, focusing on the identified gaps and matching skills.
Return JSON only:
{
  "interviewFlow": ["<phase>"],
  "matchingPitch": "<2-sentence pitch>",
  "gapBridges": [{ "gapSkill": "<gap>", "bridgeStrategy": "<how to pivot>" }],
  "keywordsToDrop": ["<keyword>"]
}

${PROMPT_INJECTION_DEFENSE}`,
        generationConfig: { responseMimeType: 'application/json' },
      })

      const prompt = `GAPS:
${untrusted('candidate_skill_gaps', data.gaps.join(', ') || 'None provided')}

MATCHING SKILLS:
${untrusted('candidate_matching_skills', data.matching.join(', ') || 'None provided')}

CANDIDATE CV:
${untrusted('candidate_cv', data.cvText)}

JOB DESCRIPTION:
${untrusted('job_description', data.jobText)}`

      const result = await model.generateContent(prompt, aiRequestOptions())
      const parsed = prepGuideResponseSchema.parse(parseJsonFromModel(result.response.text()))

      return json(parsed)
    } catch (error) {
      return aiErrorResponse('prep-guide', error)
    }
  }
)
