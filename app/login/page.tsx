import LoginForm from "@/app/login/login-form";
import Link from "next/link";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

const quotes = [
	{
		quote: "God does not play dice with the universe",
		subtext: "- Albert Einstein, on quantum mechanics"
	},
	{
		quote: "Science is the belief in the ignorance of experts",
		subtext: "- Richard Feynman"
	},
	{
		quote: "The most incomprehensible thing about the universe is that it is comprehensible",
		subtext: "- Albert Einstein"
	},
	{
		quote: "I think I can safely say that nobody understands quantum mechanics",
		subtext: "- Richard Feynman"
	},
	{
		quote: "The universe is under no obligation to make sense to you",
		subtext: "- Neil deGrasse Tyson"
	},
	{
		quote: "The good thing about science is that it's true whether or not you believe in it",
		subtext: "- Neil deGrasse Tyson"
	},
	{
		quote: "The first principle is that you must not fool yourself, and you are the easiest person to fool",
		subtext: "- Richard Feynman"
	},
	{
		quote: "Now I am become Death, the destroyer of worlds",
		subtext: "- J. Robert Oppenheimer, quoting the Bhagavad Gita"
	},
]

export default function Login() {

	const quote = quotes[Math.floor(Math.random() * quotes.length)];

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
				<p>Don't have an account?</p>
				<Link href={"/signup"}
					  className={"inline-flex space-x-1 items-center justify-center"}>
					Sign up
				</Link>
			</div>
		</div>
	);
}
