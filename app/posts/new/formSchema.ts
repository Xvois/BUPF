import {z} from "zod";
import {UseFormReturn} from "react-hook-form";

export const formSchema = z.object({
    heading: z.string().min(5).max(100),
    content: z.string().min(10).max(5000),
    type: z.enum(["question", "discussion", "article"]),
    anonymous: z.boolean(),
    target: z.string(),
    targetType: z.enum(["module", "topic"]),
})

export type formType = UseFormReturn<z.infer<typeof formSchema>, any, undefined>;
