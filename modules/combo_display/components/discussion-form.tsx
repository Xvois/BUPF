import {useFormContext} from "react-hook-form";
import useSWR from "swr";
import {sbFetcher} from "@/utils/fetcher";
import {Tables} from "@/types/supabase";
import {useEffect} from "react";
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import RichTextArea from "@/components/RichTextArea";
import {CheckIcon, ExternalLink} from "lucide-react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem} from "@/components/ui/command";


export default function Discussion() {

    const form = useFormContext();
    const {data: topics} = useSWR('topics', sbFetcher<Tables<"topics">>);

    const {isSubmitting, defaultValues} = form.formState;

    useEffect(() => {
        form.setValue("type", "discussion");
        form.setValue("targetType", "topic");
    }, [])

    useEffect(() => {
        if (topics && defaultValues && topics.some(t => t.id === defaultValues.target)) {
            form.setValue("target", defaultValues.target);
        }
    }, [topics]);

    return (
        <div className="space-y-4">
            <FormField
                control={form.control}
                name={"heading"}
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Heading</FormLabel>
                        <FormControl>
                            <Input {...field} id="heading" placeholder="Enter the title of your discussion."/>
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
                            <RichTextArea {...field} id="content" className={"max-h-96 overflow-y-scroll"}
                                          placeholder={"# My discussion \n Hello there..."}/>
                        </FormControl>
                        <FormDescription>
                            Use markdown & LaTeX to format your question. Need help? Check out this <a
                            className={"underline inline-flex items-center gap-1"}
                            href={"https://ashki23.github.io/markdown-latex.html"}>markdown guide <ExternalLink
                            className={"w-3 h-3"}/></a>.
                        </FormDescription>
                        <FormMessage/>
                    </FormItem>
                )}/>
            <FormField
                control={form.control}
                name={"target"}
                render={({field}) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Topic</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        isLoading={!topics}
                                        className={cn(
                                            "w-[200px] justify-between",
                                            !field.value && "text-muted-foreground"
                                        )}
                                    >
                                        {field.value
                                            ? topics?.find(
                                                (topic) => topic.id === field.value
                                            )?.title
                                            : "Select topic"}
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                                <Command>
                                    <CommandInput
                                        placeholder="Search topic..."
                                        className="h-9"
                                    />
                                    <CommandEmpty>No framework found.</CommandEmpty>
                                    <CommandGroup>
                                        {topics?.map((topic) => (
                                            <CommandItem
                                                value={topic.id}
                                                key={topic.id}
                                                onSelect={() => {
                                                    form.setValue("target", topic.id)
                                                }}
                                            >
                                                {topic.title}
                                                <CheckIcon
                                                    className={cn(
                                                        "ml-auto h-4 w-4",
                                                        topic.id === field.value
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        <FormDescription>
                            This designates which topic your discussion will be posted in.
                        </FormDescription>
                        <FormMessage/>
                    </FormItem>
                )}
            />
            <Button isLoading={isSubmitting} size="lg" type={"submit"}>Submit</Button>
        </div>
    )

}
