import { CourseLessonProgressStatus } from "@prisma/client";
import { z } from "zod";

export const createCourseLessonProgressSchema = {
  json: z.object({
    enrolledCourseId: z.number().refine(value => !isNaN(Number(value)), {
      message: 'Invalid enrolled course id'
    }),
    studentId: z.number().refine(value => !isNaN(Number(value)), {
      message: 'Invalid enrolled course id'
    }),
    lessonId: z.number().refine(value => !isNaN(Number(value)), {
      message: 'Invalid enrolled course id'
    }),
    lessonItemId: z.number().refine(value => !isNaN(Number(value)), {
      message: 'Invalid enrolled course id'
    }),
    status: z.enum([
      CourseLessonProgressStatus.COMPLETED,
      CourseLessonProgressStatus.IN_PROGRESS,
    ])
  })
}
