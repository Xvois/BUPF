"use client"

import {Tables} from "@/types/supabase";
import {useForm} from "react-hook-form";
import {Form} from "@/components/ui/form";
import CourseDetails from "@/components/form-components/course-details";
import {Button} from "@/components/ui/button";
import {useEffect, useState} from "react";
import axios from "axios";
import {PostgrestSingleResponse} from "@supabase/supabase-js";
import useSWR from "swr";
import {fetcher} from "@/utils/fetcher";
import LinkBox from "@/components/LinkBox";

type LooseObject = {
    [key: string]: any
};

export default function CoursesShowcase() {
    const form = useForm({
        defaultValues: {
            course: "33",
            yearOfStudy: 2023
        }
    });
    const [modules, setModules] = useState<Tables<"course_modules"> | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [targetYear, setTargetYear] = useState<number>(1);

    const onSubmit = async (fd: any) => {
        setIsLoading(true);
        const {data} = await axios.get<PostgrestSingleResponse<Tables<"course_modules">>>(`/api/courses/${fd.course}/modules`).then(res => res.data);
        setIsLoading(false);
        if (data) {
            setModules(data);
        }
    }

    // Prefetch the modules for the default course
    const {
        data: initData,
        isLoading: swrLoading
    } = useSWR<PostgrestSingleResponse<Tables<"course_modules">>>(`/api/courses/${form.formState.defaultValues?.course}/modules`, fetcher);
    useEffect(() => {
        if (!initData) return;
        setModules(initData.data);
    }, [initData]);
    useEffect(() => {
        setIsLoading(swrLoading);
    }, [swrLoading]);

    // Use a type assertion to tell TypeScript that `modules` can be indexed with a string
    let yearData = modules && (modules as LooseObject)[`year_${targetYear}`];


    return (
        <div className={"flex flex-col w-full lg:flex-row gap-4"}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-4 lg:w-96"}>
                    <CourseDetails/>
                    <Button type={"submit"} className={"w-full"}>Try it out</Button>
                </form>
            </Form>
            <div className={"flex flex-col"}>
                <ul className={"grid grid-cols-2 grid-rows-2 gap-4"}>
                    {
                        modules && yearData.required.map((module: Tables<"modules">) => (
                            <LinkBox
                                key={module.id}
                                title={`${module.title} / ${module.id.toUpperCase()}`}
                                href={`/modules/${module.id}`}
                                className={"max-w-screen-sm flex-grow h-fit"}
                                description={module.description || undefined}
                            >
                            </LinkBox>

                        ))
                    }
                </ul>
                <ul>
                    {
                        modules && yearData.optional.map((m: Tables<"modules">) => (
                            <li key={m.id}>
                                <p>
                                    {m.title} <span
                                    className={"text-xs text-muted-foreground uppercase"}>({m.id})</span>
                                </p>
                                <p className={"text-sm text-muted-foreground"}>
                                    {m.description}
                                </p>
                            </li>

                        ))
                    }
                </ul>
            </div>
        </div>
    )

}