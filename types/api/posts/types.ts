import {PostgrestResponse, PostgrestSingleResponse} from "@supabase/supabase-js";
import {Tables} from "@/types/supabase";

// /api/posts
export type PostsResponse = PostgrestResponse<Tables<"posts"> & {
	profiles: Tables<"profiles"> | null
}>

// /api/posts/[id]
export type PostResponse = PostgrestSingleResponse<Tables<"posts">>