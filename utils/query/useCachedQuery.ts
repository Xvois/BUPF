import {cookies} from "next/headers";
import {createHash} from "node:crypto";
import NodeCache from "node-cache";
import {PostgrestBuilder} from "@supabase/postgrest-js";
import {PostgrestSingleResponse} from "@supabase/supabase-js";

const queryCache = new NodeCache({stdTTL: 60 * 5});

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

export default async function useCachedQuery<T>(q: PostgrestBuilder<T>): Promise<PostgrestSingleResponse<T>> {
    const cookie = cookies().get(`sb-${process.env.NEXT_PUBLIC_SUPABASE_ID}-auth-token`);
    if (!cookie) {
        return await q;
    }
    const json = await JSON.parse(cookie.value);
    const key = generateKey(new MyPostgrestBuilder(q), json.access_token);
    const value = (queryCache.get(key) as PostgrestSingleResponse<T>);
    if (value === undefined || !queryCache.ttl(key)) {
        const response = await q;
        queryCache.set(key, response);
        return response;
    } else {
        // If the cache is expired, initiate a re-fetch in the background
        if (!queryCache.ttl(key)) {
            q.then(response => {
                queryCache.set(key, response);
            });
        }
        return value;
    }
}