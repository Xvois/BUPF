import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import SettingsForm from "@/app/settings/_components/settings-form";

export default async function Settings() {
    const supabase = await createClient();
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

    const {data: subscriptions} = await supabase.from("subscriptions").select("*").eq("id", user.id).single();

    if (!profile || !enrollment?.details?.course || !subscriptions) {
        return redirect("/error?message=An error occurred while fetching your details.");
    }

    return (
        <SettingsForm user={user} profile={profile} enrollment={enrollment} subscriptions={subscriptions}/>
    );
}