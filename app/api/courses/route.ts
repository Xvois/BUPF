import {createAdminClient} from "@/utils/supabase/admin";
import {CoursesResponse} from "@/types/api/courses/types";
import {unwrapAndApplyQParams} from "@/utils/api/helpers";

export const dynamic = 'force-static';
export const revalidate = 60;


export async function GET(request: Request) {
    // Why admin? See [id] route.
    const client = createAdminClient();

    const params = new URL(request.url).searchParams;

    const query = client.from("courses").select("*");

    try {
        unwrapAndApplyQParams(query, params);
        const response: CoursesResponse = await query;
        return Response.json(response);
    } catch (e) {
        return Response.json({error: e}, {status: 400});
    }


}