// noinspection HtmlUnknownTarget

'use client'
import * as React from "react";
import {useEffect} from "react";
import {useMediaQuery} from "@/hooks/use-media-query";
import useSWR from "swr";
import {fetcher} from "@/utils/fetcher";
import {UserModulesResponse} from "@/types/api/user/types";
import {TopicsResponse} from "@/types/api/topics/types";
import DesktopNavBar from "@/components/NavMenu/Desktop";
import MobileNavMenu from "@/components/NavMenu/Mobile";


export default function NavMenu() {

	const {data: userModulesResponse} = useSWR<UserModulesResponse>("/api/user/modules", fetcher);
	const modules = userModulesResponse?.data?.required;
	const {data: topicsResponse} = useSWR<TopicsResponse>("/api/topics", fetcher);
	const topics = topicsResponse?.data;
	const isDesktop = useMediaQuery("(min-width: 768px)");

	useEffect(() => {
		console.log(isDesktop)
	}, [isDesktop]);

	if (isDesktop) {
		return <DesktopNavBar modules={modules} topics={topics}/>
	} else {
		return <MobileNavMenu modules={modules} topics={topics}/>
	}
}

