import {z} from "zod";

export const postSchema = z.object({
	heading: z.string().min(5).max(100),
	content: z.string().min(10).max(5000),
	type: z.enum(["question", "article"]),
	anonymous: z.boolean(),
	target: z.string(),
	tags: z.array(z.string())
})

