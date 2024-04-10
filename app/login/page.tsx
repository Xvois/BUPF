import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import LoginForm from "@/app/login/login-form";
import {Separator} from "@/components/ui/separator";
import Link from "next/link";

export default function Login() {
    const signIn = async (props: { email: string, password: string }) => {
        "use server";
        const {email, password} = props;

        const supabase = createClient();

        const {error} = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return redirect("/login?error=" + error.message)
        }

        return redirect("/");
    };

    return (
        <div className="w-96 rounded-xl border p-8 mx-auto my-auto space-y-8">
            <div>
                <h1 className={"text-3xl font-bold"}>BUPF</h1>
                <p>The Bath University Physics Forum</p>
            </div>
            <LoginForm {...{signIn}} />
            <Separator/>
            <div className={"inline-flex gap-2 text-sm text-muted-foreground"}>
                <p className={"text-center"}>Don't have an account?</p>
                <Link className={"underline"} href={"/signup"}>Sign up</Link>
            </div>
        </div>
    );
}
