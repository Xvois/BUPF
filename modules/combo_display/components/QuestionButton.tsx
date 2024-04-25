'use client'
import React, {Suspense} from "react";
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
import {formSchema} from "@/modules/combo_display/schema/formSchema";
import {zodResolver} from "@hookform/resolvers/zod";
import post from "@/modules/combo_display/actions/post";
import {Form} from "@/components/ui/form";
import FormSkeleton from "@/modules/combo_display/components/FormSkeleton";
import {Button} from "@/components/ui/button";

const LazyQuestionForm = React.lazy(() => import("./question-form"));

export default function QuestionButton(props: { module_id: string }) {
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        mode: "onSubmit",
        resolver: zodResolver(formSchema),
        defaultValues: {
            heading: "",
            content: "",
            type: "question",
            anonymous: false,
            target: props.module_id,
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        await post(values);
        setIsDialogOpen(false);
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={(e) => setIsDialogOpen(e)}>
            <DialogTrigger>
                <Button variant={"secondary"}>Ask a question</Button>
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