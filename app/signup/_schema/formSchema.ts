import {z} from "zod"

export const formSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email().min(0).refine(data => data.includes("@bath.ac.uk"), "Please enter a valid Bath email address."),
    password: z.string().min(8, {message: "Password must be at least 8 characters long"}),
    confirmPassword: z.string(),
    course: z.string(),
    yearOfStudy: z.coerce.number().min(2000, {message: "Enter a valid start year for your course."}).max(new Date().getFullYear(), {message: "This forum only supports enrolled students."}).optional(),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
}).refine(data => data.course === "0" && data.yearOfStudy === undefined || data.course !== "0" && data.yearOfStudy !== undefined, {
    message: "Please enter your year of study",
    path: ["yearOfStudy"]
})
