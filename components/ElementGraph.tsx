/**
 * ElementGraph.tsx
 *
 * This file contains the ElementGraph component, which is used to draw lines between child elements.
 */

import React, {cloneElement, Fragment, SVGProps, useEffect, useRef} from 'react';

/**
 * Type definitions for the props of the ElementGraph component.
 */
interface ElementGraphProps {
    children: React.ReactElement[] | React.ReactElement | undefined | null,
    stops?: React.SVGProps<SVGStopElement>[]
}

type Position = {
    x: number,
    y: number
}

type BoundingBox = Position & {
    width: number,
    height: number
}

/**
 * Returns the center of a bounding box.
 */
const getCenter = (bb: BoundingBox) => {
    return {
        x: bb.x + bb.width / 2,
        y: bb.y + bb.height / 2
    };
}

/**
 * Returns the position of an element relative to a container.
 */
const getRelativePosition = (element: HTMLElement, container: HTMLElement): BoundingBox => {
    const rect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    return {
        x: rect.left - containerRect.left,
        y: rect.top - containerRect.top,
        width: rect.width,
        height: rect.height
    } as BoundingBox;
}

/**
 * The ElementGraph component is used to draw lines between child elements.
 */
const ElementGraph: React.FC<ElementGraphProps & SVGProps<any>> = ({children, stops, ...svgProps}) => {
    const divRef = useRef<HTMLDivElement | null>(null);
    const svgRef = useRef<SVGSVGElement | null>(null);
    const defsRef = useRef<SVGDefsElement | null>(null);

    // Ensure children is an array
    if (!Array.isArray(children) && children) {
        children = [children];
    }

    if (!children) {
        children = [];
    }

    // Safe assertion, see above
    const safeChildren = children as React.ReactElement[];

    // Create an array of refs for all children, or use the existing ref if it exists
    const childRefs = safeChildren.map((child) => {
        if (child.props.ref) {
            return child.props.ref;
        } else {
            return React.createRef();
        }
    });


    // Attach the refs to the children (does not override existing refs)
    const childrenWithRefs = safeChildren.map((child, index) => {
        return cloneElement(child, {ref: childRefs[index]});
    });


    /**
     * Draws a line between two points.
     */
    const drawLine = (from: Position, to: Position) => {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', from.x.toString());
        line.setAttribute('y1', from.y.toString());
        line.setAttribute('x2', to.x.toString());
        line.setAttribute('y2', to.y.toString());
        line.setAttribute('stroke', `url(#gradient)`);
        svgRef.current?.appendChild(line);
    };

    const cleanupLines = () => {
        while (svgRef.current?.children.length && svgRef.current.children.length > 1) {
            svgRef.current.removeChild(svgRef.current.children[1]);
        }
    }

    useEffect(() => {
            if (svgRef.current && divRef.current) {
                // Create a new ResizeObserver instance
                const resizeObserver = new ResizeObserver(() => {
                    // Remove all existing lines, excluding the first child (the defs element)
                    // (Safe type assertion, see above *if* statement)
                    cleanupLines();

                    // Get relative positions of all children
                    const relativePositions = childRefs.map(ref => getRelativePosition(ref.current as HTMLElement, divRef.current as HTMLElement));

                    // Elements already linked
                    const linked: number[] = [];

                    // Draw lines between all elements
                    for (let i = 0; i < relativePositions.length; i++) {
                        for (let j = 0; j < relativePositions.length; j++) {
                            if (i !== j && !linked.includes(j)) {
                                const from = getCenter(relativePositions[i]);
                                const to = getCenter(relativePositions[j]);
                                drawLine(from, to);
                            }
                        }
                        linked.push(i);
                    }
                });

                // Start observing the div element
                if (divRef.current) {
                    resizeObserver.observe(divRef.current);
                }

                // Clean up function
                return () => {
                    // Stop observing the div element
                    if (divRef.current) {
                        resizeObserver.unobserve(divRef.current);
                    }
                };
            }
        }
        ,
        [children]
    ); // Re-run the effect if children change

    return (
        <div className={"relative w-full h-full"} ref={divRef}>
            <svg {...svgProps} ref={svgRef} className={"absolute top-0 left-0 w-full h-full -z-10"}>
                <defs ref={defsRef}>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        {
                            stops ? (stops?.map((stop, index) => {
                                    return <stop key={index} {...stop}/>
                                }))
                                :
                                (
                                    <Fragment>
                                        <stop offset="0%" style={{stopOpacity: 0}}/>
                                        <stop offset="50%" style={{
                                            stopColor: svgProps.stroke ? svgProps.stroke : "hsl(var(--foreground))",
                                            stopOpacity: 1
                                        }}/>
                                        <stop offset="100%" style={{stopOpacity: 0}}/>
                                    </Fragment>
                                )
                        }
                    </linearGradient>
                </defs>
                {/* Lines will be drawn here */}
            </svg>
            {childrenWithRefs}
        </div>
    );
}

export default ElementGraph;