import {useForm} from "react-hook-form";
import {Form} from "@/components/ui/form";
import CourseDetails from "@/components/form-components/course-details";
import {Button} from "@/components/ui/button";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import apiAxios from "@/utils/axios/apiAxios";
import useSWR from "swr";
import {fetcher} from "@/utils/fetcher";
import {CourseModules} from "@/types/api/courses/types";
import {ServerError} from "@/components/ServerError";

type LooseObject = {
	[key: string]: any
};

const YEAR_IN_MS = 1000 * 60 * 60 * 24 * 365;

export default function CourseForm({setModules}: { setModules: Dispatch<SetStateAction<CourseModules | null>> }) {
	const form = useForm({
		defaultValues: {course: "33", yearOfStudy: 2023}
	});

	const [error, setError] = useState<string | null>(null);


	const handleSubmit = form.handleSubmit((formData) => {
		onSubmit(formData);
	});

	const onSubmit = async (fd: any) => {
		try {
			const {
				data,
				error
			} = await apiAxios.get(`/api/courses/[id]/modules`, {id: fd.course}).then(res => res.data);


			// Calculate the current year of the user based on their entry date
			const year = Math.ceil((Date.now() - new Date(fd.yearOfStudy, 10, 1).getTime()) / YEAR_IN_MS);

			if (error) {setError(error.message)} else {
				const targetModules = (data as LooseObject)[`year_${year}`];
				setModules(targetModules);
			}


		} catch (err) {
			setError((err as Error).message);
		}
	}

	// Prefetch the modules for the default course
	const {data: initData} = useSWR(`/api/courses/${form.getValues('course')}/modules`, fetcher);
	useEffect(() => {
		if (!initData) return;
		setModules(initData.data.year_1);
	}, [initData]);

	return (
		<Form {...form}>
			<form onSubmit={handleSubmit} className={"space-y-4 lg:w-96"}>
				<CourseDetails/>
				<Button type={"submit"} className={"w-full"}>Try it out</Button>
				<ServerError>
					{error}
				</ServerError>
			</form>
		</Form>
	);
}