import { CourseLessonProgressionType } from "@prisma/client";
import { z } from "zod";

export const createCourseLessonSchema = {
  json: z.object({
    courseId: z.number(),
    title: z.string().trim().min(1, {
      message: 'Title is required'
    }),
    progressionType: z.enum([
      CourseLessonProgressionType.FREE,
      CourseLessonProgressionType.STRICT,
    ]),
    description: z.string().optional()
  })
};

export const updateCourseLessonSchema = {
  json: z.object({
    title: z.string().trim().min(1, {
      message: 'Title is required'
    }),
    description: z.string(),
    progressionType: z.enum([
      CourseLessonProgressionType.FREE,
      CourseLessonProgressionType.STRICT,
    ]),
  }),
  param: z.object({
    id: z.string().refine(id => !isNaN(Number(id)), {
      message: 'Invalid lesson id'
    })
  })
}

export const updateCourseLessonsSchema = {
  json: z.array(z.object({
    id: z.number().refine(id => !(id <= 0), {
      message: 'Must have no invalid id'
    }),
    ordinalNumber:  z.number().refine(id => !(id <= 0), {
      message: 'Must have no invalid ordinal number'
    }).optional(), 
    title: z.string().trim().min(1, {
      message: 'Title is required'
    }).optional(),
    description: z.string().trim().min(1, {
      message: 'Description is required'
    }).optional()
  }))
}