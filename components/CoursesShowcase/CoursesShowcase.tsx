"use client"

import {Tables} from "@/types/supabase";
import {useForm} from "react-hook-form";
import {Form} from "@/components/ui/form";
import CourseDetails from "@/components/form-components/course-details";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import axios from "axios";
import {PostgrestSingleResponse} from "@supabase/supabase-js";

type LooseObject = {
    [key: string]: any
};

export default function CoursesShowcase() {
    const form = useForm();
    const [modules, setModules] = useState<Tables<"course_modules"> | null>(null);
    const [targetYear, setTargetYear] = useState<number>(1);

    const onSubmit = async (fd: any) => {
        const {data} = await axios.get<PostgrestSingleResponse<Tables<"course_modules">>>(`/api/courses/${fd.course}/modules`).then(res => res.data);
        if (data) {
            setModules(data);
        }
    }

    // Use a type assertion to tell TypeScript that `modules` can be indexed with a string
    let yearData = modules && (modules as LooseObject)[`year_${targetYear}`];


    return (
        <div className={"flex flex-col w-full lg:flex-row lg:justify-between gap-4"}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-4 lg:w-96"}>
                    <CourseDetails/>
                    <Button type={"submit"}>Try it out</Button>
                </form>
            </Form>
            <div className={"flex flex-row"}>
                <div>
                    <ul>
                        {
                            modules && yearData.required.map((m: Tables<"modules">) => (
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
                <div>
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
        </div>
    )

}