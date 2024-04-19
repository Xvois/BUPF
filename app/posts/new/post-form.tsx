'use client'


import {useForm} from "react-hook-form";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {formSchema} from "@/app/posts/new/formSchema";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form} from "@/components/ui/form";
import React from "react";
import {ServerError} from "@/components/ServerError";
import dynamic from "next/dynamic";
import SkeletonForm from "@/app/posts/new/components/skeleton-form";

const LazyQuestion = dynamic(() => import("@/app/posts/new/components/question-form"), {ssr: false});
const LazyDiscussion = dynamic(() => import("@/app/posts/new/components/discussion-form"), {ssr: false});
const LazyArticle = dynamic(() => import("@/app/posts/new/components/article-form"), {ssr: false});

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

    // Reset form values when tab changes
    function onTabChange() {
        console.log("Resetting");
        form.setValue("target", "");
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={""}>
                <Tabs onValueChange={onTabChange} defaultValue={form.formState.defaultValues?.type}>
                    <TabsList className="flex flex-row w-full flex-wrap-reverse justify-around h-fit">
                        <TabsTrigger className={"flex-grow min-w-32"} value="question">Question</TabsTrigger>
                        <TabsTrigger className={"flex-grow min-w-32"} value="discussion">Discussion</TabsTrigger>
                        <TabsTrigger className={"flex-grow min-w-32"} value="article">Article</TabsTrigger>
                    </TabsList>
                    <TabsContent value="question">
                        <LazyQuestion defaultStates={{
                            target: props.defaultParams?.target
                        }}/>
                    </TabsContent>
                    <TabsContent value={"discussion"}>
                        <LazyDiscussion defaultStates={{
                            target: props.defaultParams?.target
                        }}/>
                    </TabsContent>
                    <TabsContent value={"article"}>
                        <LazyArticle/>
                    </TabsContent>
                </Tabs>
            </form>
            <SkeletonForm/>
            {postError &&
                <ServerError className={"w-full mt-2 shadow"}>
                    <p>{postError}</p>
                </ServerError>
            }
        </Form>
    )
}



