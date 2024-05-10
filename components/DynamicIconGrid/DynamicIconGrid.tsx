'use client'

import React, {useEffect, useRef} from 'react';
import useResizeObserver from "use-resize-observer";
import {Atom, Book, Box, Compass, Diameter, Eclipse, Microscope, Orbit, Pi, Satellite} from "lucide-react";
import {useMediaQuery} from "@/hooks/use-media-query";
import "./scroll.css";


export default function DynamicIconGrid(props: { allowEngagement?: boolean | undefined }) {
    const {allowEngagement = true} = props;
    const ref = useRef<HTMLDivElement>(null);
    const {width, height} = useResizeObserver({ref});
    const isMobile = useMediaQuery('(max-width: 640px)');
    const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

    const cellSize = 36; // Set the size of each cell


    const numCols = Math.floor((width as number) / cellSize);
    const numRows = Math.floor((height as number) / cellSize);

    const iconsClass = "h-4 w-4";

    const icons = [
        <Atom className={iconsClass}/>,
        <Microscope className={iconsClass}/>,
        <Eclipse className={iconsClass}/>,
        <Book className={iconsClass}/>,
        <Box className={iconsClass}/>,
        <Orbit className={iconsClass}/>,
        <Compass className={iconsClass}/>,
        <Pi className={iconsClass}/>,
        <Diameter className={iconsClass}/>,
        <Satellite className={iconsClass}/>
    ]

    useEffect(() => {
        if (!allowEngagement) return;

        let scaleEffDivs = new Set(document.querySelectorAll('.scale-eff'));

        let animationFrameId: number | null = null;

        const handleMouseMove = (e: MouseEvent) => {
            if (animationFrameId !== null) {
                cancelAnimationFrame(animationFrameId);
            }

            animationFrameId = requestAnimationFrame(() => {
                // Update the set if it's empty
                if (scaleEffDivs.size === 0) {
                    scaleEffDivs = new Set(document.querySelectorAll('.scale-eff'));
                }

                scaleEffDivs.forEach((div: Element) => {
                    const rect = div.getBoundingClientRect();
                    const parentRect = ref.current?.getBoundingClientRect();
                    const x = rect.left + rect.width / 2;
                    const y = rect.top + rect.height / 2;
                    const dx = x - e.clientX;
                    const dy = y - e.clientY;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    const engaged = parentRect && e.clientX > parentRect.left && e.clientX < parentRect.right && e.clientY > parentRect.top && e.clientY < parentRect.bottom;

                    if (engaged) {
                        (div as HTMLElement).style.transition = `none`;
                        if (distance > 250) {
                            if ((div as HTMLElement).style.opacity !== '0') {
                                (div as HTMLElement).style.opacity = `0`;
                            }
                        } else {
                            const scale = Math.max(0.75, 1.5 - distance / 300);
                            (div as HTMLElement).style.transform = `scale(${scale})`;
                            (div as HTMLElement).style.opacity = `${1 - distance / 300}`;
                        }
                    } else {
                        (div as HTMLElement).style.transition = `all 1s ease-in-out`;
                        (div as HTMLElement).style.opacity = `1`;
                        (div as HTMLElement).style.transform = `scale(1)`;
                    }
                });
            });
        }

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            if (animationFrameId !== null) {
                cancelAnimationFrame(animationFrameId);
            }
            window.removeEventListener("mousemove", handleMouseMove);
        }
    }, [])


    return (
        <div style={{position: 'relative'}} className={`w-full h-full ${isMobile ? 'opacity-50' : ''}`}>
            <div ref={ref} className={`w-[200vw] h-full flex flex-wrap`}>
                {Array.from({length: numRows}).map((_, rowIndex) => {
                    const row = Array.from({length: numCols}).map((_, colIndex) => (
                        <div key={colIndex}
                             className={`scale-eff flex items-center justify-center h-${cellSize / 4} w-${cellSize / 4}`}>
                            {icons[Math.floor(Math.random() * icons.length)]}
                        </div>
                    ))
                    return (
                        <div key={rowIndex} className={`flex flex-row justify-start items-center overflow-x-hidden whitespace-nowrap 
                    ${!reducedMotion ? (rowIndex % 2 === 0 ? 'animate-scroll-left ml-[100$]' : 'animate-scroll-right') : ''}`}>
                            {row}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}