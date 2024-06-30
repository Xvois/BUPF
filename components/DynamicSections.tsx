'use client'

import React, {useEffect, useRef, useState} from "react";

type DynamicSectionsProps = {
    children: React.ReactElement[];
} & React.HTMLAttributes<HTMLDivElement>;

export default function DynamicSections({children, ...props}: DynamicSectionsProps) {

    // Define the section refs and which ones are activated
    const numOfSections = children.length;
    const sectionRefs = useRef(Array(numOfSections).fill(null));
    const [activeSection, setActiveSection] = useState(-1);

    useEffect(() => {
        // Create an observer to watch the sections
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const index = sectionRefs.current.indexOf(entry.target);
                if (entry.isIntersecting && index !== -1) {
                    setActiveSection(index);
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
        return React.cloneElement(child, {isActive: activeSection === index});
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