import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";


export async function GET() {
    const supabase = await createClient();

    const {data: {user}} = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login?redirect=/api/unsubscribe/roundup");
    }

    const {error} = await supabase.from("subscriptions").update({roundup: false}).eq("id", user.id);

    if(error) {
        return redirect("/error?message=An error occurred while unsubscribing from the roundup.");
    }

    return redirect("/success?message=You have successfully unsubscribed from the roundup.");
}