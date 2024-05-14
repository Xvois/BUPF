import {createAdminClient} from "@/utils/supabase/admin";
import {PostsResponse} from "@/types/api/posts/types";

function toPostgresList(arr: string[]): string {
    let str = '(';
    str += arr.map(item => `"${item.replace(/"/g, '\\"')}"`).join(',');
    str += ')';
    return str;
}

export async function GET(request: Request) {
    // Why admin? See [id] route.
    const client = createAdminClient();

    const params = new URL(request.url).searchParams;

    let query = client.from("posts").select("*");

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

    const response: PostsResponse = await query;

    return Response.json(response);
}