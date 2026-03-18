import z from 'zod'
export const evaluationSchema = z.object({
    verdict: z.enum(["ACCEPT", "REJECT"]).refine((value) => value !== null, "Verdict is required"),
    feedback: z.string().min(50, "Feedback is required, and must be 50 Charecter long"),
})