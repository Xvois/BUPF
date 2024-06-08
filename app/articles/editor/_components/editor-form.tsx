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
import {handleSave} from "@/app/articles/editor/_actions/handleSave";
import {handlePublish} from "@/app/articles/editor/_actions/handlePublish";
import {useEffect, useRef, useState} from "react";
import {ServerError} from "@/components/ServerError";
import {useSearchParams} from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import resizeImage from "@/utils/resize";
import {createClient} from "@/utils/supabase/client";
import Image from "next/image";
import {AspectRatio} from "@/components/ui/aspect-ratio";

export default function EditorForm(props: {
	defaultValues: z.infer<typeof formSchema>,
	imagePath?: string,
	draftID?: number
}) {
	const searchParams = useSearchParams();
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [imagePreview, setImagePreview] = useState<string | null>(null);

	const form = useForm<z.infer<typeof formSchema>>({
		defaultValues: props.defaultValues,
		resolver: zodResolver(formSchema)
	});

	// Grab an image preview if an image path is given
	useEffect(() => {
		if (props.imagePath) {
			const client = createClient();
			client.storage.from("article_images_drafts").download(props.imagePath).then(res => {
				if (res.error) {
					console.error(res.error);
					return;
				}
				const url = URL.createObjectURL(res.data);
				setImagePreview(url);
			});
		} else {
			setImagePreview(null);
		}
	}, [props.imagePath]);

	// Set up the form state for our default values
	useEffect(() => {
		for (const key in props.defaultValues) {
			// This is safe because the keys of the default values are the same as the keys of the form schema
			const formKey = key as keyof z.infer<typeof formSchema>;
			form.setValue(formKey, props.defaultValues[formKey]);
		}
	}, [form, props.defaultValues]);


	// Auto save the form after a 2s debounce time
	// given that the form is valid and a draftID is present
	let timeoutId = useRef<NodeJS.Timeout | null>(null);
	useEffect(() => {
		const handleSaveDebounced = (...args: Parameters<typeof handleSave>) => {
			if (timeoutId.current) {
				clearTimeout(timeoutId.current);
			}
			setIsSaving(true);
			timeoutId.current = setTimeout(() => {
				handleSave(...args).then(() => setIsSaving(false));
			}, 2000); // 2s debounce time
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

	const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const options = {
				quality: 0.5,
				maxWidth: 1000,
				maxHeight: 400,
			}
			resizeImage(file).then(resizedFile => form.setValue("header_picture", resizedFile))
		}
	}

	const onSubmit = form.handleSubmit(async (data, e) => {
		const nativeEvent = e?.nativeEvent as { submitter: HTMLButtonElement } | undefined;
		const type = nativeEvent?.submitter?.value;
		switch (type) {
			case "draft":
				setIsSaving(true);
				await handleSave(data, props.draftID);
				setIsSaving(false);
				break;
			case "publish":
				await handlePublish(data, props.draftID);
				break;
		}
	})

	return (
		<Form {...form}>
			<form onSubmit={onSubmit} className={"space-y-8"}>
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
				<FormField control={form.control} name={"header_picture"} render={({field}) => (
					<FormItem>
						<FormLabel>Heading Picture</FormLabel>
						<FormControl>
							<Input onChange={handlePictureChange}
								   className={"text-foreground"} accept="image/*" type={"file"}/>
						</FormControl>
						<FormMessage/>
					</FormItem>
				)}/>
				{
					imagePreview && (
						<FormItem>
							<FormLabel>Current Picture</FormLabel>
							<FormControl>
								<AspectRatio ratio={10 / 4}>
									<Image src={imagePreview} alt={"Current header picture"}
										   width={1000} height={400} className={"h-full w-full object-cover"}/>
								</AspectRatio>
							</FormControl>
						</FormItem>
					)
				}
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
				<div className={"flex w-fit ml-auto gap-4 items-center"}>
					{
						!props.draftID && (
							<Button type={"submit"} variant={"outline"} value={"draft"}>Save as draft</Button>
						)
					}
					{
						isSaving && (
							<LoadingSpinner style={{
								fill: "hsl(var(--foreground))"
							}}/>
						)
					}

					<Button type={"submit"} value={"publish"}>Publish</Button>
				</div>
				<ServerError>
					{searchParams.get("error")}
				</ServerError>
			</form>
		</Form>
	)
}