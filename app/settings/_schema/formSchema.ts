import {z} from 'zod';


const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const formSchema = z.object({
    firstName: z.string().min(0),
    lastName: z.string().min(0),
    email: z.string().email().min(0).refine(data => data.includes("@bath.ac.uk"), "Please enter a valid Bath email address."),
    course: z.number(),
    year: z.coerce.number().min(0, {message: "Enter a valid year."}).max(5, {message: "Years above 5 are not expected."}).optional(),
    profilePicture: z
        .instanceof(Blob)
        .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
        .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
            ".jpg, .jpeg, .png and .webp files are accepted."
        ).optional(),
})
