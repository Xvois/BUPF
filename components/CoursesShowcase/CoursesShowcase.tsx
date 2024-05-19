"use client"

import {Tables} from "@/types/supabase";
import {useForm} from "react-hook-form";
import {Form} from "@/components/ui/form";
import CourseDetails from "@/components/form-components/course-details";
import {Button} from "@/components/ui/button";
import {useEffect, useState} from "react";
import apiAxios from "@/utils/axios/apiAxios";
import {PostgrestSingleResponse} from "@supabase/supabase-js";
import useSWR from "swr";
import {fetcher} from "@/utils/fetcher";
import LinkBox from "@/components/LinkBox";
import {ResolvedCourseModules} from "@/types/api/courses/types";
import {ServerError} from "@/components/ServerError";

type LooseObject = {
	[key: string]: any
};

const YEAR_IN_MS = 1000 * 60 * 60 * 24 * 365;

export default function CoursesShowcase() {
	const form = useForm({
		defaultValues: {
			course: "33",
			yearOfStudy: 2023
		}
	});
	const [modules, setModules] = useState<ResolvedCourseModules | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [targetYear, setTargetYear] = useState<number>(1);

	const onSubmit = async (fd: any) => {
		try {
			const response = await apiAxios.get(`/api/courses/[id]/modules`, {id: fd.course});

			const {data, error} = response.data;

			// Calculate the current year of the user based on their entry date
			const year = Math.ceil((Date.now() - new Date(fd.yearOfStudy, 10, 1).getTime()) / YEAR_IN_MS);

			setTargetYear(year);

			if (error) {
				setError(error.message);
				return;
			}
			if (data) {
				setModules(data);
			}
		} catch (err) {
			setError((err as Error).message);
		}
	}

	// Prefetch the modules for the default course
	const {
		data: initData,
	} = useSWR<PostgrestSingleResponse<ResolvedCourseModules>>(`/api/courses/${form.formState.defaultValues?.course}/modules`, fetcher);
	useEffect(() => {
		if (!initData) return;
		setModules(initData.data);
	}, [initData]);

	// Use a type assertion to tell TypeScript that `modules` can be indexed with a string
	let yearData = modules && (modules as LooseObject)[`year_${targetYear}`];


	return (
		<div className={"flex flex-col w-full lg:flex-row gap-4 overflow-hidden"}>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-4 lg:w-96"}>
					<CourseDetails/>
					<Button type={"submit"} className={"w-full"}>Try it out</Button>
				</form>
			</Form>
			<ul className={"flex flex-col w-full h-full space-y-2"}>
				{
					modules && yearData && yearData.required.map((module: Tables<"modules">) => (
						<li className={"flex w-full"} key={module.id}>
							<LinkBox
								key={module.id}
								title={`${module.title}`}
								href={`/modules/${module.id}`}
								className={"max-w-screen-2xl flex-grow h-fit animate-fade"}
								description={module.description || undefined}
							/>
						</li>
					))
				}
				{
					modules && yearData && yearData.optional.map((module: Tables<"modules">) => (
						<li className={"flex w-full"} key={module.id}>
							<LinkBox
								key={module.id}
								title={`${module.title}`}
								href={`/modules/${module.id}`}
								className={"max-w-screen-2xl flex-grow h-fit animate-fade"}
								description={module.description || undefined}
							/>
						</li>

					))
				}
				<li>
					<ServerError>
						{error}
					</ServerError>
				</li>
			</ul>
		</div>
	)

}