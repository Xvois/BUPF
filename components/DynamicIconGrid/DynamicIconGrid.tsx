'use client'

import React, {useEffect, useRef} from 'react';
import useResizeObserver from "use-resize-observer";
import {Atom, Book, Box, Compass, Diameter, Eclipse, Microscope, Orbit, Pi, Satellite} from "lucide-react";
import {useMediaQuery} from "@/hooks/use-media-query";
import "./scroll.css";
import {AnimateGrid} from "@/components/DynamicIconGrid/AnimateGrid";


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

	const animator = new AnimateGrid(ref, '.dynamic-grid');
	useEffect(() => {
		const shouldStop = (reducedMotion || !allowEngagement) && animator.isRunning();
		const shouldStart = !reducedMotion && allowEngagement && !animator.isRunning();

		if (shouldStop) {
			animator.stop();
		} else if (shouldStart) {
			animator.start();
		}

		return () => {
			if (animator.isRunning()) {
				animator.stop();
			}
		}
	}, [reducedMotion, animator, allowEngagement])

	return (
		<div style={{position: 'relative'}}
			 className={`w-full h-full overflow-x-hidden ${isMobile ? 'opacity-50' : ''}`}>
			<div ref={ref} className={`w-[200vw] h-full flex flex-wrap`}>
				{Array.from({length: numRows}).map((_, rowIndex) => {
					const row = Array.from({length: numCols}).map((_, colIndex) => (
						<div key={colIndex}
							 className={`flex items-center justify-center h-${cellSize / 4} w-${cellSize / 4} dynamic-grid`}>
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