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
import {formSchema} from "@/reuseable-pages/combo-display/_schema/formSchema";
import {zodResolver} from "@hookform/resolvers/zod";
import post from "@/reuseable-pages/combo-display/_actions/post";
import {Form} from "@/components/ui/form";
import FormSkeleton from "@/reuseable-pages/combo-display/_components/FormSkeleton";
import {Button, ButtonProps} from "@/components/ui/button";
import {CircleFadingPlus} from "lucide-react";

const LazyQuestionForm = lazy(() => import("./question-form"));

export default function QuestionButton({module_id, ...props}: { module_id: string } & ButtonProps) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		mode: "onSubmit",
		resolver: zodResolver(formSchema),
		defaultValues: {
			heading: "",
			content: "",
			type: "question",
			anonymous: false,
			target: module_id,
		}
	})

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		await post(values);
		setIsDialogOpen(false);
	}

	return (
		<Dialog open={isDialogOpen} onOpenChange={(e) => setIsDialogOpen(e)}>
			<DialogTrigger>
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
							<LazyQuestionForm/>
						</Suspense>
					</form>
				</Form>
			</DialogContent>
		</Dialog>

	);
}