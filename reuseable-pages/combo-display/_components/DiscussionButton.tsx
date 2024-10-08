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
import {Button, ButtonProps} from "@/components/ui/button";
import {BookPlus} from "lucide-react";

const LazyDiscussionForm = lazy(() => import("./discussion-form"));

export default function QuestionButton({topic_id, ...props}: { topic_id: string } & ButtonProps) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const form = useForm<z.infer<typeof postSchema>>({
		mode: "onSubmit",
		resolver: zodResolver(postSchema),
		defaultValues: {
			heading: "",
			content: "",
			type: "discussion",
			target: topic_id,
			anonymous: false,
		}
	})

	const onSubmit = async (values: z.infer<typeof postSchema>) => {
		await uploadPost(values);
		setIsDialogOpen(false);
	}

	return (
		<Dialog open={isDialogOpen} onOpenChange={(e) => setIsDialogOpen(e)}>
			<DialogTrigger asChild>
				<Button {...props} className={"space-x-2"}>
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