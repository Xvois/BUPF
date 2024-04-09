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


export default function NavMenu({modules, topics}: {
    modules: Tables<"modules">[] | null,
    topics: Tables<"topics">[] | null
}) {
    return (
        <NavigationMenu>
            <NavigationMenuList className={"flex-wrap"}>
                <NavigationMenuItem>
                    <Link href="/home" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            Home
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Modules</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        {modules ?
                            <ul className="grid w-[300px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                                {modules.map((module) => (
                                    <ListItem
                                        key={module.id}
                                        title={module.id}
                                        href={`/modules/${module.id}`}
                                    >
                                        {module.description}
                                    </ListItem>
                                ))}
                                <ListItem title={"more"} key={"all_modules"} href={"/modules"}>
                                    View all modules -{">"}
                                </ListItem>
                            </ul>
                            :
                            <p>Loading...</p>
                        }
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Topics</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        {topics ?
                            <ul className="grid w-[300px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                                {topics.map((topic) => (
                                    <ListItem
                                        key={topic.id}
                                        title={topic.title}
                                        href={`/topics/${topic.id}`}
                                    >
                                        {topic.description}
                                    </ListItem>
                                ))}
                                <ListItem title={"more"} key={"all_modules"} href={"/modules"}>
                                    View all topics -{">"}
                                </ListItem>
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
                    <div className="uppercase text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"