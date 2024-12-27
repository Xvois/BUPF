import {useFormContext} from "react-hook-form";
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Checkbox} from "@/components/ui/checkbox";
import {Label} from "@/components/ui/label";

/**
 * A form component that takes in the first name, last name and email of the user.
 *
 * **It must be used within a Form component with *firstName*, *lastName*, *email* and *roundup* fields.**
 *
 * @example
 * ```tsx
 *
 * const form = useForm({
 *   resolver: zodResolver(formSchema),
 *   defaultValues: {
 *   firstName: "",
 *   lastName: "",
 *   email: "",
 *   roundup: true
 *   },
 *   reValidateMode: "onChange"
 *   });
 *
 * return (
 *  <Form {...form}>
 *      <form>
 *          <UserDetailsInputs/>
 *          <SubmitButton/>
 *      </form>
 *  </Form>
 *  )
 *  ```
 * @constructor
 */
const UserDetailsInputs = () => {

    const form = useFormContext()

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
                        <FormLabel>University Email</FormLabel>
                        <FormControl>
                            <Input type={"email"} {...field} />
                        </FormControl>
                        <FormDescription>Your university provided email address.</FormDescription>
                        <FormMessage/>
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="roundup"
                render={({field}) => (
                    <FormItem className={"w-full"}>
                        <FormControl>
                            <div className="flex items-center space-x-2">
                                <Checkbox checked={field.value} onCheckedChange={(e) => form.setValue(field.name, e)} />
                                <Label {...field} >Receive weekly roundup emails</Label>
                            </div>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
            />
        </>
    )
}

export default UserDetailsInputs;