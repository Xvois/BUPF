export function toPostgresList(value: string | string[]): string {
    if (Array.isArray(value)) {
        let str = '(';
        str += value.map(item => `"${item.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`).join(',');
        str += ')';
        return str;
    } else {
        // Handle the case where value is a string
        return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
    }
}