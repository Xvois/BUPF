import {PostgrestResponse, PostgrestSingleResponse} from "@supabase/supabase-js";
import {Tables} from "@/types/supabase";

// /api/courses
export type CoursesResponse = PostgrestResponse<Tables<"courses">>

// /api/courses/id
export type CourseResponse = PostgrestSingleResponse<Tables<"courses">>

// /api/courses/id/modules
export type CourseModulesResponse = PostgrestResponse<Tables<"module_assignments">>
