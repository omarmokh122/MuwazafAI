import { z } from 'zod'

const text = (max: number, min = 1) => z.string().trim().min(min).max(max)

export const chatMessageSchema = z
  .object({
    role: z.enum(['user', 'assistant']),
    content: text(6000),
  })
  .strict()

export const chatMessagesSchema = z.array(chatMessageSchema).min(1).max(30)

export const benchmarkContextSchema = z
  .record(z.string(), z.unknown())
  .refine((value) => JSON.stringify(value).length <= 8000, {
    message: 'Context is too large.',
  })
  .optional()

export const benchmarkRequestSchema = z
  .object({
    mode: z.enum(['title', 'jd']),
    jobTitle: text(120).optional(),
    jobDescription: text(40000).optional(),
  })
  .strict()
  .refine(
    (data) => (data.mode === 'title' ? Boolean(data.jobTitle) : Boolean(data.jobDescription)),
    { message: 'A job title or job description is required.' }
  )

export const benchmarkChatRequestSchema = z
  .object({
    messages: chatMessagesSchema,
    context: benchmarkContextSchema,
  })
  .strict()

export const cvMatcherRequestSchema = z
  .object({
    cvText: text(60000, 10),
    jobText: text(40000, 10),
  })
  .strict()

export const skillsetRequestSchema = z
  .object({
    role: text(120, 2),
  })
  .strict()

export const interviewRequestSchema = z
  .object({
    messages: chatMessagesSchema,
    jobText: text(40000, 10),
    gaps: z.array(text(120)).max(50).default([]),
    tone: text(60).optional(),
  })
  .strict()

export const laborChatRequestSchema = z
  .object({
    messages: chatMessagesSchema,
  })
  .strict()

export const coverLetterRequestSchema = z
  .object({
    cvText: text(60000, 10),
    jobText: text(40000, 10),
    tone: text(60).optional(),
    date: text(60).optional(),
    hiringManagerName: text(120).optional(),
    hiringManagerTitle: text(120).optional(),
    companyName: text(160).optional(),
    companyAddress: text(240).optional(),
  })
  .strict()

export const techPrepRequestSchema = z
  .object({
    targetRole: text(160).optional(),
    jobText: text(40000).optional(),
  })
  .strict()
  .refine((data) => Boolean(data.targetRole || data.jobText), {
    message: 'A target role or job description is required.',
  })

export const prepGuideRequestSchema = z
  .object({
    cvText: text(60000, 10),
    jobText: text(40000, 10),
    gaps: z.array(text(120)).max(50).default([]),
    matching: z.array(text(120)).max(50).default([]),
  })
  .strict()

export const exportPdfRequestSchema = z
  .object({
    text: text(20000, 1),
  })
  .strict()

const salaryRangeSchema = z.object({
  min: text(40),
  max: text(40),
  average: text(40),
})

export const benchmarkResponseSchema = z.object({
  roleName: text(160),
  summary: text(2000),
  localRange: salaryRangeSchema,
  remoteRange: salaryRangeSchema,
  seniorityMultipliers: z
    .array(
      z.object({
        level: text(80),
        multiplier: text(40),
        description: text(500),
      })
    )
    .max(12),
  premiumSkills: z
    .array(
      z.object({
        skill: text(120),
        bumpAmount: text(60),
        reason: text(500),
      })
    )
    .max(20),
})

export const cvMatcherResponseSchema = z.object({
  score: z.coerce.number().min(0).max(100),
  matching: z.array(text(120)).max(80),
  gaps: z.array(text(120)).max(80),
  analysis: text(3000),
})

export const skillsetResponseSchema = z.object({
  role: text(160),
  description: text(1500),
  hardSkills: z
    .array(z.object({ name: text(160), importance: text(800) }))
    .max(40),
  softSkills: z
    .array(z.object({ name: text(160), importance: text(800) }))
    .max(40),
  emergingTrends: z
    .array(z.object({ name: text(160), importance: text(800) }))
    .max(40),
})

export const techPrepResponseSchema = z.object({
  id: text(80),
  title: text(200),
  description: text(1500),
  lessons: z
    .array(
      z.object({
        title: text(200),
        contentHtml: z.string().min(1).max(30000),
      })
    )
    .max(10),
  quiz: z.object({
    question: text(1000),
    options: z.array(text(500)).min(2).max(6),
    correctAnswer: z.coerce.number().int().min(0).max(5),
    explanation: text(2000),
  }),
})

export const prepGuideResponseSchema = z.object({
  interviewFlow: z.array(text(300)).max(20),
  matchingPitch: text(3000),
  gapBridges: z
    .array(z.object({ gapSkill: text(160), bridgeStrategy: text(1500) }))
    .max(40),
  keywordsToDrop: z.array(text(120)).max(40),
})

export const laborRightsCategorySchema = z.object({
  categories: z
    .array(
      z.object({
        id: z.string(),
        title_en: z.string(),
        title_ar: z.string().optional(),
        summary_en: z.string(),
        summary_ar: z.string().optional(),
        details: z.array(
          z.object({
            subtitle_en: z.string(),
            subtitle_ar: z.string().optional(),
            text_en: z.string(),
            text_ar: z.string().optional(),
            article: z.string().nullable().optional(),
          })
        ),
      })
    )
    .max(20),
})
