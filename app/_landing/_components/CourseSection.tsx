'use client'

import React, {HTMLProps, useState} from "react";
import useSWR from "swr";
import {fetcher} from "@/utils/fetcher";
import {cn} from "@/utils/cn";
import {h2, subtle_p} from "@/styles/text";
import EmSubtle from "@/components/EmSubtle";
import ElementGraph from "@/components/ElementGraph";

export default function CourseSection({isActive}: { isActive?: boolean }) {
    const [activeYear, setActiveYear] = useState(1);
    const courseLength = 4;

    // ID for MSci Physics
    const id = 36;
    const {data: courseModulesResponse} = useSWR(`/api/courses/[id]/modules`, (url) => fetcher(url, {id: id.toString()}));
    const courseModules = courseModulesResponse?.data;

    const getActiveModules = () => {
        switch (activeYear) {
            case 1:
                return courseModules?.year_1;
            case 2:
                return courseModules?.year_2;
            case 3:
                return courseModules?.year_3;
            case 4:
                return courseModules?.year_4;
            case 5:
                return courseModules?.year_5;
            default:
                return {required: [], optional: []};
        }
    }
    const activeModules = getActiveModules();

    const allActiveModules = activeModules?.required.concat(activeModules.optional);

    const YearsDisplay = () => {
        return (
            <div className={"absolute left-0 bottom-8 w-full z-10"}>
                <div
                    className={"flex flex-col w-fit mx-auto gap-2 "}>
                    <div className={"inline-flex gap-4 py-2 px-4 backdrop-blur rounded-full border items-center"}>
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


        const Module = ({module, ...buttonProps}: { module: any } & HTMLProps<HTMLButtonElement>) => {
            return (
                <button {...buttonProps}
                        type={"button"}
                        className={cn("border px-4 py-2 bg-gradient-to-br from-muted/0 to-muted/75 backdrop-blur shrink-0 h-fit w-fit rounded-full shadow", buttonProps.className)}>
                    <p className={"uppercase font-semibold"}>{module.id}</p>
                </button>
            )
        }

        const Tag = ({tag, ...buttonProps}: { tag: string } & HTMLProps<HTMLButtonElement>) => {
            return (
                <button {...buttonProps}
                        type={"button"}
                        className={cn("border px-4 py-2 backdrop-blur shrink-0 h-fit w-fit rounded-full", buttonProps.className)}>
                    <p className={"text-xs"}>#{tag}</p>
                </button>
            )
        }

        const moduleNodes = allActiveModules.map((module, index) => ({
            id: module.id,
            element: <Module module={module}/>,
        }));

        const tagNodes = allTags.map((tag, index) => ({
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
        <section className={"relative flex flex-col text-center w-full h-screen p-6 items-center" +
            " align-middle" +
            " justify-center"}>
            <h2 className={h2}>
                A course that stays with you
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
