import {useFormContext} from "react-hook-form";
import useSWR from "swr";
import {sbFetcher} from "@/utils/fetcher";
import {Tables} from "@/types/supabase";
import React, {useEffect} from "react";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
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


export default function Question(props: { defaultStates: { target: string | undefined } }) {

    const {defaultStates} = props;

    const form = useFormContext();

    const {data: modules, error} = useSWR('modules', sbFetcher<Tables<"modules">>);
    const {isSubmitting} = form.formState;

    useEffect(() => {
        form.setValue("type", "question");
        form.setValue("targetType", "module");
    }, []);

    useEffect(() => {
        if (modules && defaultStates.target && modules.some(m => m.id === defaultStates.target)) {
            form.setValue("target", defaultStates.target);
        }
    }, [modules]);


    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Ask a question</CardTitle>
                <CardDescription>Ask a question to a module and get students and lecturers help.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
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
                                <RichTextArea {...field} id="content"
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

            </CardContent>
            <CardFooter>
                <Button size="lg" type={"submit"} isLoading={isSubmitting} variant={"default"}>Submit</Button>
            </CardFooter>
        </Card>
    )
}
