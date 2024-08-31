"use server";

import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import changeEmail from "@/app/settings/_actions/changeEmail";

export type SettingsUploadSchema =
    { first_name: string; last_name: string; course: number; entry_date: string | null; profile_picture?: string; email: string }

export const handleSubmit = async (fd: SettingsUploadSchema) => {

    const supabase = createClient();
    const {data: {user}} = await supabase.auth.getUser();

    if (!user) {
        return redirect("/settings?error=No user found");
    }

    if (user.email !== fd.email) {
        await changeEmail(fd.email);
    }

    // No email field in the profile table
    const updatedProfile = {
        first_name: fd.first_name,
        last_name: fd.last_name,
        course: fd.course,
        entry_date: fd.entry_date,
        profile_picture: fd.profile_picture
    }

    const {error} = await supabase.from("profiles").update({...updatedProfile}).eq("id", user.id);

    if (error) {
        return redirect("/settings?error=" + error.message);
    }
}