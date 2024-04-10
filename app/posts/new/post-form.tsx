'use client'


import {useForm, useFormContext} from "react-hook-form";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import useSWR from "swr";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {formSchema} from "@/app/posts/new/formSchema";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import React, {useEffect} from "react";
import {Checkbox} from "@/components/ui/checkbox";
import RichTextArea from "@/components/RichTextArea";
import Link from "next/link";
import {ServerError} from "@/components/ServerError";
import {sbFetcher} from "@/utils/fetcher";
import {Tables} from "@/types/supabase";
import {ExternalLink} from "lucide-react";


export default function PostForm(
    props:
        {
            post: (values: z.infer<typeof formSchema>) => Promise<string | null>,
            defaultParams?: {
                type?: string,
                target?: string,
            }
        }
) {

    const [postError, setPostError] = React.useState<string | null>(null);

    function isPostType(type: string | undefined): type is "question" | "discussion" | "article" {
        return type === "question" || type === "discussion" || type === "article";
    }

    const form = useForm<z.infer<typeof formSchema>>({
        mode: "onSubmit",
        resolver: zodResolver(formSchema),
        defaultValues: {
            heading: "",
            content: "",
            type: isPostType(props.defaultParams?.type) ? props.defaultParams.type : "question",
            anonymous: false,
        }
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        /*
        This pattern is so stupid: react-hook-form wants to invoke
        a client function and onSubmit must be used for validation.
        This leads to this mess where a server action is invoked
        through this function.
         */
        try {
            await props.post(values);
        } catch (e) {
            const error = e as unknown as Error;
            setPostError(error.message);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={""}>
                <Tabs defaultValue={form.formState.defaultValues?.type}>
                    <TabsList className="flex flex-row w-full flex-wrap-reverse justify-around h-fit">
                        <TabsTrigger className={"flex-grow min-w-32"} value="question">Question</TabsTrigger>
                        <TabsTrigger className={"flex-grow min-w-32"} value="discussion">Discussion</TabsTrigger>
                        <TabsTrigger className={"flex-grow min-w-32"} value="article">Article</TabsTrigger>
                    </TabsList>
                    <TabsContent value="question">
                        <Question defaultStates={{
                            target: props.defaultParams?.target
                        }}/>
                    </TabsContent>
                    <TabsContent value={"discussion"}>
                        <Discussion/>
                    </TabsContent>
                    <TabsContent value={"article"}>
                        <Article/>
                    </TabsContent>
                </Tabs>
            </form>
            {postError &&
                <ServerError className={"w-full mt-2 shadow"}>
                    <p>{postError}</p>
                </ServerError>
            }
        </Form>
    )
}

function Discussion() {

    const form = useFormContext();

    useEffect(() => {
        form.setValue("type", "discussion");
        form.setValue("targetType", "topic");
    }, [])

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Start a discussion</CardTitle>
                <CardDescription>Start a discussion with your peers and lecturers.</CardDescription>
            </CardHeader>
            <CardContent>
                <FormField
                    control={form.control}
                    name={"heading"}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Heading</FormLabel>
                            <FormControl>
                                <Input {...field} id="heading" placeholder="Enter the title of your discussion."/>
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
                                              placeholder={"# My discussion \n Hello there..."}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
            </CardContent>
            <CardFooter>
                <Button size="lg" type={"submit"}>Submit</Button>
            </CardFooter>
        </Card>
    )

}

function Question(props: { defaultStates: { target: string | undefined } }) {

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
                                className={"underline inline-flex items-center gap-1"} href={"https://ashki23.github.io/markdown-latex.html"}>markdown guide <ExternalLink className={"w-3 h-3"} /></Link>.
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
                                <Select disabled {...field} onValueChange={(target) => form.setValue("target", target)}>
                                    <SelectTrigger>
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

function Article() {
    const form = useFormContext();

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Write an article</CardTitle>
                <CardDescription>Write an article to share with your peers and lecturers.</CardDescription>
            </CardHeader>
            <CardContent>
                <FormField
                    control={form.control}
                    name={"heading"}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Heading</FormLabel>
                            <FormControl>
                                <Input {...field} id="heading" placeholder="Enter the title of your article."/>
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
                                <RichTextArea {...field} id="content" placeholder="Enter the content of your article."/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
            </CardContent>
            <CardFooter>
                <Button size="lg" type={"submit"}>Submit</Button>
            </CardFooter>
        </Card>
    )
}