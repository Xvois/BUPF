'use client'
import {lazy, Suspense, useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {postSchema} from "@/reuseable-pages/combo-display/_schema/postSchema";
import {zodResolver} from "@hookform/resolvers/zod";
import uploadPost from "@/reuseable-pages/combo-display/_actions/uploadPost";
import {Form} from "@/components/ui/form";
import FormSkeleton from "@/reuseable-pages/combo-display/_components/FormSkeleton";
import {Button} from "@/components/ui/button";
import {CircleFadingPlus} from "lucide-react";

const LazyQuestionForm = lazy(() => import("../../../reuseable-pages/combo-display/_components/question-form"));

export default function QuestionButton() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const form = useForm<z.infer<typeof postSchema>>({
        mode: "onSubmit",
        resolver: zodResolver(postSchema),
        defaultValues: {
            heading: "",
            content: "",
            type: "question",
            anonymous: false,
            target: "",
        }
    })

    const onSubmit = async (values: z.infer<typeof postSchema>) => {
        await uploadPost(values);
        setIsDialogOpen(false);
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={(e) => setIsDialogOpen(e)}>
            <DialogTrigger asChild>
                <Button className={"space-x-2"}>
                    <CircleFadingPlus className={"h-4 w-4"}/>
                    <p>Quick Question</p>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Start a discussion</DialogTitle>
                    <DialogDescription>
                        Ask a question about this module.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <Suspense fallback={<FormSkeleton/>}>
                            <LazyQuestionForm/>
                        </Suspense>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>

    );
}