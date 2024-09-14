import SignupForm from "@/app/signup/_components/signup-form";
import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import {z} from "zod";
import {formSchema} from "@/app/signup/_schema/formSchema";
import {headers} from "next/headers";
import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

export default function Page() {

    async function signUp(formData: z.infer<typeof formSchema>) {
        "use server";
        const supabase = createClient();

        // They are logged in
        const {data: {user}} = await supabase.auth.getUser();
        if (user) {
            return redirect("/home");
        }

        const origin = headers().get("origin");

        const enrollmentQuery = supabase.from("course_years").select("course_year_id").eq("course_id", formData.course);

        // They have a year (not an academic / other)
        if (formData.year) {
            enrollmentQuery.eq("year_number", formData.year);
        }

        const {data: enrollmentID} = await enrollmentQuery.single();

        const data = {
                email: formData.email,
                password: formData.password,
                options: {
                    emailRedirectTo: `${origin}/auth/callback`,
                    /*
                    This data is used in the "handle_new_user" database function,
                    which is triggered when a new user is created.

                    Consult the supabase dashboard for more information.
                     */
                    data: {
                        first_name: formData.firstName,
                        last_name: formData.lastName,
                        course_year_id: enrollmentID,
                        enrolled_at: new Date().toISOString(),
                    },
                },
            }
        ;

        if (!data.email.endsWith("@bath.ac.uk")) {
            return redirect("/signup?error=Please use a bath.ac.uk email address");
        }

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
            <SignupForm signUp={signUp}/>
        </Card>
    );
}
