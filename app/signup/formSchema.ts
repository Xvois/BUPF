import {z} from "zod"

// TOOD: FORCE @bath.ac.uk
export const formSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    password: z.string().min(8, {message: "Password must be at least 8 characters long"}),
    confirmPassword: z.string(),
    course: z.string(),
    yearOfStudy: z.coerce.number().min(1, {message: "Year of study must be at least 1"}).max(5, {message: "Year of study must be at most 5"}),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
})