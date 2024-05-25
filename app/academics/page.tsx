import React from "react";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {CheckCircle, CircleSlash, Component, MessageSquareText, User} from "lucide-react";
import MarkdownRender from "@/components/MarkdownRender/MarkdownRender";
import {Badge} from "@/components/ui/badge";

export default function Page() {
	return (
		<div className={"space-y-8 w-full"}>
			<header className={"text-center overflow-hidden pt-8 px-8"}>
				<div className={"relative flex flex-col h-96 items-center align-middle justify-center space-y-8"}>
					<div>
						<h1 className={"font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl"}>
							Understand your students
						</h1>
						<p className={"text-muted-foreground"}>
							For academics, the Bath University Physics Forum provides a platform to
							identify where students struggle in their modules.
						</p>
					</div>
					<Button disabled>
						Join now
					</Button>
					<p className={"underline"}>
						Coming soon
					</p>
				</div>
			</header>
			<Separator/>
			<div className={"flex flex-row flex-wrap justify-evenly gap-4 border-b"}>
				<section className={"p-6 space-y-8 h-full w-[786px]"}>
					<div>
						<h2 className={"font-black text-xl sm:text-2xl md:text-3xl lg:text-4xl"}>
							Ditch Excel & Moodle
						</h2>
						<p>With the platform built by students, for students, you can now understand your
							students&apos; better than before. No more poorly formatted Excel sheets or Moodle
							forums.</p>
					</div>
					<div className={"grid grid-cols-1 md:grid-cols-2 gap-4"}>
						<Card className={"md:col-span-2 border bg-gradient-to-br from-background to-green-500/10"}>
							<CardHeader>
								<CardTitle className={"inline-flex gap-2"}>
									BUPF <CheckCircle className={"text-green-500"}/>
								</CardTitle>
								<CardDescription>
									Built for UoB physics students.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className={"list-disc list-inside"}>
									<li>Easy to manage</li>
									<li>User-friendly</li>
									<li>Notifications of engagement</li>
								</ul>
							</CardContent>
						</Card>
						<Card className={"opacity-60"}>
							<CardHeader>
								<CardTitle className={"inline-flex gap-2"}>
									Excel <CircleSlash className={"text-red-500"}/>
								</CardTitle>
							</CardHeader>
							<CardContent>
								<ul className={"list-disc list-inside"}>
									<li>Difficult to manage</li>
									<li>Not user-friendly</li>
								</ul>
							</CardContent>
						</Card>
						<Card className={"opacity-60"}>
							<CardHeader>
								<CardTitle className={"inline-flex gap-2"}>
									Moodle <CircleSlash className={"text-red-500"}/>
								</CardTitle>
							</CardHeader>
							<CardContent>
								<ul className={"list-disc list-inside"}>
									<li>Hard for students to engage with</li>
									<li>Lack of mathematical notation</li>
									<li>No notifications of engagement</li>
								</ul>
							</CardContent>
						</Card>
					</div>
				</section>
				<section className={"p-6 space-y-8 h-full w-[786px]"}>
					<div>
						<h2 className={"font-black text-xl sm:text-2xl md:text-3xl lg:text-4xl"}>
							Identify where students struggle
						</h2>
						<p>
							From their forum posts and comments, you can see where students are struggling in their
							modules, and provide the necessary support in a public environment.
						</p>
					</div>
					<div className={"p-4 border rounded-md bg-gradient-to-br from-muted/0 to-muted/50"}>
						<div>
							<p className={"text-sm"}>Anonymous</p>
							<p>But how can I apply Gauss&apos;s Law to this scenario?</p>
						</div>
						<div className={"pl-4 mt-2 border-l"}>
							<p className={"text-sm"}>You</p>
							<MarkdownRender markdown={"Using a Gaussian surface, $\\vec{E} \\cdot d\\vec{A}$ is the" +
								" flux through the surface, which is equal to the charge enclosed by the surface" +
								" divided by $\\epsilon_0$. \n If we choose a surface symmetric to the field then" +
								" $\\vec{E}$ becomes constant."}/>
						</div>
					</div>
					<div className={"p-4 border rounded-md bg-gradient-to-br from-muted/0 to-muted/50"}>
						<div>
							<p className={"text-sm"}>Anonymous</p>
							<MarkdownRender markdown={"What's the interval of convergence for the series $u = -" +
								" \\frac{1}{5}x + \\frac{2}{25}x^2 - \\frac{3}{125}x^3 + \\frac{4}{625}x^4 - \\ldots$?"}/>
						</div>
						<div className={"pl-4 mt-2 border-l"}>
							<p className={"text-sm"}>You</p>
							<MarkdownRender markdown={"Try using the D'Alembert ratio test. We went through this in" +
								" lecture 3, and its available [here](#) in the course test."}/>
						</div>
					</div>
				</section>
				<section className={"p-6 space-y-8 h-full w-[786px]"}>
					<div>
						<h2 className={"font-black text-xl sm:text-2xl md:text-3xl lg:text-4xl"}>
							Easily manage your modules
						</h2>
						<p>
							With a simple interface, you can easily manage your modules and track engagement.
						</p>
					</div>
					<div className={"space-y-2"}>
						{
							FauxModules.map((module, index) => <ModuleDisplay key={index} title={module.title}
																			  tags={module.tags}/>)
						}
					</div>

				</section>
			</div>
		</div>
	)
}

const FauxModules = [
	{
		title: "PH12002: Foundations of Physics 1",
		tags: ["Thermodynamics", "QM"]
	},
	{
		title: "PH12003: Mathematics for Physics 1",
		tags: ["ODEs", "Differentiation"]
	},
	{
		title: "PH12005: Dynamics and Relativity",
		tags: ["Mechanics", "Relativity"]
	}
]

const ModuleDisplay = (props: { title: string, tags: string[] }) => {
	return (
		<div className={"p-4 border rounded-md bg-gradient-to-br from-muted/0 to-muted/50"}>
			<div>
				<p className={"flex flex-row text-sm text-muted-foreground"}>Module <Component
					className={"h-3 w-3"}/></p>
				<p className={"font-bold"}>{props.title}</p>
			</div>
			<div className={"inline-flex gap-2 align-middle items-center"}>
				<p className={"font-semibold text-sm"}>You teach:</p>
				<div className={"flex flex-row gap-2"}>
					{
						props.tags.map((tag, index) => <Badge key={index} variant={"outline"}>{tag}</Badge>)
					}
				</div>
			</div>
			<div className={"flex flex-row gap-2 mt-2"}>
				<div className={"inline-flex gap-1 align-middle items-center"}>
					<p className={"text-xs"}>54</p>
					<User className={"h-3 w-3"}/>
				</div>
				<div className={"inline-flex gap-1 align-middle items-center"}>
					<p className={"text-xs"}>102</p>
					<MessageSquareText className={"h-3 w-3"}/>
				</div>
			</div>
		</div>
	)
}