import { z } from "zod";

export const upsertQuestionnaireAnswerSchema = {
  param: z.object({
    id: z.string().refine(value => !isNaN(Number(value)), {
      message: 'Invalid lesson item id'
    }),
  }),
  json: z.object({
    questionId: z.number().min(1, {
      message: 'Invalid question id'
    }),
    lessonId: z.number().min(1, {
      message: 'Invalid lesson id'
    }),
    answer: z.array(z.string()),
  })
}

export const getQuestionAnswerSchema = {
  param: z.object({
    id: z.string().refine(value => !isNaN(Number(value)), {
      message: 'Invalid question id'
    }),
    studentId: z.number().optional(),
  })
}