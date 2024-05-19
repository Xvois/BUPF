import {createClient} from "@/utils/supabase/server";

/*
This is a server route that returns the current user.
 Using a supabase client is preferred over this route.
*/


export async function GET(req: Request) {
    const supabase = createClient();

    const userResponse = await supabase.auth.getUser();
    return Response.json(userResponse);
}
