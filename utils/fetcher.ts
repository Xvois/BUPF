import axios from "axios";
import {createClient} from "@/utils/supabase/client";

export const fetcher = (url: string) => axios.get(url).then((res) => res.data);

type Tables =
    "comments"
    | "comment_reports"
    | "course_modules"
    | "courses"
    | "modules"
    | "posts"
    | "profiles"
    | "topics"

export const sbFetcher = async <T>(url: Tables): Promise<T[] | null> => {
        const supabase = createClient();
        const {data, error} = await supabase.from(url).select("*");
        if (error) throw error;
        return data as T[] || null;
    }