import {Tables} from "@/types/supabase";
import {PostgrestSingleResponse} from "@supabase/supabase-js";


export type ProfileResponse = PostgrestSingleResponse<Tables<"profiles">>;