'use client'

import {Fragment, useEffect} from "react";
import {useMediaQuery} from "@/hooks/use-media-query";


export default function ThemeListener() {
	const isDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

	useEffect(() => {
		if (isDarkMode) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, [isDarkMode]);

	return <Fragment/>
}