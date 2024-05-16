import {PostgrestOperators, QueryFilters} from "@/types/api/options";

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

export const isQueryFilters = (value: any): value is QueryFilters => {
	return Array.isArray(value) && value.every(item => {
		return typeof item === 'object' && 'column' in item && 'operator' in item && 'value' in item;
	});

}