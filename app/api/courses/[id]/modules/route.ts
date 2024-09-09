import {createAdminClient} from "@/utils/supabase/admin";

export const dynamic = 'force-static';
export const revalidate = 60;

/*
 Due to the structure of the data, getting course modules is a bit more complex.
 It is far more optimised to get the modules for an individual student, as their
 is a view that has been created to make this easier.
 */
export async function GET(
    request: Request,
    {params}: { params: { id: string } }
) {
    const supabase = createAdminClient();

    const {data: courseYearData, error: courseYearError} = await supabase.from("course_years").select("course_year_id").eq("id", params.id).single();

    if (courseYearError) {
        return Response.json({data: null, error: courseYearError});
    }

    const courseYearId = courseYearData.course_year_id;

    const {data: assignments, error: assignmentsError} = await supabase.from("module_assignments").select("*").eq("course_year_id", courseYearId);

    return Response.json({data: assignments, error: assignmentsError});
}