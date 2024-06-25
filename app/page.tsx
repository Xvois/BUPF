'use client'

import React, {useEffect, useRef, useState} from "react";
import MarkdownRender from "@/components/MarkdownRender/MarkdownRender";
import {cn} from "@/utils/cn";
import {h1, h2, subtle_p} from "@/styles/text";
import useSWR from "swr";
import {fetcher} from "@/utils/fetcher";
import ElementGraph from "@/components/ElementGraph";

/*
 Emphasise something within a subtle text
 */
const EmSubtle = (props: { children: React.ReactNode }) => {
    return (
        <span className={"text-foreground text-sm"}>{props.children}</span>
    )
}

type DynamicSectionsProps = {
    children: React.ReactElement[];
} & React.HTMLAttributes<HTMLDivElement>;

const DynamicSections = ({children, ...props}: DynamicSectionsProps) => {

    // Define the section refs and which ones are activated
    const numOfSections = children.length;
    const sectionRefs = useRef(Array(numOfSections).fill(null));
    const [activatedSections, setActivatedSections] = useState(Array(numOfSections).fill(false));

    useEffect(() => {

        // Create an observer to watch the sections
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const index = sectionRefs.current.indexOf(entry.target);
                if (entry.isIntersecting && index !== -1) {
                    setActivatedSections((prev) => {
                        const newSections = [...prev];
                        newSections[index] = true;
                        return newSections;
                    });
                }
            });
        }, {
            threshold: 0.75
        });

        // Observe each section
        sectionRefs.current.forEach((ref) => {
            if (ref) {
                observer.observe(ref);
            }
        });

        // Cleanup
        return () => {
            sectionRefs.current.forEach((ref) => {
                if (ref) {
                    observer.unobserve(ref);
                }
            });
        };
    }, []);

    // Clone children and attach props to pass down
    const childrenWithProps = children.map((child, index) => {
        return React.cloneElement(child, {isActive: activatedSections[index]});
    });

    return (
        <div {...props}>
            {childrenWithProps.map((child, index) => (
                <div key={`section_${index}`} ref={(el) => {
                    sectionRefs.current[index] = el;
                }}>
                    {child}
                </div>
            ))}
        </div>
    );
}

export default function Landing() {
    return (
        <DynamicSections className={"w-full"}>
            <WelcomeSection/>
            <MarkdownSection/>
            <CourseSection/>
        </DynamicSections>
    );
}

const WelcomeSection = ({isActive}: { isActive?: boolean }) => {
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

const MarkdownSection = ({isActive}: { isActive?: boolean }) => {
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

const CourseSection = ({isActive}: { isActive?: boolean }) => {
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

    const allActiveModules = activeModules?.required.concat(activeModules?.optional);

    const YearsDisplay = () => {
        return (
            <div className={"flex flex-col h-1/3 justify-end"}>
                <div className={"flex flex-row gap-16 justify-center"}>
                    {
                        Array.from({length: courseLength}, (_, i) => i + 1).map((year) => (
                            <div key={year}>
                                <button onClick={() => setActiveYear(year)}
                                        className={cn("text-6xl font-black transition duration-250 text-muted hover:text-muted-foreground", year === activeYear && "text-foreground hover:text-foreground")}>{year}</button>
                            </div>
                        ))
                    }
                </div>
                <p className={subtle_p}>year of <EmSubtle>MSci
                    Physics</EmSubtle></p>
            </div>
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
            <div className={"absolute top-0 left-0 w-full h-full flex flex-col justify-between"}>
                <div className={"flex flex-col h-1/3 justify-end"}>
                    <YearsDisplay/>
                </div>
                <div className={"h-1/3"}>
                    <ElementGraph stroke={"hsl(var(--foreground))"} strokeWidth={"2"}
                                  stops={[
                                      {offset: "0%", style: {stopOpacity: 0}},
                                      {offset: "50%", style: {stopColor: "hsl(var(--foreground))", stopOpacity: 1}},
                                      {offset: "100%", style: {stopOpacity: 0}}
                                  ]}>
                        {
                            allActiveModules?.map((module, index) => (
                                <button
                                    key={module.id}
                                    className={cn("absolute text-sm p-2 border backdrop-blur-sm bg-none rounded-md")}>
                                    {module.title}
                                </button>
                            ))
                        }
                    </ElementGraph>
                </div>
            </div>
        </section>
    )

}

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
