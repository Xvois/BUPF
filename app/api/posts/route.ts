import {PostsResponse} from "@/types/api/posts/types";
import {createClient} from "@/utils/supabase/server";
import {unwrapAndApplyQParams} from "@/utils/api/helpers";


export async function GET(request: Request) {
	const client = createClient();

	const params = new URL(request.url).searchParams;

	const query = client.from("posts").select("*, profiles (*, courses (*))");

	try {
		unwrapAndApplyQParams(query, params);
		const response: PostsResponse = await query;
		return Response.json(response);
	} catch (e) {
		return Response.json({error: e}, {status: 400});
	}
}