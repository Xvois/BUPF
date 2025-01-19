"use server";

import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import changeEmail from "@/app/settings/_actions/changeEmail";

export type SettingsUploadSchema =
    { first_name: string; last_name: string; course: number; year: number | null; profile_picture?: string; email: string, roundup: boolean }

export const handleSubmit = async (fd: SettingsUploadSchema) => {

    const supabase = await createClient();
    const {data: {user}} = await supabase.auth.getUser();

    if (!user) {
        return redirect("/settings?error=No user found");
    }

    /*
        * If the email has changed, update it
     */
    if (user.email !== fd.email) {
        await changeEmail(fd.email);
    }

    /*
        * Update the user's profile
     */
    const {error: profileError} = await supabase.from("profiles").update({
        first_name: fd.first_name,
        last_name: fd.last_name,
        profile_picture: fd.profile_picture
    }).eq("id", user.id);

    if (profileError) {
        return redirect("/settings?error=" + profileError.message);
    }

    /*
        * Update the user's enrollment
     */

    const enrollmentQuery = supabase.from("course_years").select("course_year_id").eq("course_id", fd.course);

    // They have a year (not an academic / other)
    if(fd.year) {
        enrollmentQuery.eq("year_number", fd.year);
    }

    const {data: enrollmentID} = await enrollmentQuery.single();


    if (!enrollmentID) {
        return redirect("/settings?error=An error occurred while fetching your course details.");
    }

    const {error: enrollmentError} = await supabase.from("users_courses").update({
        course_year_id: enrollmentID.course_year_id,
        last_modified: (new Date()).toISOString()
    }).eq("user_id", user.id);

    if (enrollmentError) {
        return redirect("/settings?error=" + enrollmentError.message);
    }

    /*
        * Update the user's subscriptions
     */

    const {error: subscriptionsError} = await supabase.from("subscriptions").update({
        roundup: fd.roundup
    }).eq("id", user.id);

    if (subscriptionsError) {
        return redirect("/settings?error=" + subscriptionsError.message);
    }

}