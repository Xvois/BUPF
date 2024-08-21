export function truncateMarkdown(markdown: string, length: number): string {
	// Initial truncation point
	let truncPoint = length;


	// Regular expression for a LaTeX equation
	const latexRegEx = /\$.*?\$/g;

	// Find all LaTeX equations
	let match;
	const latexMatches = [];
	while ((match = latexRegEx.exec(markdown)) !== null) {
		latexMatches.push(match);
	}

	// Check if the truncation point is within a LaTeX equation
	for (const match of latexMatches) {
		if (truncPoint > match.index && truncPoint < match.index + match[0].length) {
			// Adjust the truncation point to the end of the equation
			truncPoint = match.index + match[0].length;
			break;
		}
	}

	// Check if the truncation point is within a word
	if (markdown.charAt(truncPoint) !== ' ' && markdown.charAt(truncPoint + 1) !== ' ') {
		// Adjust the truncation point to the end of the word
		const nextSpace = markdown.indexOf(' ', truncPoint);
		if (nextSpace !== -1) {
			truncPoint = nextSpace;
		}
	}

	// Truncate the string at the adjusted truncation point
	const truncated = markdown.slice(0, truncPoint);

	// Add an ellipsis if the string was truncated
	if (truncated !== markdown) {
		return truncated + '...';
	}

	return truncated;
}

export const calcFittingCharacters = (content: string, width: number, height: number, fontSize: number): number => {
	// Calculate the maximum number of characters that can fit in the given area
	const maxCharacters = calcMaxCharacters(width, height, fontSize);

	// Truncate the content to the maximum number of characters
	return Math.min(content.length, maxCharacters);
};


export const calcMaxCharacters = (width: number, height: number, fontSize: number): number => {
	// Average width of a character in the given font size (approximation)
	const avgCharWidth = fontSize * 0.75; // This is a rough estimate and may vary with different fonts

	// Calculate the maximum number of characters that can fit in the given area
	return Math.floor(width / avgCharWidth) * Math.floor(height / fontSize);
}