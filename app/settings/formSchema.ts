import {z} from 'zod';

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const formSchema = z.object({
    firstName: z.string().min(0),
    lastName: z.string().min(0),
    email: z.string().email().min(0),
    course: z.string().min(0),
    yearOfStudy: z.coerce.number().min(2000, {message: "Enter a valid start year for your course."}).max(new Date().getFullYear(), {message: "This forum only supports enrolled students."}).optional(),
    profilePicture: z
        .any()
        .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
        .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
            "Only .jpg, .jpeg, .png and .webp formats are supported."
        )
}).refine(data => data.course === "0" && data.yearOfStudy === undefined || data.course !== "0" && data.yearOfStudy !== undefined, {
    message: "Please enter your year of study",
    path: ["yearOfStudy"]
})
