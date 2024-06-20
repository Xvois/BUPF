'use client'

import React, {useEffect, useRef, useState} from "react";
import MarkdownRender from "@/components/MarkdownRender/MarkdownRender";
import {cn} from "@/utils/cn";
import {h1, h2, subtle_p} from "@/styles/text";
import useSWR from "swr";
import {fetcher} from "@/utils/fetcher";
import {ServerError} from "@/components/ServerError";
import {CourseModules} from "@/types/api/courses/types";

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
                <div ref={(el) => {
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
            {
                isActive && <div>Is active.</div>
            }
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

    if (!courseModules) {
        return (
            <ServerError>
                Failed to load course modules
            </ServerError>
        )
    }

    const getActiveModules = () => {
        switch (activeYear) {
            case 1:
                return courseModules.year_1
            case 2:
                return courseModules.year_2
            case 3:
                return courseModules.year_3
            case 4:
                return courseModules.year_4
            case 5:
                return courseModules.year_5
            default:
                return {required: [], optional: []} as CourseModules
        }
    }

    const activeModules = getActiveModules();

    const Timeline = () => {
        return (
            <div className={"grid w-full grid-cols-4 justify-around"}>
                {
                    Array.from({length: courseLength}, (_, i) => i + 1).map((year) => {
                        const isLast = year === courseLength;
                        const stdClass = `p-4 rounded-full bg-background transition-all outline`;
                        // The className depending on the active year
                        const activeYearClass = cn(activeYear > year && "bg-gradient-to-br from-background to-muted/100 outline-muted-foreground", activeYear === year && "bg-foreground")
                        // The className depending on if the parent is active or not
                        const parentActiveClass = isActive ? "opacity-100" : "opacity-0";
                        return (
                            <div className={"relative"} key={`year_${year}`}>
                                <button key={year} onClick={() => setActiveYear(year)}
                                        className={cn(stdClass, activeYearClass, parentActiveClass)}/>
                                {
                                    !isLast &&
                                    (
                                        <React.Fragment>
                                            <div
                                                className={"absolute flex top-0 left-0 w-full h-full pointer-events-none"}>
                                                <div
                                                    className={cn(`w-full h-1 -z-10 my-auto transition-transform ease-out bg-muted-foreground`, activeYear > year ? "scale-x-100 translate-x-1/2" : "scale-x-0 translate-x-0", activeYear === year + 1 && "bg-gradient-to-r from-muted-foreground to-foreground")}/>
                                            </div>
                                            <div
                                                className={"absolute flex top-0 left-0 w-full h-full pointer-events-none"}>
                                                <div className={`w-full h-1 -z-20 my-auto bg-muted translate-x-1/2`}/>
                                            </div>
                                        </React.Fragment>
                                    )

                                }
                            </div>
                        )
                    })
                }
            </div>
        )
    }

    const ModuleShowcase = () => {
        return (
            <div className={"space-y-4"}>
                <div className={"flex flex-row flex-wrap gap-4 justify-center max-w-screen-xl mx-auto"}>
                    {
                        activeModules?.required.map((module, index) => (
                            <div key={index}
                                 className={"p-4 max-w-screen-sm rounded-md border bg-gradient-to-br from-background to-muted/50 flex-grow"}>
                                <h4>{module.title}</h4>
                                <p className={subtle_p}>{module.description}</p>
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }

    return (
        <section className={"relative flex flex-col text-center w-full h-screen p-6 items-center" +
            " align-middle" +
            " justify-center"}>
            {
                isActive && <div>Is active.</div>
            }
            <h2 className={h2}>
                A course that stays with you
            </h2>
            <p className={subtle_p}>
                Choose your course, and <EmSubtle>never</EmSubtle> lose track of your progress.
            </p>
            <div className={"absolute top-0 left-0 w-full h-full flex flex-col justify-between"}>
                <div className={"flex flex-col h-1/3 justify-end"}>
                    <Timeline/>
                </div>
                <div className={"h-1/3"}>
                    <ModuleShowcase/>
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

const FloatingComment = (props: { content: string, index: number, className?: string }) => {

    const classProperties = [
        "bottom-[25%] right-[38%] scale-100 text-foreground/100 z-0",
        "bottom-[65%] right-[40%] scale-[80%] text-foreground/80 -z-20",
        "bottom-[68%] right-[10%] scale-100 text-foreground/100 z-0",
        "bottom-[0%] right-[30%] scale-[60%] text-foreground/60 -z-40",
        "bottom-[33%] right-[25%] scale-[70%] text-foreground/70 -z-30",
        "bottom-[65%] right-[14%] scale-[80%] text-foreground/80 -z-[60]",
        "bottom-[80%] right-[10%] scale-50 text-foreground/50 -z-[50]",
        "bottom-[0%] right-[65%] scale-[80%] text-foreground/80 -z-20",
        "bottom-[70%] right-[70%] scale-90 text-foreground/90 -z-10",
        "bottom-[23%] left-[5%] scale-100 text-foreground/100 z-0",
        "bottom-[20%] right-[10%] scale-50 text-foreground/50 -z-[50]",
        "bottom-[10%] right-[60%] scale-50 text-foreground/50 -z-[50]",
        "bottom-[60%] right-[70%] scale-[60%] text-foreground/60 -z-40",
        "bottom-[20%] left-[75%] scale-[80%] text-foreground/80 -z-20",
        "bottom-[75%] left-[80%] scale-[70%] text-foreground/70 -z-30",
        "bottom-[90%] left-[10%] scale-[60%] text-foreground/60 -z-40",
        "bottom-[10%] left-[0%] scale-100 text-foreground/100 z-0",
    ];

    return (
        <div
            style={{
                transition: "1s opacity",
                transitionDelay: `${props.index / 10}s`,
                transitionTimingFunction: "ease-in-out"
            }}
            className={cn("absolute bg-background border p-4 w-fit min-w-96 shrink-0 h-fit rounded-md shadow", classProperties[props.index], props.className)}>
            <p className={"text-sm text-muted-foreground"}>Anonymous</p>
            <MarkdownRender>
                {props.content}
            </MarkdownRender>
        </div>
    )
}
