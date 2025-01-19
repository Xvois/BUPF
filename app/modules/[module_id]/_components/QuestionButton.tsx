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
import {zodResolver} from "@hookform/resolvers/zod";
import {Form} from "@/components/ui/form";
import {Button, ButtonProps} from "@/components/ui/button";
import {CircleFadingPlus} from "lucide-react";
import {postSchema} from "@/app/modules/[module_id]/_schema/postSchema";
import uploadPost from "@/app/modules/[module_id]/_actions/uploadPost";
import FormSkeleton from "@/app/modules/[module_id]/_components/FormSkeleton";

const LazyQuestionForm = lazy(() => import("./question-form"));

export default function QuestionButton({module_id, tags, ...props}: { module_id: string, tags: string[] } & ButtonProps) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const form = useForm<z.infer<typeof postSchema>>({
		mode: "onSubmit",
		resolver: zodResolver(postSchema),
		defaultValues: {
			heading: "",
			content: "",
			type: "question",
			anonymous: false,
			target: module_id,
			tags: []
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
					<CircleFadingPlus className={"h-4 w-4"}/>
					<p>Ask a question</p>
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
							<LazyQuestionForm module_id={module_id} tags={tags}/>
						</Suspense>
					</form>
				</Form>
			</DialogContent>
		</Dialog>

	);
}