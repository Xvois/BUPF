import {PostsResponse} from "@/types/api/posts/types";
import {createClient} from "@/utils/supabase/server";
import {applyQueryParams} from "@/utils/api/helpers";


export async function GET(request: Request) {
	const client = createClient();

	const params = new URL(request.url).searchParams;

	const query = client.from("posts").select("*, profiles (*, courses (*))");

	applyQueryParams(query, params);

	const response: PostsResponse = await query;

	return Response.json(response);
}