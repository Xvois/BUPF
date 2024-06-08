import {Tables} from "@/types/supabase";
import {PostgrestResponse} from "@supabase/supabase-js";


export type DraftsResponse = PostgrestResponse<Tables<"drafts">>