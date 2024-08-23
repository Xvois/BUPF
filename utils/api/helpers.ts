import {PostgrestOperators} from "@/types/api/options";
import {PostgrestFilterBuilder} from "@supabase/postgrest-js";
import {GenericSchema} from "@supabase/postgrest-js/src/types";

export type Filter = {
    column: string;
    operator: PostgrestOperators;
    value: string | string[];
};

export type Sort = {
    id: string;
    type: {
        ascending?: boolean,
        nullsFirst?: boolean,
        referencedTable?: string,
        foreignTable?: string
    }
};

/**
 * Applies filters, sorting, and limits to a Postgrest query based on URL search parameters.
 *
 * @template T - The schema type extending `GenericSchema`.
 * @template R - The relation type extending `Record<string, unknown>`.
 * @template N - The relation name type.
 * @param {PostgrestFilterBuilder<T, R, N>} query - The Postgrest query builder instance.
 * @param {URLSearchParams} params - The URL search parameters containing filters, sort, and limit.
 * @returns {void}
 *
 * @example
 * // Assuming you have a Supabase client and a request object
 * import { createAdminClient } from "@/utils/supabase/admin";
 * import { applyQueryParams } from "@/utils/api/helpers";
 *
 * export async function GET(request: Request) {
 *   const client = createAdminClient();
 *   const params = new URL(request.url).searchParams;
 *   const query = client.from("posts").select("*, profiles (*, courses (*))").eq("type", "article");
 *   applyQueryParams(query, params);
 *   const response = await query;
 *   return Response.json(response);
 * }
 */
export const applyQueryParams = <T extends GenericSchema, R extends Record<string, unknown>, N>(query: PostgrestFilterBuilder<T, R, N>, params: URLSearchParams): void => {
    const filtersString = params.get("filters");
    if (filtersString) {
        const filters: Filter[] = JSON.parse(filtersString);
        filters.forEach((filter) => {
            if (isFilters(filters)) {
                const handler = operatorHandlers[filter.operator as PostgrestOperators];
                if (handler) {
                    // Use the corresponding handler to format the value
                    filter.value = handler(filter.value);
                }
                query.filter(filter.column, filter.operator, filter.value);
            } else {
                // Handle the case where the filters are not in the expected format
                throw new Error("Invalid filters format.");
            }

        });
    }

    const sort = params.get("sort");
    if (sort) {
        const JSONSort: Sort = JSON.parse(sort);
        if(isSort(JSONSort)) {
            query = query.order(JSONSort.id, JSONSort.type);
        } else {
            throw new Error("Invalid sort format.");
        }
    }

    const limit = params.get("limit");
    if (limit) {
        query = query.limit(+limit);
    }
}

/**
 * Creates a URLSearchParams object with filters and sort parameters.
 * Use this function to create the URL search parameters for a apiAxios request.
 * @param filters
 * @param sort
 *
 * @param limit
 * @see {@link apiAxios}
 */
export const createAPIParams = (filters: Filter[] = [], sort?: Sort, limit?: number): URLSearchParams => {
    const searchParams = new URLSearchParams();
    if (filters.length > 0) {
        searchParams.set('filters', JSON.stringify(filters));
    }
    if (sort) {
        searchParams.set('sort', JSON.stringify(sort));
    }
    if (limit) {
        searchParams.set('limit', limit.toString());
    }
    return searchParams;
}

export function toPostgresList(value: string | string[]): string {
    if (Array.isArray(value)) {
        let str = '(';
        str += value.map(item => `"${item.replace(/"/g, '\\"')}"`).join(',');
        str += ')';
        return str;
    } else {
        // Handle the case where value is a string
        return `"${value.replace(/"/g, '\\"')}"`;
    }
}

// Define the mapping of operators to their handling functions
export const operatorHandlers: Record<PostgrestOperators, (value: string | string[]) => string> = {
    'eq': (value: string | string[]) => `${value}`, // format as a string
    'neq': (value: string | string[]) => `${value}`, // format as a string
    'gt': (value: string | string[]) => `${value}`, // format as a string
    'gte': (value: string | string[]) => `${value}`, // format as a string
    'lt': (value: string | string[]) => `${value}`, // format as a string
    'lte': (value: string | string[]) => `${value}`, // format as a string
    'like': (value: string | string[]) => `%${value}%`, // format as a pattern
    'ilike': (value: string | string[]) => `%${value}%`, // format as a pattern
    'is': (value: string | string[]) => `${value}`, // format as a string
    'in': toPostgresList, // format as a list
    'cs': (value: string | string[]) => `{${value}}`, // format as an array
    'cd': (value: string | string[]) => `{${value}}`, // format as an array
    'sl': (value: string | string[]) => `${value}`, // format as a string
    'sr': (value: string | string[]) => `${value}`, // format as a string
    'nxl': (value: string | string[]) => `${value}`, // format as a string
    'nxr': (value: string | string[]) => `${value}`, // format as a string
    'adj': (value: string | string[]) => `${value}`, // format as a string
    'ov': (value: string | string[]) => `{${value}}`, // format as an array
    'fts': (value: string | string[]) => `${value}`, // format as a string
    'plfts': (value: string | string[]) => `${value}`, // format as a string
    'phfts': (value: string | string[]) => `${value}`, // format as a string
    'wfts': (value: string | string[]) => `${value}`, // format as a string
};

export const isFilters = (value: any[]): value is Filter[] => {
    return Array.isArray(value) && value.every(item => {
        return typeof item === 'object' && 'column' in item && 'operator' in item && 'value' in item;
    });
}

export const isSort = (value: any): value is Sort => {
    return typeof value === 'object' && 'id' in value && 'type' in value;
}

