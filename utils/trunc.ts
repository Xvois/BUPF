export default function truncateMarkdown(markdown: string, length: number): string {
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

	return truncated;
}