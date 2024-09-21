'use client'

import {Database, Tables} from "@/types/supabase";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import Link, {LinkProps} from "next/link";
import {ArrowRight, BookCopy, Component} from "lucide-react";
import * as React from "react";
import {cn} from "@/utils/cn";

export default function DesktopNavBar({modules, topics}: {
	modules: Database["public"]["Functions"]["get_user_module_assignments"]["Returns"] | null,
	topics: Tables<"topics">[] | null | undefined
}) {
	return (
		<NavigationMenu>
			<NavigationMenuList className={"flex-wrap"}>
				<NavigationMenuItem>
					<Link tabIndex={0} href="/home" legacyBehavior passHref>
						<NavigationMenuLink className={navigationMenuTriggerStyle()}>
							Home
						</NavigationMenuLink>
					</Link>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuTrigger>Modules</NavigationMenuTrigger>
					<NavigationMenuContent>
						<div className="row-span-3 list-none">
							<Link href={"/modules"} legacyBehavior passHref>
								<NavigationMenuLink>
									<div
										className="group flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none transition-shadow hover:shadow-md focus:shadow-md"
									>
										<Component/>
										<div className="mb-2 mt-4 text-lg font-medium">
											Modules
										</div>
										<p className="inline-flex items-center text-sm leading-tight text-muted-foreground">
											Browse your core and optional modules for your enrolled course <ArrowRight
											className={"text-sm text-muted-foreground group-hover:ml-2 ml-1 h-4 transition-all w-fit"}
										/>
										</p>
									</div>
								</NavigationMenuLink>
							</Link>
						</div>
						{modules ?
							<ul className="grid w-[300px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
								{modules.slice(0, 4).map((module) => (
									<ListItem
										key={module.module_id}
										title={module.module_title}
										href={`/modules/${module.module_id}`}
									>
										{module.module_description}
									</ListItem>
								))}
							</ul>
							:
							<ul className="grid w-[300px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
								{Array.from({length: 4}).map((_, i) => (
									<ListItem
										key={i}
										title={"Loading..."}
										href={"/"}
									>
										Loading...
									</ListItem>
								))
								}
							</ul>
						}
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuTrigger>Topics</NavigationMenuTrigger>
					<NavigationMenuContent className="z-10">
						<div className="row-span-3 list-none">
							<Link href={"/topics"} legacyBehavior passHref>
								<NavigationMenuLink>
									<div
										className="group flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none transition-shadow hover:shadow-md focus:shadow-md"
									>
										<BookCopy/>
										<div className="mb-2 mt-4 text-lg font-medium">
											Topics
										</div>
										<p className="inline-flex items-center text-sm leading-tight text-muted-foreground">
											Browse specific physics topics relating to and going beyond your modules
											<ArrowRight
												className={"text-sm text-muted-foreground group-hover:ml-2 ml-1 h-4 transition-all w-fit"}
											/>
										</p>
									</div>
								</NavigationMenuLink>
							</Link>
						</div>
						{topics ?
							<ul className="grid w-[300px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
								{topics.slice(0, 4).map((topic) => (
									<ListItem
										key={topic.id}
										title={topic.title}
										href={`/topics/${topic.id}`}
									>
										{topic.description}
									</ListItem>
								))}
							</ul>
							:
							<p>Loading...</p>
						}
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<Link href="/articles" legacyBehavior passHref>
						<NavigationMenuLink className={navigationMenuTriggerStyle()}>
							Articles
						</NavigationMenuLink>
					</Link>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	)
}


const ListItem = React.forwardRef<HTMLDivElement, LinkProps & {
	className?: string,
	title: string,
	children?: React.ReactNode
}>(({className, title, href, children}, ref) => {
	return (
		<li>
			<Link href={href} legacyBehavior passHref>
				<NavigationMenuLink>
					<div
						className={cn(
							"block h-full select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
							className
						)}
						ref={ref}
					>
						<div className="capitalize text-sm font-medium leading-none">{title}</div>
						<p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
							{children}
						</p>
					</div>
				</NavigationMenuLink>
			</Link>
		</li>
	)
})
ListItem.displayName = "ListItem"
