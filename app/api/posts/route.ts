import {createClient} from "@/utils/supabase/server";

/*
A helper function that returns and deletes all arrays from an object.
 */
function extractArrays(obj: any) {
    const result: {[key: string]: any[]} = {};
    for (const key in obj) {
        if (Array.isArray(obj[key])) {
            result[key] = obj[key];
            delete obj[key];
        }
    }
    return result;
}

export async function GET(request: Request) {
    const client = createClient();

    const params = new URL(request.url).searchParams;

    let query = client.from("posts").select("*, profiles (*)");

    const filter = params.get("filter");
    if (filter) {
        const JSONFilter = await JSON.parse(filter);
        const arrayValues = extractArrays(JSONFilter);

        query = query.match(JSONFilter);
        for (const key in arrayValues) {
            query = query.contains(key, arrayValues[key]);
        }
    }

    const sort = params.get("sort");
    if (sort) {
        const JSONSort = await JSON.parse(sort);
        query = query.order("created_at" ,JSONSort);
    }

    const {data, error} = await query;

    if(error) {
        return Response.json({error: error.message}, {status: 500})
    }

    return Response.json(data);
}