/*
 While using the /posts route is possible, this route should
 be used for fetching articles specifically as it is cacheable.
 */


import {createAdminClient} from "@/utils/supabase/admin";
import {ArticlesResponse} from "@/types/api/articles/types";
import {unwrapAndApplyQParams} from "@/utils/api/helpers";


export async function GET(request: Request) {
    const client = createAdminClient();

    const params = new URL(request.url).searchParams;

    const query = client.from("posts").select("*, profiles (*)").eq("type", "article");

    try {
        unwrapAndApplyQParams(query, params);
        const response: ArticlesResponse = await query;
        console.log(response)
        return Response.json(response);
    } catch (e) {
        return Response.json({error: e}, {status: 400});
    }
}