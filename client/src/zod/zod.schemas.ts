import { z } from 'zod';

export const loginSchema = z.object({
   email: z.string().email('Invalid email address').nonempty('Email is required'),
   password: z.string().min(6, 'Password must be at least 6 characters').nonempty('Password is required'),
});

export const registerSchema = z.object({
   email: z.string().email('Invalid email address').nonempty('Email is required'),
   password: z.string().min(6, 'Password must be at least 6 characters').nonempty('Password is required'),
   confirmPassword: z.string(),
   name: z.string().optional(),
   dateOfBirth: z.string().nonempty('date of birth is required'),
   instagram: z.string().optional(),
   telegram: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
   message: "Passwords don't match",
   path: ['confirmPassword'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;