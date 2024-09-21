'use client'

import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {Menu} from "lucide-react";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import Link from "next/link";
import * as React from "react";
import {Database, Tables} from "@/types/supabase";


export default function MobileNavMenu({modules, topics}: {
	modules: Database["public"]["Functions"]["get_user_module_assignments"]["Returns"] | null,
	topics: Tables<"topics">[] | null | undefined
}) {
	const [isSheetOpen, setIsSheetOpen] = React.useState(false);
	return (
		<Sheet open={isSheetOpen} onOpenChange={(e) => setIsSheetOpen(e)}>
			<SheetTrigger><Menu/></SheetTrigger>
			<SheetContent className="overflow-scroll">
				<SheetHeader>
					<SheetTitle>Navigation</SheetTitle>
				</SheetHeader>
				<Accordion type="multiple">
					<AccordionItem value="item-1">
						<div className="py-4 font-medium flex">
							<Link onClick={() => setIsSheetOpen(false)} className="w-full h-full"
								  href="/home">Home</Link>
						</div>
					</AccordionItem>
					<AccordionItem value="item-2">
						<AccordionTrigger>Modules</AccordionTrigger>
						<AccordionContent>
							<ul>
								{
									modules ?
										modules.map((module) => (
											<li key={module.module_id}>
												<Link
													onClick={() => setIsSheetOpen(false)}
													href={`/modules/${module.module_id}`}
													className={
														"block h-full space-y-1 rounded-md py-3 leading-none focus:outline-foreground transition-colors"
													}
												>
													<div
														className="capitalize text-sm font-medium leading-none">{module.module_title}</div>
													<p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
														{module.module_description}
													</p>
												</Link>
											</li>
										))
										:
										<p>Loading...</p>
								}
								<li>
									<Link
										onClick={() => setIsSheetOpen(false)}
										href="/modules"
										className={
											"block h-full space-y-1 rounded-md py-3 leading-none focus:outline-foreground transition-colors"
										}
									>
										<div className="capitalize text-sm font-medium leading-none">See all</div>
										<p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
											Browse your core and optional modules for your enrolled course
										</p>
									</Link>
								</li>
							</ul>
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="item-3">
						<AccordionTrigger>Topics</AccordionTrigger>
						<AccordionContent>
							<ul>
								{
									topics ?
										topics.map((topic) => (
											<li key={topic.id}>
												<Link
													onClick={() => setIsSheetOpen(false)}
													href={`/topics/${topic.id}`}
													className={
														"block h-full space-y-1 rounded-md py-3 leading-none focus:outline-foreground transition-colors"
													}
												>
													<div
														className="capitalize text-sm font-medium leading-none">{topic.title}</div>
													<p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
														{topic.description}
													</p>
												</Link>
											</li>
										))
										:
										<p>Loading...</p>
								}
								<li>
									<Link
										onClick={() => setIsSheetOpen(false)}
										href="/topics"
										className={
											"block h-full space-y-1 rounded-md py-3 leading-none focus:outline-foreground transition-colors"
										}
									>
										<div className="capitalize text-sm font-medium leading-none">See all</div>
										<p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
											Browse all topics for your enrolled course
										</p>
									</Link>
								</li>
							</ul>
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value={"item-4"}>
						<div className="py-4 font-medium flex">
							<Link onClick={() => setIsSheetOpen(false)} className="w-full h-full"
								  href="/articles">Articles</Link>
						</div>
					</AccordionItem>
				</Accordion>
			</SheetContent>
		</Sheet>
	)
}