'use client'

import {h1, subtle_p} from "@/styles/text";
import React, {useEffect, useRef} from "react";
import {useActiveSection} from "@/components/DynamicSections";

export default function WelcomeSection() {

    const {activeSection, registerSection, getSectionIndex} = useActiveSection();
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current) {
            registerSection(ref.current);
        }
    }, [registerSection]);

    const isActive = activeSection === getSectionIndex(ref.current);

    return (
        <section className={"flex flex-col text-center w-full h-screen p-6 items-center" +
            " align-middle" +
            " justify-center"} ref={ref}>
            <div>
                <h1 className={h1}>
                    The Home for Bath Physicists
                </h1>
                <p className={subtle_p}>
                    Welcome to the Bath University Physics Forum, a place for students and academics to discuss physics.
                </p>
            </div>
        </section>
    )

}

