import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  age: z.number().int().positive().max(120, { message: "Age must be between 1 and 120" }).optional(),
  bio: z.string().max(500, { message: "Bio must not exceed 500 characters" }).optional(),
  createdAt: z.date().optional(),
});

export type UserFormData = z.infer<typeof userSchema>;

