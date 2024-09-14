"use client"
import * as React from "react";
import {useMediaQuery} from "@/hooks/use-media-query";
import DesktopNavBar from "@/components/NavMenu/Desktop";
import MobileNavMenu from "@/components/NavMenu/Mobile";
import {Database, Tables} from "@/types/supabase";

/**
 * A navigation menu that displays the modules and topics of the user.
 * Dynamically switches between a desktop and mobile view based on the screen size.
 */
export default function NavMenu({modules, topics}: {
    modules: Database["public"]["Functions"]["get_user_module_assignments"]["Returns"] | null, topics: Tables<"topics">[] | null
}) {

    const isMobile = useMediaQuery("(max-width: 768px)");

    if (isMobile) {
        return <MobileNavMenu modules={modules} topics={topics}/>
    } else {
        return <DesktopNavBar modules={modules} topics={topics}/>
    }
}

