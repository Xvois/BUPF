import {createClient} from "@/utils/supabase/server";
import {PostsResponse} from "@/types/api/posts/types";


export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
    const supabase = createClient();

    const response: PostsResponse = await supabase.from('posts').select('*').eq('id', params.id).single()

    return Response.json(response);
}