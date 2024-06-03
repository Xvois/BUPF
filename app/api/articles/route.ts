/*
 While using the /posts route is possible, this route should
 be used for fetching articles specifically as it is cacheable.
 */


import {createAdminClient} from "@/utils/supabase/admin";
import {ArticlesResponse} from "@/types/api/articles/types";
import {toPostgresList} from "@/utils/api/helpers";


export async function GET(request: Request) {
	const client = createAdminClient();

	const params = new URL(request.url).searchParams;

	let query = client.from("posts").select("*, profiles (*, courses (*))").eq("type", "article");

	const filtersString = params.get("filters");
	if (filtersString) {
		const filters = JSON.parse(filtersString);
		filters.forEach((filter: any) => {
			if (Array.isArray(filter.value)) {
				filter.value = toPostgresList(filter.value);
			}
			query.filter(filter.column, filter.operator, filter.value);
		});
	}

	const sort = params.get("sort");
	if (sort) {
		const JSONSort = JSON.parse(sort);
		query = query.order("created_at", JSONSort);
	}

	const response: ArticlesResponse = await query;

	return Response.json(response);
}