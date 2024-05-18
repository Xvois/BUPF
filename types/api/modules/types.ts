import {Tables} from "@/types/supabase";
import {PostgrestResponse, PostgrestSingleResponse} from "@supabase/supabase-js";

// /api/modules
export type ModulesResponse = PostgrestResponse<Tables<"modules">>

// /api/modules/[id]
export type ModuleResponse = PostgrestSingleResponse<Tables<"modules">>