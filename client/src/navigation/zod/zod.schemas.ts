import { z } from 'zod';

export const loginSchema = z.object({
   email: z.string().email('Invalid email address').nonempty('Email is required'),
   password: z.string().min(6, 'Password must be at least 6 characters').nonempty('Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;