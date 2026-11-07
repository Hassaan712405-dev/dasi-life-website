import { z } from 'zod';

export const emailSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: 'Please enter a valid email address.' }),
});

export type EmailInput = z.infer<typeof emailSchema>;