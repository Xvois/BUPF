import {createAdminClient} from "@/utils/supabase/admin";
import axios from "axios";
import {PostgrestResponse, PostgrestSingleResponse, SupabaseClient} from "@supabase/supabase-js";
import {Tables} from "@/types/supabase";

const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

// Fetch the course data
async function fetchCourseData(id: string) {
    return await axios.get<PostgrestSingleResponse<Tables<"courses">>>(`${defaultUrl}/api/courses/${id}`, {
        headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-GB,en;q=0.9',
        },
        withCredentials: true
    }).then(res => res.data);
}

// Fetch the course modules
async function fetchCourseModules(supabase: SupabaseClient, modules: number) {
    return await supabase.from('course_modules').select('*').eq('id', modules).single();
}

// Fetch the modules
async function fetchModules(moduleIDs: Tables<"modules">[]) {
    let modFilters = [
        {
            column: "id",
            operator: "in",
            value: moduleIDs
        }
    ];

    let searchParams = new URLSearchParams();
    searchParams.append('filters', JSON.stringify(modFilters));

    return await axios.get<PostgrestResponse<Tables<"modules">>>(`${defaultUrl}/api/modules?${searchParams.toString()}`).then(res => res.data);
}

// Create a map of modules
function createModuleMap(modules: Tables<"modules">[]) {
    const moduleMap: Map<string, Tables<"modules">> = new Map();
    modules.forEach(module => {
        moduleMap.set(module.id, module);
    });
    return moduleMap;
}

// Replace module IDs with actual module objects
function replaceModuleIDs(data: any, moduleMap: Map<string, Tables<"modules">>) {
    // Define a type that can be indexed with a string
    type LooseObject = {
        [key: string]: any
    };

    // Loop over each year
    for (let i = 1; i <= 5; i++) {
        // Use a type assertion to tell TypeScript that `data` can be indexed with a string
        let yearData = (data as LooseObject)[`year_${i}`];

        // Check if the year exists in the courseModules
        if (yearData) {
            // Replace required module IDs with actual module objects
            yearData.required = yearData.required.map((id: string) => moduleMap.get(id));

            // Replace optional module IDs with actual module objects
            yearData.optional = yearData.optional.map((id: string) => moduleMap.get(id));
        }
    }
    return data;
}

export async function GET(
    request: Request,
    {params}: { params: { id: string } }
) {
    const supabase = createAdminClient();

    const {data: course, error: courseError} = await fetchCourseData(params.id);

    if (courseError) {
        console.error("Error fetching course data:", courseError); // Log the error
        return Response.json({data: null, error: courseError}, {status: 200});
    }


    if (!course.modules) {
        return Response.json({data: [], error: null}, {status: 200});
    }

    const {data: courseModules, error: courseModulesError} = await fetchCourseModules(supabase, course.modules);

    if (courseModulesError) {
        return Response.json({data: null, error: courseModulesError}, {status: 200});
    }

    let moduleIDs: Tables<"modules">[] = []
    moduleIDs = moduleIDs.concat(courseModules.year_1.required.concat(courseModules.year_1.optional));
    moduleIDs = moduleIDs.concat(courseModules.year_2.required).concat(courseModules.year_2.optional);
    moduleIDs = moduleIDs.concat(courseModules.year_3.required).concat(courseModules.year_3.optional);
    if (courseModules.year_4) {
        moduleIDs = moduleIDs.concat(courseModules.year_4.required).concat(courseModules.year_4.optional);
    }
    if (courseModules.year_5) {
        moduleIDs = moduleIDs.concat(courseModules.year_5.required).concat(courseModules.year_5.optional);
    }

    const {data: modules, error: modulesError} = await fetchModules(moduleIDs);

    if (modulesError) {
        console.error("Error fetching modules:", modulesError); // Log the error
        return Response.json({data: null, error: modulesError}, {status: 200});
    }

    const moduleMap = createModuleMap(modules);

    const data = replaceModuleIDs(courseModules, moduleMap);

    return Response.json({data: data, error: null});
}