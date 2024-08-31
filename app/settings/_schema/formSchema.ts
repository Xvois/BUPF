import {z} from 'zod';

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const formSchema = z.object({
    firstName: z.string().min(0),
    lastName: z.string().min(0),
    email: z.string().email().min(0).refine(data => data.includes("@bath.ac.uk"), "Please enter a valid Bath email address."),
    course: z.string(),
    yearOfStudy: z.coerce.number().max(new Date().getFullYear(), {message: "This forum only supports enrolled students."}).optional(),
    profilePicture: z
        .instanceof(File)
        .refine((file) => file.size && file.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
        .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
            "Only .jpg, .jpeg, .png and .webp formats are supported."
        ).or(z.string())
        .refine((emptyString) => emptyString === "", "Unexpected string. (Should be empty or a file)")
})
