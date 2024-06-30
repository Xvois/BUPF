'use client'

import {cn} from "@/utils/cn";
import MarkdownRender from "@/components/MarkdownRender/MarkdownRender";
import EmSubtle from "@/components/EmSubtle";
import React from "react";
import {h2, subtle_p} from "@/styles/text";

const markdownComments = [
    "Does anyone known how to find $\\delta t$ for in this domain?",
    "I *think* we can use $\\oint \\vec{E} \\cdot d\\vec{A} = \\frac{Q_{\\text{enc}}}{\\varepsilon_0}$ here?",
    "Hopefully [this](https://www.bupf.co.uk/) helps!",
    "If we assume that $\\vec{E}$ is constant over the surface, so the dot product becomes a scalar product",
    "The product $\\sum \\lambda_{i}$ for $\\underline{\\underline{A}}$ turns out to be $\\text{det}" +
    " \\underline{\\underline{A}}$.",
    "How do I find the particular integral for $\\phi (x) = x \\sin{x}$?",
    "Is there a way to find the general solution to this ODE: $\\frac{d^{2}y}{dx^{2}} + 7\\frac{dy}{dx} + 1 = x$",
    "I think we can use the method of undetermined coefficients here, see [the course text](https://www.bupf.co.uk/).",
    "What relationship does $\\gamma$ have with the number of bound states?",
    "Does anyone know how to find the eigenvalues $\\lambda_{1}, \\lambda_{2}$ of $\\begin{bmatrix} 2 &" +
    " 3 \\\\ 4 & 2 \\end{bmatrix}$? Is it orthogonal?",
    "Can we use the [method of variation of parameters](https://www.bupf.co.uk/) to find the particular integral?",
    "How does Gaussian elimination work on this matrix $\\underline{\\underline{A}}$?",
    "How can I perform Bernoulli's method on this ODE: $\\frac{dy}{dx} - y = y^{2}$?",
    "Can I use the Clausius-Clapeyron equation to find the enthalpy of vaporisation?",
    "How do I transform $\\int xy dxy$ into polar coordinates?",
    "Does anyone know how to find the eigenvalues of $\\underline{\\underline{A}}$?",
    "What actually is enthalpy and how does it relate to the internal energy of a system?",
]

const universalOffsets = [
    "bottom-[25%] right-[38%]",
    "bottom-[65%] right-[40%]",
    "bottom-[68%] right-[10%]",
    "bottom-[0%] right-[30%]",
    "bottom-[33%] right-[25%]",
    "bottom-[65%] right-[14%]",
    "bottom-[80%] right-[10%]",
    "bottom-[0%] right-[65%]",
    "bottom-[70%] right-[70%]",
    "bottom-[23%] left-[5%] ",
    "bottom-[20%] right-[10%] ",
    "bottom-[10%] right-[60%] ",
    "bottom-[60%] right-[70%] ",
    "bottom-[20%] left-[75%] ",
    "bottom-[75%] left-[80%] ",
    "bottom-[90%] left-[10%] ",
    "bottom-[10%] left-[0%] ",
];

const universalScaling = [
    "scale-100 text-foreground/100 z-0",
    "scale-[80%] text-foreground/80 -z-20",
    "scale-100 text-foreground/100 z-0",
    "scale-[60%] text-foreground/60 -z-40",
    "scale-[70%] text-foreground/70 -z-30",
    "scale-[80%] text-foreground/80 -z-[60]",
    "scale-50 text-foreground/50 -z-[50]",
    "scale-[80%] text-foreground/80 -z-20",
    "scale-90 text-foreground/90 -z-10",
    "scale-100 text-foreground/100 z-0",
    "scale-50 text-foreground/50 -z-[50]",
    "scale-50 text-foreground/50 -z-[50]",
    "scale-[60%] text-foreground/60 -z-40",
    "scale-[80%] text-foreground/80 -z-20",
    "scale-[70%] text-foreground/70 -z-30",
    "scale-[60%] text-foreground/60 -z-40",
    "scale-100 text-foreground/100 z-0\""
]

const FloatingComment = (props: { content: string, index: number, className?: string }) => {
    return (
        <div
            style={{
                transition: "opacity 1s",
                transitionDelay: `${props.index / 10}s`,
                transitionTimingFunction: "ease-in-out"
            }}
            className={cn("absolute bg-background border p-4 w-fit min-w-96 shrink-0 h-fit rounded-md shadow", universalOffsets[props.index], universalScaling[props.index], props.className)}>
            <p className={"text-sm text-muted-foreground"}>Anonymous</p>
            <MarkdownRender>
                {props.content}
            </MarkdownRender>
        </div>
    )
}

export default function MarkdownSection({isActive}: { isActive?: boolean }) {
    return (
        <section className={"relative flex flex-col text-center w-full h-screen" +
            " p-6 items-center" +
            " align-middle" +
            " justify-center"}>
            <h2 className={cn(h2, "z-10")}>
                Make meaningful contributions
            </h2>
            <p className={subtle_p}>
                BUPF allows you to write with <EmSubtle>Markdown</EmSubtle> and <EmSubtle>LaTeX</EmSubtle>.
            </p>
            <div className={"absolute w-full h-full top-0 left-0 overflow-hidden"}>
                {
                    markdownComments.map((comment, index) => (
                        <FloatingComment className={isActive ? "opacity-100" : "opacity-0"} key={index}
                                         content={comment} index={index}/>
                    ))
                }
            </div>
        </section>
    )
}

