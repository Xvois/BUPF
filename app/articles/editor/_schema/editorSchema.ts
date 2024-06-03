import z from "zod";

const formSchema = z.object({
	heading: z.string().min(1, "Heading must be at least 1 character long."),
	heading_picture: z.string().optional(),
	content: z.string().min(1, "Content must be at least 1 character long."),
});

export default formSchema;