'use client'

import {h1, subtle_p} from "@/styles/text";
import React, {useEffect, useRef} from "react";
import {useActiveSection} from "@/components/DynamicSections";
import {ArrowBigDownDash} from "lucide-react";
import {createClient} from "@/utils/supabase/client";
import {Button} from "@/components/ui/button";
import {CTAButton} from "@/app/_landing/_components/CTAButton";

export default function WelcomeSection() {

    const {registerSection} = useActiveSection();
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current) {
            registerSection(ref.current);
        }
    }, [registerSection]);

    return (
        <section className={"flex flex-col text-center w-full h-screen p-6 -mt-20 items-center" +
            " align-middle" +
            " justify-center"} ref={ref}>
            <h1 className={h1}>
                The Home for Bath Physicists
            </h1>
            <p className={subtle_p}>
                Welcome to the Bath University Physics Forum, a place for students and academics to discuss physics.
            </p>
            <CTAButton />
        </section>
    )

}

