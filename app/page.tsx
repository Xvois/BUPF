import {Separator} from "@/components/ui/separator";
import React, {Fragment} from "react";
import {BookPlus, CircleFadingPlus, Component, NotebookPen} from "lucide-react";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import DynamicIconGrid from "@/components/DynamicIconGrid/DynamicIconGrid";
import {createClient} from "@/utils/supabase/server";
import CoursesShowcase from "@/components/CoursesShowcase/CoursesShowcase";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import MarkdownRender from "@/components/MarkdownRender/MarkdownRender";
import {cn} from "@/utils/cn";

export default async function Landing() {

	const supabase = createClient();
	const {data: {user}} = await supabase.auth.getUser();
	if (!user) {
		await supabase.auth.signInAnonymously();
	}

	return (
		<div className={"space-y-8 w-full"}>
			<header className={"text-center overflow-hidden pt-8 px-8"}>
				<div className={"relative flex flex-col h-96 items-center align-middle justify-center space-y-8"}>
					<div className={"absolute left-0 top-0 w-full h-full opacity-15 z-[-1]"}>
						<DynamicIconGrid/>
					</div>
					<div>
						<h1 className={"font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl"}>
							For students, By students
						</h1>
						<p className={"text-muted-foreground"}>
							The Bath University Physics Forum is the student run forum for all things physics at the
							University
							of Bath.
						</p>
					</div>
					<div className={"inline-flex flex-row gap-4 mx-auto"}>
						{
							user ?
								<Button asChild>
									<Link href={"/home"}>
										Go to dashboard
									</Link>
								</Button>
								:
								<Fragment>
									<Button variant={"outline"} asChild>
										<Link href={"/academics"}>
											I am an academic
										</Link>
									</Button>
									<Button asChild>
										<Link href={"/login"}>
											Join now
										</Link>
									</Button>
								</Fragment>
						}
					</div>
					<Button variant={"link"} asChild>
						<a href={"https://github.com/Xvois/BUPF"}>See the source</a>
					</Button>
				</div>
			</header>
			<Separator/>
			<div className={"grid grid-cols-1 lg:grid-cols-2"}>
				<section className={"p-6 space-y-8 h-full"}>
					<div className={"min-h-32 border-b"}>
						<h2 className={"inline-flex font-black text-xl sm:text-2xl md:text-3xl lg:text-4xl"}>
							Your modules <Component/>
						</h2>
						<p>
							All you need to do is select your course and your modules will automatically be updated,
							allowing you
							to interact with other students and academics taking the same modules as you.
						</p>
					</div>
					<CoursesShowcase/>
				</section>
				<section className={"flex flex-col p-6 space-y-8 w-fit ml-auto"}>
					<div className={"min-h-32 border-b text-right"}>
						<h2 className={"font-black text-xl sm:text-2xl md:text-3xl lg:text-4xl"}>
							Tailor your posts
						</h2>
						<p>
							The Bath University Physics Forum is a place where you can ask questions, read articles and
							spark
							discussions about physics topics that matter to you.
						</p>
					</div>
					<div className={"flex flex-row gap-8 flex-wrap"}>
						<Card className={"flex-grow w-96 flex flex-col hover:bg-gradient-to-br" +
							" hover:from-muted/10 hover:to-muted/20"}>
							<CardHeader>
								<CardTitle className={"inline-flex"}>
									Articles
									<NotebookPen className={"h-4 w-4"}/>
								</CardTitle>
								<CardDescription>
									Read articles written by students and staff at the University of Bath.
								</CardDescription>
							</CardHeader>
							<CardContent className={"flex-grow"}>
								The forum provides a platform for students and academics to write articles about physics
								topics that interest them, and engage in meaningful discussions.
							</CardContent>
							<Separator className={"mb-6"}/>
							<CardFooter className={"text-muted"}>
								Read articles ->
							</CardFooter>
						</Card>
						<Card className={"flex-grow w-96 flex flex-col hover:bg-gradient-to-br" +
							" hover:from-muted/10 hover:to-muted/20"}>
							<CardHeader>
								<CardTitle className={"inline-flex"}>
									Questions
									<CircleFadingPlus className={"h-4 w-4"}/>
								</CardTitle>
								<CardDescription>
									Ask questions and get answers from a community of students and academics.
								</CardDescription>
							</CardHeader>
							<CardContent className={"flex-grow"}>
								Ask questions about problem sheets, lectures, or anything else physics related in
								the module relevant. Easily find answers for common questions and pool together
								knowledge to solve problems.
							</CardContent>
							<Separator className={"mb-6"}/>
							<CardFooter>
								Ask a question ->
							</CardFooter>
						</Card>
						<Card className={"flex-grow w-96 flex flex-col hover:bg-gradient-to-br" +
							" hover:from-muted/10 hover:to-muted/20"}>
							<CardHeader>
								<CardTitle className={"inline-flex"}>
									Discussions
									<BookPlus className={"h-4 w-4"}/>
								</CardTitle>
								<CardDescription>
									Spark discussion about physics topics that matter to you.
								</CardDescription>
							</CardHeader>
							<CardContent className={"flex-grow"}>
								Engage in discussions about physics topics that interest you, and share your
								knowledge with others.
							</CardContent>
							<Separator className={"mb-6"}/>
							<CardFooter>
								Start a discussion ->
							</CardFooter>
						</Card>
					</div>
				</section>
			</div>
			<Separator/>
			<section className={"p-6"}>
				<div className={"mx-auto max-w-screen-sm text-center"}>
					<h2 className={"font-black text-xl sm:text-2xl md:text-3xl lg:text-4xl"}>
						Write <span className={"bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400" +
						" inline-block text-transparent bg-clip-text"}>meaningful</span> contributions
					</h2>
					<p>
						BUPF allows you to write using Markdown and LaTeX, meaning you can easily convey
						complex ideas and equations in your posts, without resorting to screenshots or
						text explanations.
					</p>
				</div>
				<div className={"relative hidden lg:block h-[400px] overflow-x-hidden"}>
					{
						markdownComments.map((comment, i) => (
							<FloatingComment key={i} index={i} content={comment}/>
						))
					}
				</div>
			</section>
		</div>
	)
}

