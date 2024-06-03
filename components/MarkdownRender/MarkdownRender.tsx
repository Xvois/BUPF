import ReactMarkdown from 'react-markdown';
import 'katex/dist/katex.min.css'
import "./markdown.css"
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import {cn} from "@/utils/cn";

interface MarkdownRenderProps {
	children: string;

    [x: string]: any; // for additional props
}

export default function MarkdownRender({className, children, ...props}: MarkdownRenderProps) {

    return (
        <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
            className={cn("whitespace-pre-wrap markdown", className)}
            components={{
                a: props => {
                    return <a {...props} className={cn("text-blue-500 underline", props.className)}/>
                }
            }}
            {...props} // pass down additional props
        >
			{children}
        </ReactMarkdown>
    );
}