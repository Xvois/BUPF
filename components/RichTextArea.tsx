import React, {forwardRef} from 'react';
import {Textarea, TextareaProps} from "@/components/ui/textarea";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import MarkdownRender from "@/components/MarkdownRender/MarkdownRender";
import {cn} from "@/utils/cn";

interface RichTextAreaProps extends TextareaProps {
    id: string;
    value: string;
}


/**
 * A controlled textarea component that allows the user to write markdown and preview it.
 *
 * @param {RichTextAreaProps & React.RefAttributes<HTMLTextAreaElement>} props - The props of the textarea
 * @returns {JSX.Element} The RichTextArea component
 */
const RichTextArea = forwardRef<HTMLTextAreaElement, RichTextAreaProps>(({className, value, ...props}, ref) => {

    return (
        <Tabs defaultValue={"write"}>
            <TabsList>
                <TabsTrigger value={"write"}>Write</TabsTrigger>
                <TabsTrigger value={"preview"}>Preview</TabsTrigger>
            </TabsList>
            <TabsContent value={"write"}>
                <Textarea ref={ref} className={cn("whitespace-pre-wrap", className)} value={value} {...props}/>
            </TabsContent>
            <TabsContent value={"preview"}>
                <MarkdownRender
                    className={
                        cn("w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                            className)}
				>{value}</MarkdownRender>
            </TabsContent>
        </Tabs>
    )
})

RichTextArea.displayName = "RichTextArea";

export default RichTextArea;