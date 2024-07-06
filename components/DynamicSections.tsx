'use client'

import React, {createContext, ReactElement, ReactNode, useContext, useEffect, useRef, useState} from 'react';

type ActiveSectionContextType = {
    activeSection: number;
    registerSection: (ref: HTMLDivElement) => void;
    getSectionIndex: (ref: HTMLDivElement | null) => number;
};

const ActiveSectionContext = createContext<ActiveSectionContextType | undefined>(undefined);

export const useActiveSection = () => {
    const context = useContext(ActiveSectionContext);
    if (!context) {
        throw new Error('useActiveSection must be used within a ActiveSectionProvider');
    }
    return context;
};

const ActiveSectionProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [activeSection, setActiveSection] = useState(-1);
    const sectionRefs = useRef<HTMLDivElement[]>([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const index = sectionRefs.current.indexOf(entry.target as HTMLDivElement);
                    if (entry.isIntersecting && index !== -1) {
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
        <ActiveSectionContext.Provider value={{activeSection, registerSection, getSectionIndex}}>
            {children}
        </ActiveSectionContext.Provider>
    );
};

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