"use client"

import {useFormContext} from "react-hook-form";
import useSWR from "swr";
import {fetcher} from "@/utils/fetcher";
import {useEffect} from "react";
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import RichTextArea from "@/components/RichTextArea";
import Link from "next/link";
import {ExternalLink} from "lucide-react";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import {Checkbox} from "@/components/ui/checkbox";
import {Button} from "@/components/ui/button";


export default function Question() {

	const form = useFormContext();

	const {data: response, error} = useSWR('/api/modules', (url) => fetcher(url));
	const modules = response?.data;
	const {isSubmitting, defaultValues} = form.formState;

	useEffect(() => {
		form.setValue("type", "question");
		form.setValue("targetType", "module");
	}, []);

	useEffect(() => {
		if (modules && defaultValues && modules.some(m => m.id === defaultValues.target)) {
			form.setValue("target", defaultValues.target);
		}
	}, [modules]);


	return (
		<div className="space-y-4">
			<FormField
				control={form.control}
				name={"heading"}
				render={({field}) => (
					<FormItem>
						<FormLabel>Heading</FormLabel>
						<FormControl>
							<Input {...field} id="heading" placeholder="Enter the title of your question."/>
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
							<RichTextArea {...field} id="content" className={"max-h-96 overflow-y-scroll"}
										  placeholder="Enter the content of your question."/>
						</FormControl>
						<FormDescription>
							Use markdown & LaTeX to format your question. Need help? Check out this <Link
							className={"underline inline-flex items-center gap-1"}
							href={"https://ashki23.github.io/markdown-latex.html"}>markdown guide <ExternalLink
							className={"w-3 h-3"}/></Link>.
						</FormDescription>
						<FormMessage/>
					</FormItem>
				)}/>
			<FormField
				control={form.control}
				name={"target"}
				render={({field}) => (
					<FormItem>
						<FormLabel>Module</FormLabel>
						<FormControl>
							<Select {...field} onValueChange={(target) => form.setValue("target", target)}>
								<SelectTrigger className={"w-64"}>
									<SelectValue className={"uppercase"} placeholder="Select a module"/>
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectLabel>Modules</SelectLabel>
										{modules ?
											modules.map((module) => (
												<SelectItem className={"uppercase"} key={module.id}
															value={module.id}>
													{module.id}
												</SelectItem>
											))
											:
											error ?
												(
													<p>Error fetching modules: {error.message}</p>
												)
												:
												(
													<p>Loading modules...</p>
												)
										}
									</SelectGroup>
								</SelectContent>
							</Select>
						</FormControl>
						<FormMessage/>
					</FormItem>
				)}/>
			<FormField
				control={form.control}
				name={"anonymous"}
				render={({field}) => (
					<FormItem>
						<FormControl>
							<div className="items-top flex space-x-2">
								<Checkbox
									checked={field.value}
									onCheckedChange={(checked: boolean) => form.setValue("anonymous", checked)}
								/>
								<div className="grid gap-1.5 leading-none">
									<label
										htmlFor="terms1"
										className="text-sm font-medium leading-none"
									>
										Anonymous
									</label>
									<p className="text-sm text-muted-foreground">
										Your question will be posted anonymously.
									</p>
								</div>
							</div>
						</FormControl>
						<FormMessage/>
					</FormItem>
				)}/>
			<Button size="lg" type={"submit"} isLoading={isSubmitting} variant={"default"}>Submit</Button>
		</div>
	)
}