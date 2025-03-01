import { CourseStatus } from "@prisma/client";
import { z } from "zod";

export const getCoursesSchema = {
  query: z.object({
    status: z.string().optional(),
    search: z.string().optional(),
    skip: z.string()
      .refine(skip => !isNaN(Number(skip)), {
        message: 'Invalid skip value'
      }).optional(),
    take: z.string()
      .refine(take => !isNaN(Number(take)), {
        message: 'Invalid take value'
      }).optional(),
    categories: z.string()
      .refine(categories => {
        try {
          if (!categories) return true;

          const value = JSON.parse(categories);
          if (!Array.isArray(value)) {
            return false;
          }
          return value.every((id: any) => typeof id === 'number');
        } catch (e) {
          return false;
        }
      }, {
        message: 'Categories must be an array of numbers'
      }).optional()
  })
}

export const updateCourseSchema = {
  param: z.object({
    id: z.string().refine(id => !isNaN(Number(id)), {
      message: 'Invalid course id'
    })
  }),
  json: z.object({
    title: z.string().optional(),
    categoryId: z.number().optional(),
    overview: z.string().optional(),
    language: z.string().optional(),
    status: z.enum([
      CourseStatus.ACTIVE,
      CourseStatus.IN_PROGRESS,
      CourseStatus.COMPLETED,
      CourseStatus.ARCHIVED,
    ]).optional(),
  })
}

export const updateCourseImageSchema = {
  param: z.object({
    id: z.string().refine(id => !isNaN(Number(id)), {
      message: 'Invalid course id'
    })
  }),
}

export const enrolCourseSchema = {
  json: z.object({
    studentId: z.number().min(1, {
      message: 'Invalid student id'
    }),
    courseId: z.number().min(1, {
      message: 'Invalid course id'
    }),
  })
}

export const updateCourseTeacherSchema = {
  param: z.object({
    id: z.string().refine(value => !isNaN(Number(value)), {
      message: 'Invalid course id'
    })
  }),
  json: z.object({
    teacherId: z.number()
  }),
}
