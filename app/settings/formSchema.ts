import {z} from 'zod';

export const formSchema = z.object({
    firstName: z.string().min(0),
    lastName: z.string().min(0),
    email: z.string().email().min(0),
    course: z.string().min(0),
    yearOfStudy: z.coerce.number().min(2000, {message: "Enter a valid start year for your course."}).max(new Date().getFullYear(), {message: "This forum only supports enrolled students."}).optional(),
}).refine(data => data.course === "0" && data.yearOfStudy === undefined || data.course !== "0" && data.yearOfStudy !== undefined, {
    message: "Please enter your year of study",
    path: ["yearOfStudy"]
})
