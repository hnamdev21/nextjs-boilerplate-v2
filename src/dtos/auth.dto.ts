import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});
export type LoginDTO = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: z.email(),
  name: z.string().min(1),
  password: z.string(),
});
export type RegisterDTO = z.infer<typeof registerSchema>;

export const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string(),
});
export type ResetPasswordDTO = z.infer<typeof resetPasswordSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string(),
});
export type ChangePasswordDTO = z.infer<typeof changePasswordSchema>;
