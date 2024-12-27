import {z} from "zod"

export const formSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email().min(0).refine(data => data.includes("@bath.ac.uk"), "Please enter a valid Bath email address."),
    password: z.string().min(8, {message: "Password must be at least 8 characters long"}),
    confirmPassword: z.string(),
    course: z.number(),
    year: z.coerce.number().min(0, {message: "Enter a valid year."}).max(5, {message: "Years above 5 are not expected."}).optional(),
    roundup: z.boolean(),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
}).refine(data => data.course === 0 && data.year === undefined || data.course !== 0 && data.year !== undefined, {
    message: "Please enter your year of study",
    path: ["yearOfStudy"]
})
