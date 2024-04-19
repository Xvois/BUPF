import {useFormContext} from "react-hook-form";
import {z} from "zod";
import {formSchema} from "@/app/signup/formSchema";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import React from "react";


const PasswordConfirmation = () => {
    const form = useFormContext<z.infer<typeof formSchema>>();
    return (<>
        <FormField
            control={form.control}
            name="password"
            render={({field}) => (
                <FormItem className={"w-full"}>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                        <Input type={"password"} {...field} />
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
                        <Input type={"password"} {...field} />
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
        />
    </>)
}

export default PasswordConfirmation;