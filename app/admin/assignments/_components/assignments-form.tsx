"use client"

import {useForm, useFormContext} from "react-hook-form";
import {Tables} from "@/types/supabase";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Checkbox} from "@/components/ui/checkbox";
import {formSchema} from "@/app/admin/assignments/_schema/formSchema";
import {z} from "zod";
import CourseDetails from "@/components/form-components/course-details";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import React, {useEffect, useState} from "react";
import Fuse from "fuse.js";
import EmSubtle from "@/components/EmSubtle";
import {updateAssignments} from "@/app/admin/assignments/_actions/handleSubmit";
import {ServerError} from "@/components/ServerError";
import {useSearchParams} from "next/navigation";
import useSWR from "swr";
import {fetcher} from "@/utils/fetcher";
import {Label} from "@/components/ui/label";
import {X} from "lucide-react";
import {Separator} from "@/components/ui/separator";


export default function AssignmentsForm({modules}: {
    modules: Tables<"modules">[],
}) {

    const urlSearchParams = useSearchParams();

    const form = useForm({
        defaultValues: {
            modules: [] as z.infer<typeof formSchema>["modules"],
            // Physics B.Sc.
            course: 33,
            year: 1
        },
        reValidateMode: "onChange"
    })

    // Watch the form for changes,
    // will automatically invalidate courseModulesResponse
    const formCourse = form.watch("course");
    const formYear = form.watch("year");

    const {
        data: courseModulesResponse,
    } = useSWR(['/api/courses/[id]/[year]/modules' as const, {
        id: formCourse.toString(),
        year: formYear.toString()
    }], ([url, params]) => fetcher(url, params));

    const defaultModules = courseModulesResponse?.data?.map((m) => ({id: m.module_id, is_required: m.is_required}));

    useEffect(() => {
        if (defaultModules) {
            form.setValue("modules", defaultModules);
        }
    }, [defaultModules]);

    const {isSubmitting} = form.formState;

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        await updateAssignments(data);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CourseDetails/>
                <FormField
                    control={form.control}
                    name="modules"
                    render={() => (
                        <FormItem>
                            <div className="mb-4">
                                <FormLabel className="text-base">Modules</FormLabel>
                                <FormDescription>
                                    Select the items you want to display in the sidebar.
                                </FormDescription>
                            </div>
                            <ModulesCommand modules={modules}/>
                            <div className={"flex flex-col gap-2"}>
                                {form.getValues("modules").map((module) => (
                                    <div
                                        className={"flex flex-row px-4 py-2 rounded-md border w-full items-center justify-between"}
                                        key={module.id}>
                                        <p>{module.id}</p>
                                        <div className={"inline-flex items-center gap-4"}>
                                            <div className={"inline-flex items-center gap-1"}>
                                                <Label>Required</Label>
                                                <Checkbox
                                                    onClick={() => {
                                                        module.is_required = !module.is_required;
                                                        form.setValue("modules", form.getValues("modules").map((m) => m.id === module.id ? module : m))
                                                    }}
                                                    checked={module.is_required}/>
                                            </div>
                                            <button
                                                type={"button"}
                                                onClick={() => {
                                                    form.setValue("modules", form.getValues("modules").filter((m) => m.id !== module.id))
                                                }}>
                                                <X className={"h-4 w-4"}/>
                                            </button>
                                        </div>
                                    </div>
                                ))
                                }
                            </div>
                            <FormMessage/>
                        </FormItem>
                    )
                    }/>
                <Button className={"mt-2"} isLoading={isSubmitting} type={"submit"}>Save</Button>
            </form>
            <ServerError>
                {urlSearchParams.get("error")}
            </ServerError>
        </Form>
    )
}


function ModulesCommand({modules}: { modules: Tables<"modules">[] }) {

    const parentForm = useFormContext();

    const fuse = new Fuse(modules, {
        keys: ["id", "title"]
    })

    const [search, setSearch] = useState("");
    const results = fuse.search(search);

    const handleSubmit = (value: string) => {
        const containsModule = parentForm.getValues("modules").find((m: z.infer<typeof formSchema>["modules"][number]) => m.id === value);
        if (containsModule) return;
        parentForm.setValue("modules", [...parentForm.getValues("modules"), {id: value, is_required: false}]);
        setSearch("");
    }

    return (
        <div className={"relative flex flex-row gap-4"}>
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={"Search for a module"}/>
                {
                    search.length > 0 && <div
                        className={"absolute flex flex-col items-start gap-2 bg-background border-l border-r border-b rounded-b-md w-full top-[40px] p-4 left-0"}>
                        {
                            results.map((r) => (
                                <button
                                    className={"text-sm text-muted-foreground"}
                                    type={"button"} onClick={() => {
                                    handleSubmit(r.item.id);
                                }}
                                    key={r.item.id}><EmSubtle className={"uppercase"}>{r.item.id}</EmSubtle> {r.item.title}
                                </button>
                            ))
                        }
                    </div>
                }
            </div>
    )
}
