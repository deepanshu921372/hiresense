import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z
  .object({
    email: z.string().email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
    displayName: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be under 50 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

export const resumeUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: 'File size must be under 5MB',
    })
    .refine(
      (file) => ['application/pdf', 'text/plain'].includes(file.type),
      { message: 'Only PDF and TXT files are supported' }
    ),
});

export const jobFiltersSchema = z.object({
  query: z.string().max(100).optional(),
  skills: z.array(z.string().max(50)).max(10).optional(),
  jobType: z.array(z.enum(['full-time', 'part-time', 'contract', 'internship'])).optional(),
  workMode: z.array(z.enum(['remote', 'hybrid', 'onsite'])).optional(),
  location: z.string().max(100).optional(),
  datePosted: z.enum(['24h', 'week', 'month', 'any']).optional(),
  minMatchScore: z.number().min(0).max(100).optional(),
  page: z.number().min(1).max(1000).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z.enum(['matchScore', 'date', 'company']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export type JobFiltersInput = z.infer<typeof jobFiltersSchema>;

export const applicationUpdateSchema = z.object({
  status: z.enum(['applied', 'interview', 'offer', 'rejected', 'withdrawn']).optional(),
  notes: z.string().max(5000).optional(),
});

export const applicationFiltersSchema = z.object({
  status: z.enum(['applied', 'interview', 'offer', 'rejected', 'withdrawn', 'all']).optional(),
  dateRange: z.enum(['week', 'month', 'quarter', 'year', 'all']).optional(),
  company: z.string().max(100).optional(),
  search: z.string().max(100).optional(),
  sortBy: z.enum(['date', 'company', 'status', 'matchScore']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.number().min(1).max(1000).default(1),
  limit: z.number().min(1).max(100).default(20),
});

export type ApplicationUpdateInput = z.infer<typeof applicationUpdateSchema>;
export type ApplicationFiltersInput = z.infer<typeof applicationFiltersSchema>;

export const chatMessageSchema = z.object({
  message: z.string().min(1, 'Message is required').max(1000),
  conversationHistory: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().max(5000),
      })
    )
    .max(50)
    .optional(),
});

export type ChatMessageInput = z.infer<typeof chatMessageSchema>;

export const userPreferencesSchema = z.object({
  desiredRoles: z.array(z.string().max(100)).max(10).optional(),
  desiredLocations: z.array(z.string().max(100)).max(10).optional(),
  workMode: z.array(z.enum(['remote', 'hybrid', 'onsite'])).optional(),
  jobTypes: z.array(z.enum(['full-time', 'part-time', 'contract', 'internship'])).optional(),
  salaryRange: z
    .object({
      min: z.number().min(0),
      max: z.number().min(0),
      currency: z.string().max(3),
    })
    .optional(),
});

export type UserPreferencesInput = z.infer<typeof userPreferencesSchema>;

export const pendingApplicationSchema = z.object({
  jobId: z.string().min(1),
  jobTitle: z.string().min(1).max(200),
  company: z.string().min(1).max(200),
  jobUrl: z.string().url(),
  location: z.string().max(200).optional(),
});

export const confirmApplicationSchema = z.object({
  pendingId: z.string().min(1),
  response: z.enum(['applied', 'browsing', 'earlier']),
});

export type PendingApplicationInput = z.infer<typeof pendingApplicationSchema>;
export type ConfirmApplicationInput = z.infer<typeof confirmApplicationSchema>;
