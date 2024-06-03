import LoginForm from "@/app/login/_components/login-form";
import Link from "next/link";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";


export default function Login() {


	return (
		<div className={"m-auto w-full max-w-sm space-y-4 z-10"}>
			<Card className={""}>
				<CardHeader>
					<CardTitle>BUPF</CardTitle>
					<CardDescription>
						The Bath University Physics Forum
					</CardDescription>
				</CardHeader>
				<CardContent>
					<LoginForm/>
				</CardContent>
			</Card>
			<div className={"inline-flex w-full space-x-2 justify-center p-4 border rounded-md"}>
				<p>Don&apos;t have an account?</p>
				<Link href={"/signup"}
					  className={"inline-flex space-x-1 items-center justify-center underline"}>
					Sign up
				</Link>
			</div>
		</div>
	);
}
