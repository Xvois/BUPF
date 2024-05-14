import {Button} from "@/components/ui/button";
import LoginForm from "@/app/login/login-form";
import {Separator} from "@/components/ui/separator";
import Link from "next/link";
import {CircleHelp} from "lucide-react";
import DynamicIconGrid from "@/components/DynamicIconGrid/DynamicIconGrid";

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
		<div className={"flex flex-row w-full h-svh"}>
			<div className={"w-full absolute top-0 left-0 sm:relative sm:w-2/3 md:w-5/6"}>
				<div className={"flex h-full items-center align-middle justify-center"}>
					<div
						className={"text-center h-fit w-fit p-12 max-w-screen-xl border rounded-md backdrop-blur-sm shadow-md m-auto hidden md:flex md:flex-col"}>
						<h1 className={"font-black text-5xl"}>
							"{quote.quote}"
						</h1>
						<p className={"text-muted-foreground"}>
							{quote.subtext}
						</p>
					</div>
					<div className={"absolute top-0 left-0 w-full h-full opacity-15 z-[-1]"}>
						<DynamicIconGrid allowEngagement={false}/>
					</div>
				</div>

			</div>
			<div
				className={"space-y-4 my-auto w-full h-fit p-8 shadow-2xl md:border-l sm:w-1/3 md:w-1/6 md:h-full"}>
				<h2 className={"font-bold text-4xl"}>BUPF</h2>
                <p>
                    The Bath University Physics Forum
                </p>
                <Separator/>
                <LoginForm/>
                <Separator/>
				<Button variant={"secondary"} className={"w-full"} asChild>
					<Link href={"/signup"}
						  className={"inline-flex space-x-1 items-center justify-center"}>
						Sign up
					</Link>
				</Button>
				<Button variant={"outline"} className={"w-full"} asChild>
                    <a href={"mailto:smp90@bath.ac.uk?subject=BUPF%20Help"}
                       className={"inline-flex space-x-1 items-center justify-center"}>
                        <p>I need help</p>
                        <CircleHelp className={"h-4 w-4"}/>
                    </a>
                </Button>
            </div>
        </div>

    )
        ;
}
