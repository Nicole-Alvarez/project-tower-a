import { z } from "zod";

export const studentLogInSchema = {
  json: z.object({
    email: z.string().email(),
    password: z.string()
      .trim().min(1, {
        message: 'Password is required'
      }),
  })
}

export const teacherLogInSchema = {
  json: z.object({
    email: z.string().email(),
    password: z.string()
      .trim().min(1, {
        message: 'Password is required'
      }),
  })
}

export const userSignUpSchema = {
  json: z.object({
    name: z.string()
      .trim().min(1, {
        message: 'Full name is required'
      }),
    email: z.string().email(),
    password: z.string()
      .trim().min(8, {
        message: "Password must be at least 8 characters."
      })
      .refine((password: string) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
      }, {
        message: 'Must contain an uppercase letter, lowercase letter, number, and special character (@$!%*?&).'
      }),
  })
}

export const adminLogInSchema = {
  json: z.object({
    email: z.string().email(),
    password: z.string()
      .trim().min(1, {
        message: 'Password is required'
      }),
  })
}

export const verifyAccountSchema = {
  json: z.object({
    token: z.string()
      .trim().min(1, {
        message: 'Token is required'
      }),
    id: z.number(),
  })
}

export const resendVerificationLinkSchema = {
  json: z.object({
    id: z.number(),
  })
}

export const userLogInSchema = {
  json: z.object({
    email: z.string().email(), 
  })
}
