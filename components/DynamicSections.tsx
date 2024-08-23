'use client'

import React, {createContext, ReactElement, ReactNode, useContext, useEffect, useRef, useState} from 'react';
import {ChevronDown, ChevronUp} from "lucide-react";
import {Button} from "@/components/ui/button";
import {clamp} from "@radix-ui/number";

type ActiveSectionContextType = {
    activeSection: number;
    registerSection: (ref: HTMLDivElement) => void;
    getSectionIndex: (ref: HTMLDivElement | null) => number;
    sectionRefs: React.MutableRefObject<HTMLDivElement[]>;
};

const ActiveSectionContext = createContext<ActiveSectionContextType | undefined>(undefined);

export const useActiveSection = () => {
    const context = useContext(ActiveSectionContext);
    if (!context) {
        throw new Error('useActiveSection must be used within a ActiveSectionProvider');
    }
    return context;
};

const ActiveSectionProvider: React.FC<{ children: ReactNode, transitionWidget?: boolean }> = ({
                                                                                                  children,
                                                                                                  transitionWidget = true
                                                                                              }) => {
    const [activeSection, setActiveSection] = useState(-1);
    const sectionRefs = useRef<HTMLDivElement[]>([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const index = sectionRefs.current.indexOf(entry.target as HTMLDivElement);
                    if (entry.isIntersecting && index !== -1) {
                        console.log("Setting active section to", index);
                        setActiveSection(index);
                    }
                });
            },
            {threshold: 0.75}
        );

        sectionRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => {
            sectionRefs.current.forEach((ref) => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, []);

    const registerSection = (ref: HTMLDivElement) => {
        if (ref && !sectionRefs.current.includes(ref)) {
            sectionRefs.current.push(ref);
        }
    };

    const getSectionIndex = (ref: HTMLDivElement | null) => {
        if (!ref) return -1;
        return sectionRefs.current.indexOf(ref);
    }

    return (
        <ActiveSectionContext.Provider value={{activeSection, registerSection, getSectionIndex, sectionRefs}}>
            {children}
            {transitionWidget && <TransitionWidget/>}
        </ActiveSectionContext.Provider>
    );
};

const TransitionWidget = () => {
    const {activeSection, sectionRefs} = useActiveSection();
    const prevSection = clamp(activeSection - 1, [0, sectionRefs.current.length - 1]);
    const nextSection = clamp(activeSection + 1, [0, sectionRefs.current.length - 1]);

    return (
        <div className={"fixed backdrop-blur inline-flex flex-col gap-2 bottom-4 right-4 p-2 rounded-md border z-20"}>
            <Button variant={"ghost"}
                    onClick={() => sectionRefs.current[prevSection].scrollIntoView({behavior: "smooth"})}>
                <ChevronUp/>
            </Button>
            <Button variant={"ghost"}
                    onClick={() => sectionRefs.current[nextSection].scrollIntoView({behavior: "smooth"})}>
                <ChevronDown/>
            </Button>
        </div>
    );
}

type DynamicSectionsProps = {
    children: ReactElement[];
} & React.HTMLAttributes<HTMLDivElement>;


export default function DynamicSections({children, ...props}: DynamicSectionsProps) {
    return (
        <ActiveSectionProvider>
            <div {...props}>
                {children}
            </div>
        </ActiveSectionProvider>
    );
}