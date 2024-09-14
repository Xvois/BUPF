'use client'

import React, {HTMLProps, useEffect, useRef, useState} from "react";
import useSWR from "swr";
import {fetcher} from "@/utils/fetcher";
import {cn} from "@/utils/cn";
import {h2, subtle_p} from "@/styles/text";
import EmSubtle from "@/components/EmSubtle";
import ElementGraph from "@/components/ElementGraph";
import {useActiveSection} from "@/components/DynamicSections";
import {createClient} from "@/utils/supabase/client";
import {Tables} from "@/types/supabase";

export default function CourseSection() {

    const {activeSection, registerSection, getSectionIndex} = useActiveSection();
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current) {
            registerSection(ref.current);
        }
    }, [registerSection]);

    const [activeYear, setActiveYear] = useState(1);
    const [allActiveModules, setAllActiveModules] = useState<Tables<"modules">[] | null>(null);
    const courseLength = 4;

    // ID for MSci Physics
    const id = 36;
    const {data: courseModulesResponse} = useSWR(["/api/courses/[id]/[year]/modules" as const, {
        id: id.toString(),
        year: activeYear.toString()
    }], ([url, params]) => fetcher(url, params));
    const courseModules = courseModulesResponse?.data;

    const YearsDisplay = () => {
        return (
            <div className={"absolute left-0 bottom-8 w-full z-10"}>
                <div
                    className={"flex flex-col w-fit mx-auto gap-2 "}>
                    <div className={"inline-flex gap-4 py-2 px-4 backdrop-blur rounded-md border items-center"}>
                        <p className={"font-semibold"}>Year</p>
                        <div className={"flex gap-4"}>
                            {
                                [...Array(courseLength).keys()].map((i) => (
                                    <button key={i} onClick={() => setActiveYear(i + 1)}
                                            className={cn("rounded-full h-fit font-semibold text-muted-foreground", activeYear === i + 1 && "text-foreground")}>
                                        {i + 1}
                                    </button>
                                ))
                            }
                        </div>
                    </div>
                    <p className={cn(subtle_p, "text-xs")}>of <EmSubtle>MSci Physics</EmSubtle></p>
                </div>
            </div>
        )
    }


    const ModulesDisplay = () => {

        if (!allActiveModules) return (
            <div className={"absolute top-0 left-0 w-full h-full flex flex-col justify-center"}>
                <p>Loading...</p>
            </div>
        )

        const allTags = [...new Set(allActiveModules.flatMap(module => module.tags))];

        // Create a link between a tag and any modules that contain it
        const tagLinks = allTags.flatMap(tag => {
            return allActiveModules.filter(module => module.tags.includes(tag)).map(module => {
                return {
                    source: tag,
                    target: module.id,
                }
            });
        });


        const Module = React.forwardRef<HTMLDivElement, { module: any } & HTMLProps<HTMLDivElement>>(({
                                                                                                          module,
                                                                                                          ...props
                                                                                                      }, ref) => {
            return (
                <div {...props} ref={ref} className={cn("", props.className)}>
                    <p className={"uppercase font-semibold"}>{module.id}</p>
                </div>
            );
        });

        const Tag = React.forwardRef<HTMLDivElement, { tag: string } & HTMLProps<HTMLDivElement>>(({
                                                                                                       tag,
                                                                                                       ...props
                                                                                                   }, ref) => {
            return (
                <div {...props} ref={ref} className={cn("text-muted-foreground", props.className)}>
                    <p className={"text-xs"}>#{tag}</p>
                </div>
            );
        });

        const moduleNodes = allActiveModules.map((module) => ({
            id: module.id,
            element: <Module module={module}/>,
        }));

        const tagNodes = allTags.map((tag) => ({
            id: tag,
            element: <Tag tag={tag}/>,
        }));

        const nodes = moduleNodes.concat(tagNodes);

        return (
            <ElementGraph
                nodes={nodes}
                links={tagLinks}/>
        )
    }

    return (
        <section
            className={"relative flex flex-col text-center w-full h-screen p-6 items-center align-middle justify-center"}
            ref={ref}>
            <h2 className={h2}>
                A course that <span className={"bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400" +
                " inline-block text-transparent bg-clip-text"}>stays with you</span>
            </h2>
            <p className={subtle_p}>
                Choose your course, and <EmSubtle>never</EmSubtle> lose track of your progress.
            </p>
            <div className={"absolute top-0 left-0 w-full h-full flex flex-col justify-center"}>
                <YearsDisplay/>
                <ModulesDisplay/>
            </div>
        </section>
    )

}
