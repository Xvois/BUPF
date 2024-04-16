import {Database, Tables} from "@/types/supabase";
import {PostgrestError, SupabaseClient} from "@supabase/supabase-js";

type CourseModulesJSON = {
    required: string[],
    optional: string[]
}

type CourseModules = {
    required: Tables<"modules">[],
    optional: Tables<"modules">[]
}

export const getUserModules = async (supabase: SupabaseClient<Database>, user: Tables<"profiles"> & {
    courses: Tables<"courses"> | null
}): Promise<{ data: CourseModules | null, error: PostgrestError | Error | null }> => {
    try {
        const entry = user.entry_date;
        const YEAR_IN_MS = 1000 * 60 * 60 * 24 * 365;
        const courses = user.courses;

        // If they are not enrolled in a course, show them all modules
        if(courses === null || entry === null) {
            const {data: modules, error: modulesError} = await supabase.from("modules").select("*");
            if(modulesError) return {data: null, error: modulesError}
            return {data: {required: [], optional: modules}, error: null}
        }

        const year = Math.ceil((Date.now() - new Date(entry).getTime()) / YEAR_IN_MS);

        if (courses.modules === null) {
            return {data: null, error: new Error("Course modules not found")};
        }

        const {
            data: courseModules,
            error: courseModulesError
        } = await supabase.from("course_modules").select("*").eq("id", courses.modules).single();

        if (courseModulesError) {
            return {data: null, error: courseModulesError};
        }

        let requiredModuleIDs: string[] = [];
        let optionalModuleIDs: string[] = [];
        switch (year) {
            case 1:
                requiredModuleIDs = (courseModules.year_1 as CourseModulesJSON).required;
                optionalModuleIDs = (courseModules.year_1 as CourseModulesJSON).optional;
                break;
            case 2:
                requiredModuleIDs = (courseModules.year_2 as CourseModulesJSON).required;
                optionalModuleIDs = (courseModules.year_2 as CourseModulesJSON).optional;
                break;
            case 3:
                requiredModuleIDs = (courseModules.year_3 as CourseModulesJSON).required;
                optionalModuleIDs = (courseModules.year_3 as CourseModulesJSON).optional;
                break;
            case 4:
                requiredModuleIDs = (courseModules.year_4 as CourseModulesJSON).required;
                optionalModuleIDs = (courseModules.year_4 as CourseModulesJSON).optional;
                break;
            case 5:
                requiredModuleIDs = (courseModules.year_5 as CourseModulesJSON).required;
                optionalModuleIDs = (courseModules.year_5 as CourseModulesJSON).optional;
                break;
            default:
                return {data: null, error: new Error("Invalid year")};
        }

        const {data: requiredModules, error: requiredModulesError} = await supabase.from("modules").select("*").in("id", requiredModuleIDs);
        const {data: optionalModules, error: optionalModulesError} = await supabase.from("modules").select("*").in("id", optionalModuleIDs);

        if(requiredModulesError) return {data: null, error: requiredModulesError}
        if(optionalModulesError) return {data: null, error: optionalModulesError}

        const data = {
            required: requiredModules,
            optional: optionalModules
        };

        return {data, error: null};
    } catch (e) {
        const error = e as Error;
        return {data: null, error};
    }
}