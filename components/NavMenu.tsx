// noinspection HtmlUnknownTarget

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
import Link, {LinkProps} from "next/link";
import * as React from "react";
import {cn} from "@/utils/cn";
import {Tables} from "@/types/supabase";
import {ArrowRight, BookCopy, Component, Menu} from "lucide-react";
import {useMediaQuery} from "@/hooks/use-media-query";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "./ui/sheet";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "./ui/accordion";


export default function NavMenu({modules, topics}: {
    modules: Tables<"modules">[] | null,
    topics: Tables<"topics">[] | null
}) {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const [isSheetOpen, setIsSheetOpen] = React.useState(false);

    if (!isDesktop) {
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
                                      href="home/">Home</Link>
                            </div>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>Modules</AccordionTrigger>
                            <AccordionContent>
                                <ul>
                                    {
                                        modules ?
                                            modules.map((module) => (
                                                <li key={module.id}>
                                                    <Link
                                                        onClick={() => setIsSheetOpen(false)}
                                                        href={`/modules/${module.id}`}
                                                        className={
                                                            "block h-full space-y-1 rounded-md py-3 leading-none focus:outline-foreground transition-colors"
                                                        }
                                                    >
                                                        <div
                                                            className="capitalize text-sm font-medium leading-none">{module.title}</div>
                                                        <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                                                            {module.description}
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
                        <AccordionItem value="item-4">
                            <div className="py-4 font-medium flex">
                                <Link onClick={() => setIsSheetOpen(false)} className="w-full h-full"
                                      href="/about">About</Link>
                            </div>
                        </AccordionItem>
                        <AccordionItem value="item-5">
                            <div className="py-4 font-medium flex">
                                <a onClick={() => setIsSheetOpen(false)} className="w-full h-full"
                                   href={"mailto:smp90@bath.ac.uk?subject=BUPF%20Help"}>Help</a>
                            </div>
                        </AccordionItem>
                    </Accordion>
                </SheetContent>
            </Sheet>
        )
    }

    return (
        <NavMenuContent modules={modules} topics={topics}/>
    )
}

function NavMenuContent({modules, topics}: {
    modules: Tables<"modules">[] | null,
    topics: Tables<"topics">[] | null
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
                        <li className="row-span-3 list-none">
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
                        </li>
                        {modules ?
                            <ul className="grid w-[300px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                                {modules.slice(0, 4).map((module) => (
                                    <ListItem
                                        key={module.id}
										title={module.title}
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
                    <NavigationMenuContent className="z-10">
                        <li className="row-span-3 list-none">
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
                        </li>
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
                    <Link href="/about" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            About
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}
                                        href={"mailto:smp90@bath.ac.uk?subject=BUPF%20Help"}>
                        Help
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}

const ListItem = React.forwardRef<HTMLDivElement, LinkProps & {
    className?: string,
    title: string,
    children?: React.ReactNode
}>(({className, title, href, children, ...props}, ref) => {
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
ListItem.displayName = "ListItem"
