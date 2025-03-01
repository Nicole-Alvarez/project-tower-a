import { LessonType } from "@prisma/client";
import { z } from "zod";
import { File } from "formdata-node";

export const createCourseLessonItemSchema = {
  form: z.object({
    courseLessonId: z.string().refine(id => !isNaN(Number(id)), {
      message: 'Invalid lesson id'
    }),
    title: z.string().trim().min(1, {
      message: 'Title is required'
    }),
    type: z.enum([
      LessonType.QUESTIONNAIRE,
      LessonType.VIDEO,
      LessonType.WYSIWYG,
    ]),
    questionnaireItems: z.string().optional(),
    video: z.instanceof(File).optional(),
    content: z.string().optional(),
  })
}

export const updateCourseLessonItemsSchema = {
  json: z.array(z.object({
    id: z.number().refine(id => !(id <= 0), {
      message: 'Must not contain invalid lesson item id.'
    }),
    ordinalNumber: z.number().refine(value => !(value <= 0), {
      message: 'Must not contain invalid ordinal number.'
    }).optional(),
    title: z.string().trim().min(1, {
      message: 'Must not be empty' 
    }).optional(),
    type: z.enum([
      LessonType.QUESTIONNAIRE,
      LessonType.VIDEO,
      LessonType.WYSIWYG,
    ]).optional(),
    content: z.string().trim().min(1, {
      message: 'Must not be empty' 
    }).optional(),
  }))
}

export const updateCourseLessonItemSchema = {
  form: z.object({
    title: z.string().trim().min(1, {
      message: 'Title is required'
    }).optional(),
    type: z.enum([
      LessonType.QUESTIONNAIRE,
      LessonType.VIDEO,
      LessonType.WYSIWYG,
    ]).optional(),
    questionnaireItems: z.string().optional(),
    video: z.instanceof(File).optional(),
    content: z.string().optional(),
  })
}

export const deleteCourseLessonItemSchema = {
  params: z.object({
    id: z.number().refine(id => !(id <= 0), {
      message: 'Invalid lesson item id',
    }),
  }),
};