import {useFormContext} from "react-hook-form";
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";


export default function ResourceForm() {
    const form = useFormContext();

    const {isSubmitting} = form.formState;

    return (
        <div className="space-y-4">
            <FormField
                control={form.control}
                name={"title"}
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                            <Input {...field} id="title" placeholder="Simple name of resource"/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}/>
            <FormField
                control={form.control}
                name={"url"}
                render={({field}) => (
                    <FormItem>
                        <FormLabel>URL</FormLabel>
                        <FormControl>
                            <Input {...field} type={"url"} id="url" placeholder="https://www.example.com"/>
                        </FormControl>
                        <FormDescription>
                            A link to the resource, if it is available online.
                        </FormDescription>
                        <FormMessage/>
                    </FormItem>
                )}/>
            <FormField
                control={form.control}
                name={"description"}
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Input {...field} id="description" placeholder="Contains details about..."/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}/>
            <Button size="lg" type={"submit"} isLoading={isSubmitting} variant={"default"}>Submit</Button>
        </div>
    )

}