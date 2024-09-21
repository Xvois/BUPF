import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import SettingsForm from "@/app/settings/_components/settings-form";

export const dynamic = 'force-dynamic';

export default async function Settings() {
    const supabase = createClient();
    const {
        data: {user},
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }

    const {data: profile} = await supabase
        .from("profiles")
        .select()
        .eq("id", user.id)
        .single();

    const {data: enrollment} = await supabase.from("users_courses").select("*, details:course_years(*, course:courses(*))").eq("user_id", user.id).single();

    if (!profile || !enrollment?.details?.course) {
        return redirect("/error?message=An error occurred while fetching your details.");
    }

    return (
        <SettingsForm user={user} profile={profile} enrollment={enrollment}/>
    );
}