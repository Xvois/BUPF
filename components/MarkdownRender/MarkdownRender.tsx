'use client'

import ReactMarkdown from 'react-markdown';
import 'katex/dist/katex.min.css'
import "./markdown.css"
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import {cn} from "@/utils/cn";
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {oneDark as dark, oneLight as light} from 'react-syntax-highlighter/dist/esm/styles/prism';
import {useMediaQuery} from "@/hooks/use-media-query";

interface MarkdownRenderProps {
    id?: string;
    className?: string;
    children: string;

    [x: string]: unknown; // for additional props
}

/**
 * A markdown renderer that uses KaTeX for math rendering and Prism for code highlighting.
 */
export default function MarkdownRender({className, children, ...props}: MarkdownRenderProps) {

    const isDark = useMediaQuery('(prefers-color-scheme: dark)');

    return (
        <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
            className={cn("markdown", className)}
            components={{
                a: props => {
                    return <a {...props} className={cn("text-blue-500 underline", props.className)}/>
                },
                code({className, children}) {
                    const match = /language-(\w+)/.exec(className || '');
                    return match ? (
                        <SyntaxHighlighter
                            children={String(children).replace(/\n$/, '')}
                            style={isDark ? dark : light}
                            language={match[1]}
                            PreTag="div"
                            customStyle={{background: 'none'}}
                            codeTagProps={{style: {background: 'none'}}}
                            wrapLines={true}
                            wrapLongLines={true}
                            className={className}
                        />
                    ) : (
                        <SyntaxHighlighter
                            children={String(children).replace(/\n$/, '')}
                            style={isDark ? dark : light}
                            language={undefined}
                            PreTag="div"
                            customStyle={{background: 'none'}}
                            codeTagProps={{style: {background: 'none'}}}
                            wrapLongLines={true}
                            className={className}
                        />
                    )
                }
            }}
            {...props} // pass down additional props
        >
            {children}
        </ReactMarkdown>
    );
}