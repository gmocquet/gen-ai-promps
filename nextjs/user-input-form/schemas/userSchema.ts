import { z } from 'zod'

export const userSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  age: z.number().int().positive().max(120, { message: "Age must be between 1 and 120" }),
  isSubscribed: z.boolean(),
})

export type UserFormData = z.infer<typeof userSchema>

