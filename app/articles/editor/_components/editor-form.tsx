'use client'

import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {Input} from "@/components/ui/input";
import RichTextArea from "@/components/RichTextArea";
import {ExternalLink} from "lucide-react";
import z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button";
import formSchema from "@/app/articles/editor/_schema/editorSchema";
import {handlePublish, handleSave} from "@/app/articles/editor/_actions/editorHandler";
import {useEffect, useRef} from "react";

export default function EditorForm(props: { defaultValues: z.infer<typeof formSchema>, draftID?: number }) {
	const form = useForm<z.infer<typeof formSchema>>({
		defaultValues: props.defaultValues,
		resolver: zodResolver(formSchema)
	});

	// Set up the form state for our default values
	useEffect(() => {
		for (const key in props.defaultValues) {
			// This is safe because the keys of the default values are the same as the keys of the form schema
			const formKey = key as keyof z.infer<typeof formSchema>;
			form.setValue(formKey, props.defaultValues[formKey]);
		}
	}, [form, props.defaultValues]);


	// Auto save the form after a 300ms debounce time
	// given that the form is valid and a draftID is present
	let timeoutId = useRef<NodeJS.Timeout | null>(null);
	useEffect(() => {
		const handleSaveDebounced = (...args: Parameters<typeof handleSave>) => {
			if (timeoutId.current) {
				clearTimeout(timeoutId.current);
			}

			timeoutId.current = setTimeout(() => {
				handleSave(...args);
			}, 300); // 300ms debounce time
		};

		const watch = form.watch((data) => {
			if (form.formState.isValid && props.draftID) {
				// Since the form is valid, we can safely cast the data to the form schema type
				const formData = data as z.infer<typeof formSchema>;
				handleSaveDebounced(formData, props.draftID);
			}
		})

		return () => {
			watch.unsubscribe();
		}
	}, [form, props.draftID]);

	const onSubmit = form.handleSubmit(async (data, e) => {
		const nativeEvent = e?.nativeEvent as { submitter: HTMLButtonElement } | undefined;
		const type = nativeEvent?.submitter?.value;
		switch (type) {
			case "draft":
				await handleSave(data, props.draftID);
				break;
			case "publish":
				await handlePublish(data);
				break;
		}
	})

	return (
		<Form {...form}>
			<form onSubmit={onSubmit} className={"space-y-8 p-8"}>
				<FormField
					control={form.control}
					name={"heading"}
					render={({field}) => (
						<FormItem>
							<FormLabel>Heading</FormLabel>
							<FormControl>
								<Input defaultValue={props.defaultValues.heading} {...field} id="heading"
									   placeholder="Enter the title of your article."/>
							</FormControl>
							<FormMessage/>
						</FormItem>
					)}/>
				<FormField control={form.control} name={"heading_picture"} render={({field}) => (
					<FormItem>
						<FormLabel>Heading Picture</FormLabel>
						<FormControl>
							<Input accept="image/*" type={"file"}/>
						</FormControl>
						<FormMessage/>
					</FormItem>
				)}/>
				<FormField
					control={form.control}
					name={"content"}
					render={({field}) => (
						<FormItem>
							<FormLabel>Content</FormLabel>
							<FormControl>
								<RichTextArea defaultValue={props.defaultValues.content} {...field} id="content"
											  className={"min-h-[500px]" +
												  " h-fit" +
												  " max-h-[1000px]"}
											  placeholder={`# My Article \n Hello there...`}/>
							</FormControl>
							<FormDescription>
								Use markdown & LaTeX to format your article. Need help? Check out this <a
								className={"underline inline-flex items-center gap-1"}
								href={"https://ashki23.github.io/markdown-latex.html"}>markdown guide <ExternalLink
								className={"w-3 h-3"}/></a>.
							</FormDescription>
							<FormMessage/>
						</FormItem>
					)}/>
				<div className={"inline-flex gap-4"}>
					{
						!props.draftID && (
							<Button type={"submit"} variant={"outline"} value={"draft"}>Save as draft</Button>
						)
					}
					<Button type={"submit"} value={"publish"}>Publish</Button>
				</div>
			</form>
		</Form>
	)
}