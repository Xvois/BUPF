'use client'

import {h1, subtle_p} from "@/styles/text";
import React from "react";

export default function WelcomeSection({isActive}: { isActive?: boolean }) {
    return (
        <section className={"flex flex-col text-center w-full h-screen p-6 items-center" +
            " align-middle" +
            " justify-center"}>
            <h1 className={h1}>
                The Home for Bath Physicists
            </h1>
            <p className={subtle_p}>
                Welcome to the Bath University Physics Forum, a place for students and academics to discuss physics.
            </p>
        </section>
    )

}

