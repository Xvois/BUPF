'use client'

import {h1, h2, subtle_p} from "@/styles/text";
import {cn} from "@/utils/cn";
import EmSubtle from "@/components/EmSubtle";
import React, {useEffect, useRef} from "react";
import {useActiveSection} from "@/components/DynamicSections";

const offsets = [
    "bottom-[25%] right-[38%] rotate-45",
    "bottom-[65%] right-[40%] rotate-[10]",
]

export default function DiscussionSection() {

    const {activeSection, registerSection, getSectionIndex} = useActiveSection();
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current) {
            registerSection(ref.current);
        }
    }, [registerSection]);

    const isActive = activeSection === getSectionIndex(ref.current);

    return (
        <section className={"relative flex flex-col text-center w-full h-screen" +
            " p-6 items-center" +
            " align-middle" +
            " justify-center"} ref={ref}>
            <h2 className={cn(h2, "z-10")}>
                For anything you want to discuss
            </h2>
            <p className={subtle_p}>
                Discuss anything you want with other students. Share your thoughts in <EmSubtle>articles</EmSubtle>,
                ask <EmSubtle>questions</EmSubtle>, or just chat in <EmSubtle>discussion</EmSubtle> posts.
            </p>
            <div>
                <p className={cn(h1, "absolute animate-elastic-in", offsets[0])}>
                    !
                </p>
                <p className={cn(h1, "absolute animate-elastic-in", offsets[1])}>
                    ?
                </p>
            </div>
        </section>
    )
}