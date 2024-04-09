import SignupForm from "@/app/signup/signup-form";
import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import {z} from "zod"
import {formSchema} from "@/app/signup/formSchema";
import {headers} from "next/headers";

export default async function Page() {

    async function signUp(formData: z.infer<typeof formSchema>) {
        'use server'
        const supabase = createClient()
        const origin = headers().get("origin");

        console.log({
            email: formData.email,
            password: formData.password,
            options: {
                emailRedirectTo: `${origin}/auth/callback`,
                data: {
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    // selects use string values
                    course: +formData.course,
                    year: formData.yearOfStudy
                }
            }

        })

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
                    year: formData.yearOfStudy
                }
            }
        }

        const {error} = await supabase.auth.signUp(data)
        if(error) {
            return redirect('/signup?error=' + error.message)
        }

        redirect('/')
    }

    return (
        <div className="w-full max-w-screen-sm rounded-xl space-y-8 p-8 border mx-auto my-auto">
            <div>
                <h1 className={"text-3xl font-bold"}>BUPF</h1>
                <p>The Bath University Physics Forum</p>
            </div>
            <SignupForm {...{signUp}} />
        </div>
    )
}