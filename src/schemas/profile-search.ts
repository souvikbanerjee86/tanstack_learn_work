import z from 'zod'

export const profileSearchSchema = z.object({
    jobId: z.string().min(1, "Job Id is required"),
    jobDescription: z.string().min(50, "Job Description must be at least 50 characters long"),
    preferedDomain: z.string().min(1, "Prefered Domain is required"),
    skills: z.string().min(1, "Skills are required"),
    experience: z.number()
})


export const candidateAddSchema = z.object({
    jobId: z.string().min(5, "Job Id is required"),
    jobName: z.string().min(5, "Job Name is required"),
    candidateName: z.string().min(5, "Candidate Name is required"),
    candidateEmail: z.email(),
    candidateCv: z.file().nullable()
})