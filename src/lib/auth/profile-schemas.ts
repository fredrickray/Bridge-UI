import { z } from 'zod'

export const profileSchema = z.object({
  fullName: z.string().min(2, 'Enter your full name'),
  phone: z
    .string()
    .trim()
    .refine((value) => value === '' || /^[+()\d\s-]{7,20}$/.test(value), {
      message: 'Enter a valid phone number',
    }),
  company: z.string().max(80, 'Keep company under 80 characters'),
  timezone: z.string().min(1, 'Choose a timezone'),
})

export const emailSchema = z.object({
  email: z.email('Enter a valid email address'),
})

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(8, 'Enter your current password'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Include at least one uppercase letter')
      .regex(/[0-9]/, 'Include at least one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type ProfileValues = z.infer<typeof profileSchema>
export type EmailValues = z.infer<typeof emailSchema>
export type PasswordChangeValues = z.infer<typeof passwordChangeSchema>

export const TIMEZONE_OPTIONS = [
  'Africa/Lagos',
  'Africa/Accra',
  'Europe/London',
  'Europe/Berlin',
  'America/New_York',
  'America/Los_Angeles',
  'Asia/Dubai',
  'Asia/Singapore',
  'UTC',
] as const
