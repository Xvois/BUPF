import {useFormContext} from "react-hook-form";
import {z} from "zod";
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";


const UserDetailsInputs = ({formSchema}: { formSchema: z.ZodEffects<any> }) => {

    const form = useFormContext<z.infer<typeof formSchema>>()

    return (
        <>
            <div className={"inline-flex flex-row gap-4"}>
                <FormField
                    control={form.control}
                    name="firstName"
                    render={({field}) => (
                        <FormItem className={"w-full"}>
                            <FormLabel>First name</FormLabel>
                            <FormControl>
                                <Input type={"text"} {...field} />
                            </FormControl>
                            <FormDescription>Your chosen first name.</FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="lastName"
                    render={({field}) => (
                        <FormItem className={"w-full"}>
                            <FormLabel>Last name</FormLabel>
                            <FormControl>
                                <Input type={"text"} {...field} />
                            </FormControl>
                            <FormDescription>Your chosen last name.</FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
            </div>
            <FormField
                control={form.control}
                name="email"
                render={({field}) => (
                    <FormItem className={"w-full"}>
                        <FormLabel>Personal Email</FormLabel>
                        <FormControl>
                            <Input type={"email"} {...field} />
                        </FormControl>
                        <FormDescription>Your personal email address; @bath.ac.uk emails do not work at this
                            time.</FormDescription>
                        <FormMessage/>
                    </FormItem>
                )}
            />

        </>
    )
}

export default UserDetailsInputs;