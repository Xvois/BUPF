import {z} from "zod";

const module_value = z.object({
    id: z.string(),
    is_required: z.boolean(),
})

export const formSchema = z.object({
    modules: z.array(module_value),
    course: z.number(),
    year: z.number(),
})