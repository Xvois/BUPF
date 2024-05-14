/**
 * The AnimateGrid class encapsulates the logic for animating elements on mouse movement.
 * It is designed to be instantiated once and used to start the animation.
 */
export class AnimateGrid {
	/**
	 * A set of elements to be animated.
	 */
	private selectedDivs = new Set<Element>();

	/**
	 * The ID of the current animation frame request.
	 */
	private animationFrameId: number | null = null;

	/**
	 * The ID of the current interval for continuous animation.
	 */
	private intervalId: NodeJS.Timeout | null = null;

	/**
	 * Mouse coordinates.
	 */
	private mClientX = 0;
	private mClientY = 0;

	/**
	 * A reference to the parent element of the elements to be animated.
	 */
	private parentRef: React.RefObject<HTMLDivElement>;

	/**
	 * The query selector to select elements for animation.
	 */
	private querySelector: string;

	private running = false;

	/**
	 * Constructs a new AnimateGrid instance.
	 * @param parentRef - A reference to the parent element of the elements to be animated.
	 * @param querySelector - The query selector to select elements for animation.
	 */
	constructor(parentRef: React.RefObject<HTMLDivElement>, querySelector: string) {
		this.parentRef = parentRef;
		this.querySelector = querySelector;
	}

	public updateMouse = (e: MouseEvent) => {
		[this.mClientX, this.mClientY] = [e.clientX, e.clientY];
	}

	/**
	 * Starts the animation.
	 */
	public start = () => {
		if (this.running) return;
		this.running = true;
		window.addEventListener("mousemove", (e) => {
			this.updateMouse(e);
			this.animate()
		});
	}

	/**
	 * Stops the animation.
	 */
	public stop = () => {
		this.running = false;
		if (this.animationFrameId !== null) {
			cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
		}
		if (this.intervalId !== null) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}
		window.removeEventListener("mousemove", (e) => {
			this.updateMouse(e);
			this.animate()
		});
	}

	/**
	 * Performs the animation. This method is private and should not be called directly.
	 * It updates the set of elements if it's empty, then for each element, it calculates
	 * the distance from the mouse cursor and adjusts the element's style based on this distance.
	 * If the mouse cursor is inside the parent element, and not moving, it continuously calls itself to create
	 * an animation effect.
	 */
	private animate = () => {
		if (this.animationFrameId !== null) {
			cancelAnimationFrame(this.animationFrameId);
		}

		this.animationFrameId = requestAnimationFrame(() => {
			// Update the set if it's empty
			if (this.selectedDivs.size === 0) {
				this.selectedDivs = new Set(document.querySelectorAll(this.querySelector));
			}

			const parentRect = this.parentRef.current?.getBoundingClientRect();
			const engaged = parentRect && this.mClientX > parentRect.left && this.mClientX < parentRect.right && this.mClientY > parentRect.top && this.mClientY < parentRect.bottom;

			this.selectedDivs.forEach((div: Element) => {
				const rect = div.getBoundingClientRect();
				const x = rect.left + rect.width / 2;
				const y = rect.top + rect.height / 2;
				const dx = x - this.mClientX;
				const dy = y - this.mClientY;
				const distance = Math.sqrt(dx * dx + dy * dy);
				const element = div as HTMLElement;

				if (engaged) {
					element.style.transition = `none`;
					if (distance > 250) {
						if (element.style.opacity !== '0') {
							element.style.opacity = `0`;
						}
					} else {
						const scale = Math.max(0.75, 1.5 - distance / 300);
						element.style.transform = `scale(${scale})`;
						element.style.opacity = `${1 - distance / 300}`;
					}

					// Ensures it doesn't drift if a mouse is inside the grid
					if (this.intervalId === null) {
						this.intervalId = setInterval(() => {
							this.animate();
						}, 100);
					}

				} else {
					element.style.transition = `all 1s ease-in-out`;
					element.style.opacity = `1`;
					element.style.transform = `scale(1)`;
				}
			});
		});
	}
}