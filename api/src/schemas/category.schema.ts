import { z } from "zod";

export const updateCategorySchema = {
    param: z.object({
      id: z.string().refine(id => !isNaN(Number(id)), {
        message: 'Invalid course id'
      })
    }),
    json: z.object({
      name: z.string().optional()
    })
  }