const markdownComments = [
	"Does anyone known how to find $\\delta t$ for in this domain?",
	"I *think* we can use $\\oint \\vec{E} \\cdot d\\vec{A} = \\frac{Q_{\\text{enc}}}{\\varepsilon_0}$ here?",
	"Hopefully [this](https://www.bupf.co.uk/) helps!",
	"If we assume that $\\vec{E}$ is constant over the surface, so the dot product becomes a scalar product",
	"The product $\\sum \\lambda_{i}$ for $\\underline{\\underline{A}}$ turns out to be $\\text{det}" +
	" \\underline{\\underline{A}}$.",
	"How do I find the particular integral for $\\phi (x) = x \\sin{x}$?",
	"Is there a way to find the general solution to this ODE: $\\frac{d^{2}y}{dx^{2}} + 7\\frac{dy}{dx} + 1 = x$",
	"I think we can use the method of undetermined coefficients here, see [the course text](https://www.bupf.co.uk/).",
	"What relationship does $\\gamma$ have with the number of bound states?",
	"Does anyone know how to find the eigenvalues $\\lambda_{1}, \\lambda_{2}$ of $\\begin{bmatrix} 2 &" +
	" 3 \\\\ 4 & 2 \\end{bmatrix}$? Is it orthogonal?",
	"Can we use the [method of variation of parameters](https://www.bupf.co.uk/) to find the particular integral?",
	"How does Gaussian elimination work on this matrix $\\underline{\\underline{A}}$?",
	"How can I perform Bernoulli's method on this ODE: $\\frac{dy}{dx} - y = y^{2}$?",
	"Can I use the Clausius-Clapeyron equation to find the enthalpy of vaporisation?",
	"How do I transform $\\int xy dxy$ into polar coordinates?",
	"Does anyone know how to find the eigenvalues of $\\underline{\\underline{A}}$?",
	"What actually is enthalpy and how does it relate to the internal energy of a system?",
]

const FloatingComment = (props: { content: string, index: number }) => {
	const classProperties = [
		"bottom-[25%] right-[38%] scale-100 text-foreground/100 z-0",
		"bottom-[65%] right-[40%] scale-[80%] text-foreground/80 -z-20",
		"bottom-[48%] right-[10%] scale-100 text-foreground/100 z-0",
		"bottom-[0%] right-[30%] scale-[60%] text-foreground/60 -z-40",
		"bottom-[33%] right-[25%] scale-[70%] text-foreground/70 -z-30",
		"bottom-[65%] right-[14%] scale-[80%] text-foreground/80 -z-[60]",
		"bottom-[80%] right-[10%] scale-50 text-foreground/50 -z-[50]",
		"bottom-[0%] right-[65%] scale-[80%] text-foreground/80 -z-20",
		"bottom-[70%] right-[70%] scale-90 text-foreground/90 -z-10",
		"bottom-[43%] left-[25%] scale-100 text-foreground/100 z-0",
		"bottom-[20%] right-[10%] scale-50 text-foreground/50 -z-[50]",
		"bottom-[10%] right-[60%] scale-50 text-foreground/50 -z-[50]",
		"bottom-[60%] right-[70%] scale-[60%] text-foreground/60 -z-40",
		"bottom-[20%] left-[75%] scale-[80%] text-foreground/80 -z-20",
		"bottom-[75%] left-[80%] scale-[70%] text-foreground/70 -z-30",
		"bottom-[90%] left-[10%] scale-[60%] text-foreground/60 -z-40",
		"bottom-[10%] left-[0%] scale-100 text-foreground/100 z-0",

	];
	return (
		<div
			className={cn("absolute bg-background/10  border p-4 w-fit min-w-96 shrink-0 h-fit rounded-md shadow" +
				" backdrop-blur-md", classProperties[props.index])}>
			<p className={"text-sm text-muted-foreground"}>Anonymous</p>
			<MarkdownRender markdown={props.content}/>
		</div>
	)
}