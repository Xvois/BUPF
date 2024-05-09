import {Tables} from "@/types/supabase";
import {createClient} from "@/utils/supabase/server";

export const dynamic = "force-dynamic"

type CourseModulesJSON = {
    required: string[],
    optional: string[]
}

type CourseModules = {
    required: Tables<"modules">[],
    optional: Tables<"modules">[]
}

const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export async function GET(request: Request) {
    const supabase = createClient();
    const {data: {user}, error} = await supabase.auth.getUser();

    if (!user) {
        return Response.json({data: null, error: new Error("User not found")});
    }
    const {data: profile} = await supabase.from("profiles").select("*, courses (*)").eq("id", user.id).single();

    if (!profile) {
        return Response.json({data: null, error: new Error("Profile not found")});
    }

    const entry = profile.entry_date;
    const YEAR_IN_MS = 1000 * 60 * 60 * 24 * 365;
    const courses = profile.courses;

    // If they are not enrolled in a course, show them all modules
    if (courses === null || entry === null) {
        const modulesData = await fetch("/api/modules");
        const {modules, modulesError} = await modulesData.json();
        if (modulesError) return Response.json({data: null, error: modulesError});
        return Response.json({data: {required: [], optional: modules}, error: null});
    }

    const year = Math.ceil((Date.now() - new Date(entry).getTime()) / YEAR_IN_MS);

    const courseModulesData = await fetch(`${defaultUrl}/api/courses/${courses.id}/modules`);

    const {
        data: courseModules,
        error: courseModulesError
    } = await courseModulesData.json();

    if (process.env.NODE_ENV === "development") {
        console.log(courseModules)
    }

    if (courseModulesError) {
        return Response.json({data: null, error: courseModulesError});
    }

    let requiredModules: Tables<"modules">[] = [];
    let optionalModules: Tables<"modules">[] = [];

    switch (year) {
        case 1:
            requiredModules = (courseModules.year_1).required;
            optionalModules = (courseModules.year_1).optional;
            break;
        case 2:
            requiredModules = (courseModules.year_2).required;
            optionalModules = (courseModules.year_2).optional;
            break;
        case 3:
            requiredModules = (courseModules.year_3).required;
            optionalModules = (courseModules.year_3).optional;
            break;
        case 4:
            requiredModules = (courseModules.year_4).required;
            optionalModules = (courseModules.year_4).optional;
            break;
        case 5:
            requiredModules = (courseModules.year_5).required;
            optionalModules = (courseModules.year_5).optional;
            break;
        default:
            return Response.json({data: null, error: new Error("Invalid year")});
    }

    const data = {
        required: requiredModules,
        optional: optionalModules
    };

    return Response.json({data, error: null});
}