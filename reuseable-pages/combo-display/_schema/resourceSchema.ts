import {z} from "zod";

export const resourceSchema = z.object({
    title: z.string().min(5).max(30),
    description: z.string().max(50),
    url: z.string(),
})