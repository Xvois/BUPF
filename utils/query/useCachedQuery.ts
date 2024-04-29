import {cookies} from "next/headers";
import {createHash} from "node:crypto";
import NodeCache from "node-cache";
import {PostgrestBuilder} from "@supabase/postgrest-js";
import {PostgrestResponse, PostgrestSingleResponse} from "@supabase/supabase-js";

const queryCache = new NodeCache({stdTTL: 60});

class MyPostgrestBuilder extends PostgrestBuilder<any> {
    public getUrl() {
        return this.url;
    }
}

// Function to generate a unique key for each query
function generateKey(query: MyPostgrestBuilder, accessToken: string): string {
    const queryStr = query.getUrl().href;
    return createHash('md5').update(queryStr + accessToken).digest('hex');
}

export default async function useCachedQuery<T>(q: PostgrestBuilder<T>): Promise<PostgrestResponse<T> | PostgrestSingleResponse<T>> {
    const cookie = cookies().get(`sb-${process.env.NEXT_PUBLIC_SUPABASE_ID}-auth-token`);
    if (!cookie) {
        return await q;
    }
    const json = await JSON.parse(cookie.value);
    const key = generateKey(new MyPostgrestBuilder(q), json.access_token);
    const value = (queryCache.get(key) as PostgrestResponse<any>);
    if (value === undefined) {
        const response = await q;
        queryCache.set(key, response);
        return response;
    } else {
        console.log("Using cached query")
        return value;
    }
}