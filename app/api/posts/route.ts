import {PostsResponse} from "@/types/api/posts/types";
import {createClient} from "@/utils/supabase/server";
import {PostgrestOperators} from "@/types/api/options";
import {isQueryFilters, operatorHandlers} from "@/utils/api/helpers";


export async function GET(request: Request) {
	const client = createClient();

	const params = new URL(request.url).searchParams;

	let query = client.from("posts").select("*, profiles (*, courses (*))");

	const filtersString = params.get("filters");
	if (filtersString) {
		const filters = JSON.parse(filtersString);
		filters.forEach((filter: any) => {
			if (isQueryFilters(filters)) {
				const handler = operatorHandlers[filter.operator as PostgrestOperators];
				if (handler) {
					// Use the corresponding handler to format the value
					filter.value = handler(filter.value);
				}
				query.filter(filter.column, filter.operator, filter.value);
			} else {
				// Handle the case where the filters are not in the expected format
				return Response.json({error: "Invalid filters format."});
			}

		});
	}

	const sort = params.get("sort");
	if (sort) {
		const JSONSort = JSON.parse(sort);
		query = query.order("created_at", JSONSort);
	}

	const response: PostsResponse = await query;

	return Response.json(response);
}