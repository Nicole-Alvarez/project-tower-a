import { z } from "zod";

export const updateUserImageProfileSchema = {
  param: z.object({
    id: z.string().refine(id => !isNaN(Number(id)), {
      message: 'Invalid student  id'
    })
  }),
}