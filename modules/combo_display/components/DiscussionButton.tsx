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
import {formSchema} from "@/modules/combo_display/schema/formSchema";
import {zodResolver} from "@hookform/resolvers/zod";
import post from "@/modules/combo_display/actions/post";
import {Form} from "@/components/ui/form";
import FormSkeleton from "@/modules/combo_display/components/FormSkeleton";
import {Button} from "@/components/ui/button";
import {BookPlus} from "lucide-react";

const LazyDiscussionForm = lazy(() => import("./discussion-form"));

export default function DiscussionButton(props: { topic_id: string }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        mode: "onSubmit",
        resolver: zodResolver(formSchema),
        defaultValues: {
            heading: "",
            content: "",
            type: "discussion",
            target: props.topic_id,
            anonymous: false,
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        await post(values);
        setIsDialogOpen(false);
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={(e) => setIsDialogOpen(e)}>
            <DialogTrigger>
                <Button variant={"default"} className={"space-x-2"}>
                    <BookPlus className={"h-4 w-4"}/>
                    <p>Start a discussion</p>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Start a discussion</DialogTitle>
                    <DialogDescription>
                        Ask a question or start a discussion about this topic.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <Suspense fallback={<FormSkeleton/>}>
                            <LazyDiscussionForm/>
                        </Suspense>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>

    );
}