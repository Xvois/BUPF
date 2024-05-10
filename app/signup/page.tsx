export const dynamic = 'force-static';

import SignupForm from "@/app/signup/signup-form";
import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import {z} from "zod";
import {formSchema} from "@/app/signup/formSchema";
import {headers} from "next/headers";
import {Separator} from "@/components/ui/separator";
import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

export default function Page() {


    async function signUp(formData: z.infer<typeof formSchema>) {
        "use server";
        const supabase = createClient();
        const origin = headers().get("origin");
        const date = formData.yearOfStudy
            ? new Date(formData.yearOfStudy, 9, 1, 12, 0, 0, 0)
            : null;

        const data = {
            email: formData.email,
            password: formData.password,
            options: {
                emailRedirectTo: `${origin}/auth/callback`,
                data: {
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    // selects use string values
                    course: +formData.course,
                    entry_date: date,
                },
            },
        };

        const {error} = await supabase.auth.signUp(data);
        if (error) {
            return redirect("/signup?error=" + error.message);
        }

        return redirect(
            "/auth/confirm?email=" +
            formData.email +
            "&sent_at=" +
            new Date().toISOString(),
        );
    }

    return (
        <Card
            className="w-full max-w-screen-sm rounded-xl space-y-8 p-8 mx-auto bg-popover sm:my-auto sm:shadow sm:border">
            <CardHeader className={"p-0"}>
                <CardTitle>BUPF</CardTitle>
                <CardDescription>The Bath University Physics Forum</CardDescription>
            </CardHeader>
            <Separator/>
            <SignupForm {...{signUp}} />
        </Card>
    );
}
