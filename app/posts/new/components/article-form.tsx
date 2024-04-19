import {useFormContext} from "react-hook-form";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import RichTextArea from "@/components/RichTextArea";
import {Button} from "@/components/ui/button";
import React from "react";


export default function Article() {
    const form = useFormContext();

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Write an article</CardTitle>
                <CardDescription>Write an article to share with your peers and lecturers.</CardDescription>
            </CardHeader>
            <CardContent>
                <FormField
                    control={form.control}
                    name={"heading"}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Heading</FormLabel>
                            <FormControl>
                                <Input {...field} id="heading" placeholder="Enter the title of your article."/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                <FormField
                    control={form.control}
                    name={"content"}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                                <RichTextArea {...field} id="content" placeholder="Enter the content of your article."/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
            </CardContent>
            <CardFooter>
                <Button size="lg" type={"submit"}>Submit</Button>
            </CardFooter>
        </Card>
    )
}
