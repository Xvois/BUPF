// noinspection HtmlUnknownTarget

'use client'
import * as React from "react";
import {useMediaQuery} from "@/hooks/use-media-query";
import useSWR from "swr";
import {fetcher} from "@/utils/fetcher";
import DesktopNavBar from "@/components/NavMenu/Desktop";
import MobileNavMenu from "@/components/NavMenu/Mobile";


export default function NavMenu() {

	const {data: userModulesResponse} = useSWR("/api/user/modules", (url) => fetcher(url));
	const modules = userModulesResponse?.data?.required;
	const {data: topicsResponse} = useSWR("/api/topics", (url) => fetcher(url));
	const topics = topicsResponse?.data;
	const isDesktop = useMediaQuery("(min-width: 768px)");

	if (isDesktop) {
		return <DesktopNavBar modules={modules} topics={topics}/>
	} else {
		return <MobileNavMenu modules={modules} topics={topics}/>
	}
}

