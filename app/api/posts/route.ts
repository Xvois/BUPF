import {createClient} from "@/utils/supabase/server";

export async function GET(request: Request) {
    const client = createClient();

    const params = new URL(request.url).searchParams;

    let query = client.from("posts").select("*, profiles (*)");

    const target = params.get("target");
    if (target) {
        query = query.match({ target });
    }

    const tags = params.get("tags");
    if (tags) {
        query = query.filter('tags', 'cs', `{${tags}}`);
    }

    const {data, error} = await query;

    if(error) {
        return Response.json({error: error.message}, {status: 500})
    }

    return Response.json(data);
}