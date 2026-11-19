import { aiRequestOptions, getGenAI } from '@/lib/ai/gemini'
import { aiErrorResponse } from '@/lib/ai/errors'
import { withJsonGuard } from '@/lib/security/api-guard'
import { PROMPT_INJECTION_DEFENSE, parseJsonFromModel, untrusted } from '@/lib/security/prompt'
import { techPrepRequestSchema, techPrepResponseSchema } from '@/lib/security/schemas'
import { sanitizeAiHtml } from '@/lib/security/sanitize-html'
import { json } from '@/lib/security/http'

export const runtime = 'nodejs'

export const POST = withJsonGuard(
  {
    scope: 'agents:tech-prep',
    schema: techPrepRequestSchema,
    limit: 8,
    windowMs: 60_000,
  },
  async (_request, data) => {
    try {
      const genAI = getGenAI()
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        systemInstruction: `You are a world-class technical interview coach.
Create a tailored technical interview preparation module and return JSON only:
{
  "id": "technical_custom",
  "title": "Custom Technical: <role>",
  "description": "<summary>",
  "lessons": [{ "title": "<title>", "contentHtml": "<safe HTML lesson>" }],
  "quiz": {
    "question": "<question>",
    "options": ["a", "b", "c"],
    "correctAnswer": 0,
    "explanation": "<why>"
  }
}
contentHtml may use only <p>, <ul>, <li>, <strong>, <em>, <br>, and <div class="bg-slate-50 p-4 rounded-xl border mt-4">.
Never include scripts, styles, event handlers, iframes, links, or images.

${PROMPT_INJECTION_DEFENSE}`,
        generationConfig: { responseMimeType: 'application/json' },
      })

      const prompt = `TARGET ROLE:
${untrusted('target_role', data.targetRole || 'Not specified')}

JOB DESCRIPTION:
${data.jobText ? untrusted('job_description', data.jobText) : 'Not provided. Provide generic top-tier prep for the target role.'}`

      const result = await model.generateContent(prompt, aiRequestOptions())
      const parsed = techPrepResponseSchema.parse(parseJsonFromModel(result.response.text()))

      const safe = {
        ...parsed,
        lessons: parsed.lessons.map((lesson) => ({
          ...lesson,
          contentHtml: sanitizeAiHtml(lesson.contentHtml),
        })),
      }

      return json(safe)
    } catch (error) {
      return aiErrorResponse('tech-prep', error)
    }
  }
)
