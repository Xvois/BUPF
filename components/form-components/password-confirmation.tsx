'use client'

import {useFormContext} from "react-hook-form";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";

/**
 * A form component that takes in the password and password confirmation of the user.
 *
 * **It must be used within a Form component with *password* and *confirmPassword* fields.**
 *
 * @example
 * ```tsx
 *
 * const form = useForm({
 *   resolver: zodResolver(formSchema),
 *   defaultValues: {
 *   password: "",
 *   confirmPassword: ""
 *   },
 *   reValidateMode: "onChange"
 *   });
 *
 * return (
 *    <Form {...form}>
 *        <form>
 *            <PasswordConfirmation/>
 *            <SubmitButton/>
 *        </form>
 *    </Form>
 *    )
 *
 * @constructor
 */
const PasswordConfirmation = () => {
    const form = useFormContext();
    return (<>
        <FormField
            control={form.control}
            name="password"
            render={({field}) => (
                <FormItem className={"w-full"}>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                        <Input autoComplete={"new-password"} type={"password"} {...field} />
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="confirmPassword"
            render={({field}) => (
                <FormItem className={"w-full"}>
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                        <Input autoComplete={"new-password"} type={"password"} {...field} />
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
        />
    </>)
}

export default PasswordConfirmation;