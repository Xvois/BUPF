'use client'

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import * as React from "react";
import {cn} from "@/lib/utils";
import {Tables} from "@/types/supabase";
import {ArrowRight, BookCopy, Component} from "lucide-react";


export default function NavMenu({modules, topics}: {
    modules: Tables<"modules">[] | null,
    topics: Tables<"topics">[] | null
}) {
    return (
        <NavigationMenu>
            <NavigationMenuList className={"flex-wrap"}>
                <NavigationMenuItem>
                    <Link href="/" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            Home
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Modules</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <li className="row-span-3 list-none">
                            <NavigationMenuLink asChild>
                                <a
                                    className="group flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none transition-shadow hover:shadow-md focus:shadow-md"
                                    href="/modules"
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
                                </a>
                            </NavigationMenuLink>
                        </li>
                        {modules ?
                            <ul className="grid w-[300px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                                {modules.slice(0, 4).map((module) => (
                                    <ListItem
                                        key={module.id}
                                        title={module.id}
                                        href={`/modules/${module.id}`}
                                    >
                                        {module.description}
                                    </ListItem>
                                ))}
                            </ul>
                            :
                            <li className={"text-muted-foreground text-sm w-[300px] p-4 md:w-[500px] lg:w-[600px] list-none"}>
                                No modules found for your enrolled course.
                            </li>
                        }
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Topics</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <li className="row-span-3 list-none">
                            <NavigationMenuLink asChild>
                                <a
                                    className="group flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none transition-shadow hover:shadow-md focus:shadow-md"
                                    href="#"
                                >
                                    <BookCopy/>
                                    <div className="mb-2 mt-4 text-lg font-medium">
                                        Topics <span className={"text-sm text-muted-foreground"}>(Coming soon)</span>
                                    </div>
                                    <p className="inline-flex items-center text-sm leading-tight text-muted-foreground">
                                        Browse specific physics topics relating to and going beyond your modules
                                        <ArrowRight
                                            className={"text-sm text-muted-foreground group-hover:ml-2 ml-1 h-4 transition-all w-fit"}
                                        />
                                    </p>
                                </a>
                            </NavigationMenuLink>
                        </li>
                        {topics ?
                            <ul className="grid w-[300px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                                {topics.slice(0, 4).map((topic) => (
                                    <ListItem
                                        key={topic.id}
                                        title={topic.title}
                                        href={`#`}
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
            </NavigationMenuList>
        </NavigationMenu>
    )
}

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({className, title, children, ...props}, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block h-full select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="capitalize text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"