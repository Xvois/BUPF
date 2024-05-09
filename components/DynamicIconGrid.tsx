'use client'

import React, {useEffect, useRef} from 'react';
import useResizeObserver from "use-resize-observer";
import {Atom, Book, Box, Compass, Diameter, Eclipse, Microscope, Orbit, Pi, Satellite} from "lucide-react";
import {useMediaQuery} from "@/hooks/use-media-query";


export default function DynamicIconGrid() {
    const ref = useRef<HTMLDivElement>(null);
    const {width, height} = useResizeObserver({ref});
    const isTouchScreen = useMediaQuery('(hover: none)');
    const isMobile = useMediaQuery('(max-width: 640px)');

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
        if (isTouchScreen) return;
        window.addEventListener("mousemove", (e) => {
            const scaleEffDivs = document.querySelectorAll('.scale-eff');
            scaleEffDivs.forEach((div) => {
                const rect = div.getBoundingClientRect();
                const x = rect.left + rect.width / 2;
                const y = rect.top + rect.height / 2;
                const dx = x - e.clientX;
                const dy = y - e.clientY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance > 250) {
                    if ((div as HTMLElement).style.opacity === '0') return;
                    (div as HTMLElement).style.opacity = `0`;
                    return;
                }
                const scale = Math.max(0.75, 1.5 - distance / 300);
                (div as HTMLElement).style.transform = `scale(${scale})`;
                (div as HTMLElement).style.opacity = `${1 - distance / 300}`;
            });
        })
    }, [])


    return (
        <div style={{position: 'relative'}} className={`w-full h-full ${isMobile ? 'opacity-50' : ''}`}>
            <div ref={ref} className={`w-full h-full flex flex-row flex-wrap justify-evenly`}>
                {Array.from({length: numCols * numRows}).map((_, i) => (
                    <div key={i}
                         className={`scale-eff flex items-center justify-center h-${cellSize / 4} w-${cellSize / 4}`}>
                        {icons[i % icons.length]}
                    </div>
                ))}
            </div>
        </div>
    )
}