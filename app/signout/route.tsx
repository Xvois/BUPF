import {redirect} from "next/navigation";
import {cookies} from "next/headers";
import {createClient} from "@/utils/supabase/server";

export async function GET(req: Request) {
    const supabase = createClient();
    await supabase.auth.signOut();

    cookies().getAll().forEach(cookie => {
        if(cookie.name.startsWith("sb")) {
            cookies().delete(cookie.name);
        }
    })

    return redirect('/login')
}