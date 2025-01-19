// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck Deprecated component


'use client'

/**
 * ElementGraph.tsx
 *
 * This file contains the ElementGraph component, which is used to draw lines between child elements.
 */

import React, {cloneElement, SVGProps, useEffect, useRef} from 'react';
import {cn} from "@/utils/cn";

/**
 * Type definitions for the props of the ElementGraph component.
 */
interface ElementGraphProps {
    nodes: { id: string, element: React.ReactElement }[],
    links: { source: string, target: string }[]
}


type Vector2D = {
    x: number,
    y: number
}

type BoundingBox = Vector2D & {
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

 *
 *
 * This component is used to draw lines between child elements based on the provided nodes and links, it acts as a force graph.
 * Each node element must be a forward ref to allow the ElementGraph component to access its DOM element.
 *
 * @param {ElementGraphProps} props - The props for the ElementGraph component.
 * @param {Array<{ id: string, element: React.ReactElement }>} props.nodes - An array of nodes, each containing an id and a React element.
 * @param {Array<{ source: string, target: string }>} props.links - An array of links, each containing a source and target node id.
 *
 * @example
 * // Define a Module component with forward ref
 * const Module = React.forwardRef<HTMLDivElement, { module: any } & HTMLProps<HTMLDivElement>>(({ module, ...props }, ref) => {
 *     return (
 *         <div {...props} ref={ref} className={cn("", props.className)}>
 *             <p className={"uppercase font-semibold"}>{module.id}</p>
 *         </div>
 *     );
 * });
 *
 * // Define a Tag component with forward ref
 * const Tag = React.forwardRef<HTMLDivElement, { tag: string } & HTMLProps<HTMLDivElement>>(({ tag, ...props }, ref) => {
 *     return (
 *         <div {...props} ref={ref} className={cn("text-muted-foreground", props.className)}>
 *             <p className={"text-xs"}>#{tag}</p>
 *         </div>
 *     );
 * });
 *
 * // Create nodes and links
 * const nodes = [
 *     { id: 'module1', element: <Module module={{ id: 'module1' }} /> },
 *     { id: 'tag1', element: <Tag tag="tag1" /> }
 * ];
 * const links = [
 *     { source: 'module1', target: 'tag1' }
 * ];
 *
 * // Use the ElementGraph component
 * <ElementGraph nodes={nodes} links={links} />
 *
 * @deprecated
 * This component is deprecated and will be removed in the future.
 */
const ElementGraph: React.FC<ElementGraphProps & SVGProps<never>> = ({nodes, links}: ElementGraphProps) => {

    const divRef = useRef<HTMLDivElement | null>(null);
    const svgRef = useRef<SVGSVGElement | null>(null);
    const defsRef = useRef<SVGDefsElement | null>(null);

    const width = divRef.current?.clientWidth || window.innerWidth;
    const height = divRef.current?.clientHeight || window.innerHeight;

    const graph = {nodes, links}
    const motionStates = {
        position: useRef(
            nodes.map(() =>
                ({x: Math.random() * width, y: Math.random() * height}))
        ),
        velocity: useRef(
            nodes.map(() => ({x: 0, y: 0}))
        ),
        acceleration: useRef(
            nodes.map(() => ({x: 0, y: 0}))
        ),
    }


    // Create an array of refs for all children, or use the existing ref if it exists
    const childRefs = nodes.map((n) => {
        const child = n.element;
        if (child.props.ref) {
            return child.props.ref;
        } else {
            return React.createRef();
        }
    });


    // Attach the refs to the children (does not override existing refs)
    const childrenWithRefs = nodes.map((n, index) => {
        return cloneElement(n.element, {
            ref: childRefs[index],
            key: n.id,
            className: cn(n.element.props.className, "absolute top-0 left-0")
        });
    });

    // Store the timestamp of the previous frame
    let lastTimestamp = 0;

    // Function to calculate the forces between nodes
    const tick = (timestamp: number) => {

        // Keep stability at low frame rates
        const dtUpperBound = 16;

        // Calculate the time difference between the current frame and the last frame, with an upper bound
        const dt = Math.min(timestamp - lastTimestamp, dtUpperBound);

        const scale = 1000;

        const dampening = 0.9;
        const repulsion = 20 * scale;
        const attraction = scale;

        const prev = {
            position: motionStates.position.current,
            velocity: motionStates.velocity.current,
            acceleration: motionStates.acceleration.current,
        };

        const forces = prev.position.map((pos, i) => {
            const force = {x: 0, y: 0};
            nodes.forEach((_, j) => {
                if (i !== j) {
                    const otherPos = prev.position[j];
                    const dx = otherPos.x - pos.x;
                    const dy = otherPos.y - pos.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const direction = {x: dx / distance, y: dy / distance};
                    const isLinked = links.some(link => (link.source === nodes[i].id && link.target === nodes[j].id) || (link.source === nodes[j].id && link.target === nodes[i].id));
                    const epsilon = 100;
                    const smoothedDistance = Math.sqrt(distance ** 2 + epsilon ** 2);
                    const attractionForce = attraction / (Math.pow(smoothedDistance, 1.805));
                    const repulsionForce = -repulsion / (Math.pow(smoothedDistance, 2.3));
                    const forceMag = isLinked ? (2 * attractionForce + repulsionForce) : (attractionForce + repulsionForce);
                    force.x += direction.x * forceMag;
                    force.y += direction.y * forceMag;

                    const boundary = divRef.current?.getBoundingClientRect();
                    if (boundary) {
                        const center = getCenter(boundary);
                        const distanceToCenter = Math.sqrt((center.x - pos.x) ** 2 + (center.y - pos.y) ** 2);
                        const toCenter = {
                            x: (center.x - pos.x) / distanceToCenter,
                            y: (center.y - pos.y) / distanceToCenter
                        };

                        const centerForce = 1E-9 * (distanceToCenter ** 2);
                        force.x += toCenter.x * centerForce;
                        force.y += toCenter.y * centerForce;
                    }

                }
            });
            return force;
        });


        motionStates.position.current = prev.position.map((pos, i) => {
            // Use verlet integration to update the position
            const newPos: Vector2D = {
                x: pos.x + prev.velocity[i].x * dt + 0.5 * prev.acceleration[i].x * dt * dt,
                y: pos.y + prev.velocity[i].y * dt + 0.5 * prev.acceleration[i].y * dt * dt
            };
            return newPos;
        });

        motionStates.acceleration.current = forces.map((force) => {
            const newAcc: Vector2D = {
                x: force.x,
                y: force.y
            };
            return newAcc;
        });

        motionStates.velocity.current = prev.velocity.map((vel, i) => {
            const newVel: Vector2D = {
                x: (vel.x * (1 - dampening)) + (prev.acceleration[i].x + motionStates.acceleration.current[i].x) * (dt / 2),
                y: (vel.y * (1 - dampening)) + (prev.acceleration[i].y + motionStates.acceleration.current[i].y) * (dt / 2)
            };
            return newVel;
        });

        // Store the timestamp of the current frame
        lastTimestamp = timestamp;
    }


    const updateDrawPositions = () => {
        childRefs.forEach((ref, i) => {
            if (ref.current) {
                ref.current.style.transform = `translate(${motionStates.position.current[i].x}px, ${motionStates.position.current[i].y}px)`;
            }
        });
    };


    /**
     * Draws a line between two points.
     */
    const drawLine = (from: Vector2D, to: Vector2D) => {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', from.x.toString());
        line.setAttribute('y1', from.y.toString());
        line.setAttribute('x2', to.x.toString());
        line.setAttribute('y2', to.y.toString());
        line.setAttribute('stroke', `rgb(125, 125, 125, 0.5)`);
        svgRef.current?.appendChild(line);
    };

    const cleanupLines = () => {
        while (svgRef.current?.children.length && svgRef.current.children.length > 1) {
            svgRef.current.removeChild(svgRef.current.children[1]);
        }
    }


    const drawLinks = () => {
        // Draw lines between all nodes
        cleanupLines();
        graph.links.forEach(link => {
            const sourceIndex = nodes.findIndex(n => n.id === link.source)
            const targetIndex = nodes.findIndex(n => n.id === link.target)
            if (sourceIndex !== -1 && targetIndex !== -1) {
                const source = childRefs[sourceIndex];
                const target = childRefs[targetIndex];
                if(!source.current || !target.current) return;
                const sourceBB = getRelativePosition(source.current as HTMLElement, divRef.current as HTMLElement);
                const targetBB = getRelativePosition(target.current as HTMLElement, divRef.current as HTMLElement);
                drawLine(getCenter(sourceBB), getCenter(targetBB));
            }
        });
    };

    const animate = (timestamp: number) => {
        // Update ref positions
        tick(timestamp);
        // Update the transform of each child
        updateDrawPositions();
        // Draw the lines between the nodes
        drawLinks();
        // Request the next frame
        return requestAnimationFrame(animate);
    }


    // Start the animation
    useEffect(() => {
        const id = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(id);
    }, []);


    return (
        <div className={"relative w-full h-full overflow-hidden"} ref={divRef}>
            <svg ref={svgRef} className={"absolute top-0 left-0 w-full h-full -z-10"}>
                <defs ref={defsRef}>
                </defs>
                {/* Lines will be drawn here */}
            </svg>
            {childrenWithRefs}
        </div>
    );
}

export default ElementGraph;