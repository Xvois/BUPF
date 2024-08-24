import z from "zod";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
	heading: z.string().min(1, "Heading must be at least 1 character long."),
	header_picture: z
		.union([
			z.string().max(0),
			z.any()
				.refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
				.refine(
					(file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
					"Only .jpg, .jpeg, .png and .webp formats are supported."
				)
		])
		.optional(),
	content: z.string().min(1, "Content must be at least 1 character long."),
});

export default formSchema;