'use client'

import React, {HTMLProps, useEffect, useRef, useState} from "react";
import {cn} from "@/utils/cn";
import {h2, subtle_p} from "@/styles/text";
import EmSubtle from "@/components/EmSubtle";
import ElementGraph from "@/components/ElementGraph";
import {useActiveSection} from "@/components/DynamicSections";
import {Tables} from "@/types/supabase";
import apiAxios from "@/utils/axios/apiAxios";

export default function CourseSection() {

    const {registerSection} = useActiveSection();
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current) {
            registerSection(ref.current);
        }
    }, [registerSection]);

    const [activeYear, setActiveYear] = useState(1);
    const [allActiveModules, setAllActiveModules] = useState<Tables<"modules">[] | null>(null);
    // TODO: UP AS COURSE LENGTH INCREASES
    const courseLength = 2;

    /*
    This is horrible, please someone for the love of god refactor this. I'm so sorry.
     */
    useEffect(() => {
        // ID for MSci Physics
        const id = 36;
        apiAxios.get("/api/courses/[id]/[year]/modules", {id: id.toString(), year: activeYear.toString()}).then((courseModulesResponse) => {
            const courseModules = courseModulesResponse?.data.data;

            const allModulesRequest = courseModules?.map(m =>
                apiAxios.get("/api/modules/[id]", {id: m.module_id}));

            if (allModulesRequest) {
                Promise.all(allModulesRequest).then((responses) => {
                    const valid = responses.map(r => r.data.data);
                    setAllActiveModules(valid.filter(m => m !== null));
                })
            }
        });
    }, [activeYear]);


    const YearsDisplay = () => {
        return (
            <div className={"absolute left-0 bottom-8 w-full z-10"}>
                <div
                    className={"flex flex-col w-fit mx-auto gap-2 items-center"}>
                    <div className={"inline-flex w-fit gap-4 py-2 px-4 backdrop-blur rounded-md border items-center"}>
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
                    <p className={cn(subtle_p, "text-xs")}>Note: Years will appear when module selection is finalised.</p>
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
                <div {...props} ref={ref}>
                </div>
            );
        });

        const Tag = React.forwardRef<HTMLDivElement, { tag: string } & HTMLProps<HTMLDivElement>>(({
                                                                                                       tag,
                                                                                                       ...props
                                                                                                   }, ref) => {
            return (
                <div {...props} ref={ref}>
                </div>
            );
        });

        const moduleNodes = allActiveModules.map((module) => ({
            id: module.id,
            element: <Module className={"p-3 rounded-full bg-gradient-to-br from-muted-foreground/75 to-muted-foreground/50 backdrop-blur"} module={module}/>,
        }));

        const tagNodes = allTags.map((tag) => ({
            id: tag,
            element: <Tag className={"p-2 rounded-full bg-gradient-to-br from-muted-foreground/50 to-muted-foreground/50 backdrop-blur"} tag={tag}/>,
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
