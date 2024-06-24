/**
 * ElementGraph.tsx
 *
 * This file contains the ElementGraph component, which is used to draw lines between child elements.
 */

import React, {cloneElement, SVGProps, useEffect, useRef} from 'react';

/**
 * Type definitions for the props of the ElementGraph component.
 */
interface ElementGraphProps {
    children: React.ReactElement[],
}

interface BoundingBox {
    x: number,
    y: number,
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
const ElementGraph: React.FC<ElementGraphProps & SVGProps<any>> = ({children, ...props}) => {
    const divRef = useRef<HTMLDivElement | null>(null);
    const svgRef = useRef<SVGSVGElement | null>(null);

    // Create an array of refs for all children, or use the existing ref if it exists
    const childRefs = children.map((child) => {
        if(child.props.ref) {
            return child.props.ref;
        } else {
            return React.createRef();
        }
    });


    // Attach the refs to the children (does not override existing refs)
    const childrenWithRefs = children.map((child, index) => {
        return cloneElement(child, {ref: childRefs[index]});
    });


    /**
     * Draws a line between two points.
     */
    const drawLine = (from: BoundingBox, to: BoundingBox) => {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', from.x.toString());
        line.setAttribute('y1', from.y.toString());
        line.setAttribute('x2', to.x.toString());
        line.setAttribute('y2', to.y.toString());
        svgRef.current?.appendChild(line);
    };

    useEffect(() => {
            if (svgRef.current && divRef.current) {
                // Create a new ResizeObserver instance
                const resizeObserver = new ResizeObserver(() => {
                    // Remove all elements from the svg
                    // (Safe type assertion, see above *if* statement)
                    (svgRef.current as SVGElement).innerHTML = '';

                    // Get relative positions of all children
                    const relativePositions = childRefs.map(ref => getRelativePosition(ref.current as HTMLElement, divRef.current as HTMLElement));

                    // Elements already linked
                    const linked: number[] = [];

                    // Draw lines between all elements
                    for (let i = 0; i < relativePositions.length; i++) {
                        for (let j = 0; j < relativePositions.length; j++) {
                            if (i !== j && !linked.includes(j)) {
                                // Very very odd TS error here
                                // @ts-ignore
                                drawLine(getCenter(relativePositions[i]), getCenter(relativePositions[j]));
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
        <div className={"relative w-full h-full -z-10"} ref={divRef}>
            <svg {...props} ref={svgRef} className={"absolute top-0 left-0 w-full h-full"}>
                {/* Lines will be drawn here */}
            </svg>
            {childrenWithRefs}
        </div>
    );
}

export default ElementGraph;