"use server"

import {formSchema} from "@/app/admin/assignments/_schema/formSchema";
import {z} from "zod";
import {redirect} from "next/navigation";
import {createAdminClient} from "@/utils/supabase/admin";
import {revalidatePath} from "next/cache";
import {toPostgresList} from "@/utils/supabase/postgresHelpers";


export const updateAssignments = async (fd: z.infer<typeof formSchema>) => {

    // We are working in the admin route, so we use the admin client
    const supabase = createAdminClient();

    // Get course_years_id
    const {data: courseYear} = await supabase.from("course_years").select("course_year_id")
        .eq("course_id", fd.course)
        .eq("year_number", fd.year)
        .single();

    if (!courseYear) {
        return redirect("/admin/assignments?error=An error occurred while fetching the course details.");
    }

    // Delete all assignments that are not in the new list
    const {error: deleteError} = await supabase.from("module_assignments").delete()
        .not("module_id", "in", toPostgresList(fd.modules.map(m => m.id))).eq("course_year_id", courseYear.course_year_id);

    if (deleteError) {
        return redirect("/admin/assignments?error=" + deleteError.message);
    }

    const records = fd.modules.map(m => ({
        course_year_id: courseYear.course_year_id,
        module_id: m.id,
        is_required: m.is_required
    }));

    // Add the new assignments
    const {error: insertError} = await supabase.from("module_assignments").upsert(records, {onConflict: 'module_id, course_year_id'});

    if (insertError) {
        return redirect("/admin/assignments?error=" + insertError.message);
    }

    // Clear the cache for the modules
    revalidatePath(`/api/courses/${fd.course}/${fd.year}/modules`);
}