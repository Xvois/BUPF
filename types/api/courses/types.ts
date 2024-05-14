import {PostgrestResponse, PostgrestSingleResponse} from "@supabase/supabase-js";
import {Tables} from "@/types/supabase";

// /api/courses
export type CoursesResponse = PostgrestResponse<Tables<"courses">>

// /api/courses/id
export type CourseResponse = PostgrestSingleResponse<Tables<"courses">>

// /api/courses/id/modules
type CourseModules = {
	required: Tables<"modules">[],
	optional: Tables<"modules">[]
}
export type ResolvedCourseModules = Tables<"course_modules"> & {
	year_1: CourseModules,
	year_2: CourseModules,
	year_3: CourseModules,
	year_4: CourseModules | null,
	year_5: CourseModules | null
}
export type CourseModulesResponse = PostgrestSingleResponse<ResolvedCourseModules>
