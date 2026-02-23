import z from 'zod'

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
})

export const signupSchema = z.object({
    fullName: z.string().min(5),
    email: z.email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
})

export const jobPostSchema = z.object({
    jobId: z.string().min(2),
    jobTitle: z.string().min(2),
    jobType: z.enum(['fulltime', 'parttime']),
    jobDescription: z.string().min(100),
    startDate: z.string(),
    endDate: z.string(),
    locations: z.array(z.string()).min(1),
})