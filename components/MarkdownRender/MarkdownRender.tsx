import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import "./markdown.css"
import {cn} from "@/lib/utils";

interface MarkdownRenderProps {
    markdown: string;

    [x: string]: any; // for additional props
}

const MarkdownRender = ({className, markdown, ...props}: MarkdownRenderProps) => {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
            children={markdown}
            className={cn("whitespace-pre-wrap markdown", className)}
            components={{
                a: props => {
                    return <a {...props} className={cn("text-blue-500 underline", props.className)}/>
                }
            }}
            {...props} // pass down additional props
        />
    );
}

export default MarkdownRender;