import Link from "next/link"
import {Button} from "@/components/ui/button";

export function Footer() {
	return (
		<footer className="w-full border-t py-4 mt-4 shadow-sm">
			<div
				className="w-full mx-auto flex flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:gap-0">
				<p className="text-sm text-muted-foreground">Built by the students of the University of
					Bath.</p>

				<nav className="flex flex-wrap items-center justify-center font-medium">
					<Button variant={"link"} size={"sm"} className={"text-xs"} asChild>
						<Link href="/privacy">
							Privacy Policy
						</Link>
					</Button>
					<Button variant={"link"} size={"sm"} className={"text-xs"} asChild>
						<Link href="/about">
							About
						</Link>
					</Button>
					<Button variant={"link"} size={"sm"} className={"text-xs"} asChild>
						<Link href={"mailto:smp90@bath.ac.uk?subject=BUPF%20Help"}>
							Contact
						</Link>
					</Button>
				</nav>
			</div>
		</footer>
	)
}
