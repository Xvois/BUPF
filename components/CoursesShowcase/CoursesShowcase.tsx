'use client'

import {useState} from "react";
import {CourseModules} from "@/types/api/courses/types";
import CourseForm from "@/components/CoursesShowcase/CourseForm";
import ModulesList from "@/components/CoursesShowcase/ModulesList";


export default function CoursesShowcase() {
	const [modules, setModules] = useState<CourseModules | null>(null);

	return (
		<div className={"flex flex-col w-full lg:flex-row gap-4 overflow-hidden"}>
			<CourseForm setModules={setModules}/>
			<ModulesList modules={modules}/>
		</div>
	)

}