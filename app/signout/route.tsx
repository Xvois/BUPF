import {redirect} from "next/navigation";
import {cookies} from "next/headers";
import {createClient} from "@/utils/supabase/server";
import {revalidatePath} from "next/cache";

export async function GET() {
    const supabase = await createClient();
    await supabase.auth.signOut();

    const cookieStore = await cookies();


    cookieStore.getAll().forEach(cookie => {
        if(cookie.name.startsWith("sb")) {
            cookieStore.delete(cookie.name);
        }
    })

    revalidatePath("/", "layout");
    return redirect('/login')
}