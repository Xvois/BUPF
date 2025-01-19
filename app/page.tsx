import {Atom, MessageCircle, Lightbulb, ArrowRight, Book} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link";

export default function LandingPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden px-4 pt-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                        <div className="sm:text-center lg:col-span-6 lg:text-left">
                            <h1 className="text-4xl font-bold tracking-tight  sm:text-5xl md:text-6xl">
                                <span className="block text-muted-foreground">Your Physics Community</span>
                                <span className="block font-black">At Bath</span>
                            </h1>
                            <p className="mt-6 text-base text-muted-foreground sm:text-lg md:text-xl">
                                Connect with fellow physics students at Bath. Share notes, discuss concepts,
                                and help each other succeed in your physics courses.
                            </p>
                            <div className="mt-8 sm:flex sm:justify-center lg:justify-start">
                                <Button size="lg" className="w-full sm:w-auto" asChild>
                                    <Link href={"signup"}>
                                        Join the Discussion
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                        <div className="relative mt-12 lg:col-span-6 lg:mt-0">
                            <div className="relative mx-auto w-full max-w-md px-4 sm:max-w-2xl">
                                <div className="absolute right-0 top-0 -translate-y-12 translate-x-12">
                                    <Atom className="h-48 w-48 text-primary/10" strokeWidth={1} />
                                </div>
                                <div className="absolute left-0 bottom-0 translate-y-12 -translate-x-12">
                                    <Atom className="h-48 w-48 text-primary/10" strokeWidth={1} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="mx-auto mt-32 max-w-7xl px-4 sm:mt-40 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight  sm:text-4xl">
                        Study smarter together
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Our student-run forum is the perfect place to collaborate with your classmates.
                    </p>
                </div>
                <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardContent className="flex flex-col items-center p-6">
                            <div className="rounded-full bg-primary/10 p-3">
                                <MessageCircle className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="mt-4 text-lg font-medium">Course Discussions</h3>
                            <p className="mt-2 text-center text-muted-foreground">
                                Ask questions and share insights about your current physics courses
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex flex-col items-center p-6">
                            <div className="rounded-full bg-primary/10 p-3">
                                <Lightbulb className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="mt-4 text-lg font-medium">Homework Help</h3>
                            <p className="mt-2 text-center text-muted-foreground">
                                Work through problem sets and assignments with your peers
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex flex-col items-center p-6">
                            <div className="rounded-full bg-primary/10 p-3">
                                <Book className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="mt-4 text-lg font-medium">Articles</h3>
                            <p className="mt-2 text-center text-muted-foreground">
                                Read and write articles about physics concepts and topics
                            </p>
                        </CardContent>
                    </Card>

                </div>
            </section>

            {/* CTA Section */}
            <section className="mx-auto mt-32 max-w-7xl px-4 sm:mt-40 sm:px-6 lg:px-8">
                <div className="relative isolate overflow-hidden bg-secondary-foreground px-6 py-24 shadow-2xl sm:rounded-3xl sm:px-24">
                    <div className="absolute -top-12 -right-12 -z-10">
                        <Atom className="h-64 w-64 text-background/10" strokeWidth={1} />
                    </div>
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-primary-foreground/90">
                            Join your classmates today
                        </h2>
                        <p className="mx-auto mt-6 max-w-xl text-lg text-primary-foreground/90">
                            Start collaborating with other physics students from our Bath and improve together.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Button size="lg" variant="secondary" asChild>
                                <Link href={"/signup"}>
                                    Create an Account
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    )
}

