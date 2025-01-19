"use client"

import {useFormContext} from "react-hook-form";
import {useEffect, useState} from "react";
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import RichTextArea from "@/components/RichTextArea";
import Link from "next/link";
import {ExternalLink} from "lucide-react";
import {Button} from "@/components/ui/button";
import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group";
import AnonymousButton from "@/components/AnonymousButton";


export default function Question({module_id, tags}: { module_id: string, tags: string[] }) {

    const form = useFormContext();

    const {isSubmitting} = form.formState;

    const [isAnonymous, setIsAnonymous] = useState(false);

    useEffect(() => {
        form.setValue("anonymous", isAnonymous);
    }, [isAnonymous]);

    useEffect(() => {
        form.setValue("target", module_id);
        form.setValue("type", "question");
    }, []);


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
            <FormField control={form.control} name={"tags"} render={({field}) => (
                <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                        <ToggleGroup type="multiple" className={"group w-full flex flex-row flex-wrap justify-evenly"}>
                            {
                                tags.map((tag) => (
                                    <ToggleGroupItem
                                        {...field}
                                        size={"sm"}
                                        className={`capitalize flex-grow border border-border rounded-md transition-all px-2 py-1`}
                                        type={"button"}
                                        key={tag}
                                        value={tag}
                                    >
                                        {tag}
                                    </ToggleGroupItem>
                                ))
                            }
                        </ToggleGroup>
                    </FormControl>
                    <FormDescription>
                        Select tags that best describe your question.
                    </FormDescription>
                    <FormMessage/>
                </FormItem>
            )}/>
            <div className={"inline-flex gap-4 items-center"}>
                <Button size="lg" type={"submit"} isLoading={isSubmitting} variant={"default"} onClick={() => console.log(form.getValues())}>Submit</Button>
                 <AnonymousButton state={isAnonymous} dispatch={setIsAnonymous} />
            </div>
        </div>
    )
}