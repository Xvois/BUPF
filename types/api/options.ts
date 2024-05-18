export type PostgrestOperators =
	'eq'
	| 'neq'
	| 'gt'
	| 'gte'
	| 'lt'
	| 'lte'
	| 'like'
	| 'ilike'
	| 'is'
	| 'in'
	| 'cs'
	| 'cd'
	| 'sl'
	| 'sr'
	| 'nxl'
	| 'nxr'
	| 'adj'
	| 'ov'
	| 'fts'
	| 'plfts'
	| 'phfts'
	| 'wfts';

export type QueryFilters = {
	column: string;
	operator: PostgrestOperators;
	value: string;
}[]