'use client'

import {useFormContext} from "react-hook-form";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";


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