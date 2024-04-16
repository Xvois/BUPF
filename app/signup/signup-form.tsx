'use client'

import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useForm, useFormContext} from "react-hook-form";
import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {formSchema} from "@/app/signup/formSchema";
import React from "react";
import {ServerError} from "@/components/ServerError";
import useSWR from "swr";
import {sbFetcher} from "@/utils/fetcher";
import {Tables} from "@/types/supabase";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {cn} from "@/lib/utils";
import {ChevronsUpDown} from "lucide-react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandSeparator
} from "@/components/ui/command";
import {useSearchParams} from "next/navigation";


export default function SignupForm(props: { signUp: (fd: z.infer<typeof formSchema>) => Promise<void> }) {

    const searchParams = useSearchParams();


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: ""
        },
        mode: "onBlur"
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        /*
        This pattern is so stupid: react-hook-form wants to invoke
        a client function and onSubmit must be used for validation.
        This leads to this mess where a server action is invoked
        through this function.
         */
        await props.signUp(values);

    }

    const pageSchema =
        [
            ["firstName", "lastName", "email"],
            ["course", "yearOfStudy"],
            ["password", "confirmPassword"]
        ]

    return (
        <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className={"flex flex-col items-end space-y-8"}>
                <MultiStageForm pageSchema={pageSchema}>
                    <UserDetailsInputs/>
                    <CourseDetailsInputs/>
                    <PasswordInputs/>
                </MultiStageForm>
            </form>
            <ServerError className={"w-full"}>
                {searchParams.get("error")}
            </ServerError>
        </Form>
    )
}

/*
Conditionally renders a form with multiple stages.
Form stages should be supplied as children.
Form context is used to manage form state, so a form
wrapper is expected.

An optional custom page schema can be supplied to
help provide more context to auth about errors
on other pages.
 */
const MultiStageForm = ({children, pageSchema}: { children: React.ReactNode[], pageSchema?: string[][] }) => {
    const [progress, setProgress] = React.useState<number>(0);

    const form = useFormContext<z.infer<typeof formSchema>>();
    if (!form) {
        throw new Error("MultiStageForm must be used within a Form component.")
    }

    const {errors, isDirty, isValid, isSubmitting} = form.formState;
    const pagesWithErrors = pageSchema
        ?.map((page, pageIndex) => page.some(field => field in errors) ? pageIndex : -1)
        .filter(index => index !== -1);

    const errorPrior = pagesWithErrors?.some(index => index < progress);
    const errorNext = pagesWithErrors?.some(index => index > progress);

    return (
        <div className={"w-full h-full space-y-8"}>
            {children[progress]}
            <div className={"inline-flex w-full justify-between"}>
                {
                    progress > 0 &&
                    <Button className={`${errorPrior && 'outline outline-destructive'}`} type={"button"}
                            variant={"secondary"} onClick={() => setProgress((val) => val - 1)}>{"<"}-
                        Back</Button>
                }
                {
                    progress < children.length - 1 &&
                    <Button className={`${errorNext && 'outline outline-destructive'}`} type={"button"}
                            onClick={() => setProgress((val) => val + 1)}>Continue
                        -{">"}</Button>
                }
                {
                    progress === children.length - 1 &&
                    <Button disabled={!isValid} isLoading={isSubmitting} type={"submit"}
                            className={"w-32"}>Submit</Button>
                }
            </div>
        </div>
    )

}

const UserDetailsInputs = () => {

    const form = useFormContext<z.infer<typeof formSchema>>()

    return (
        <>
            <div className={"inline-flex flex-row gap-4"}>
                <FormField
                    control={form.control}
                    name="firstName"
                    render={({field}) => (
                        <FormItem className={"w-full"}>
                            <FormLabel>First name</FormLabel>
                            <FormControl>
                                <Input type={"text"} {...field} />
                            </FormControl>
                            <FormDescription>Your chosen first name.</FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="lastName"
                    render={({field}) => (
                        <FormItem className={"w-full"}>
                            <FormLabel>Last name</FormLabel>
                            <FormControl>
                                <Input type={"text"} {...field} />
                            </FormControl>
                            <FormDescription>Your chosen last name.</FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
            </div>
            <FormField
                control={form.control}
                name="email"
                render={({field}) => (
                    <FormItem className={"w-full"}>
                        <FormLabel>Bath Email</FormLabel>
                        <FormControl>
                            <Input type={"email"} {...field} />
                        </FormControl>
                        <FormDescription>Your university assigned email address.</FormDescription>
                        <FormMessage/>
                    </FormItem>
                )}
            />

        </>
    )
}

const CourseDetailsInputs = () => {
    const form = useFormContext<z.infer<typeof formSchema>>()
    const {data: courses, error, isLoading} = useSWR('courses', sbFetcher<Tables<"courses">>);
    const [popoverOpen, setPopoverOpen] = React.useState<boolean>(false);
    return (
        <>
            <FormField
                control={form.control}
                name="course"
                render={({field}) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Course</FormLabel>
                        <Popover open={popoverOpen}>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        className={cn(
                                            "w-full justify-between overflow-x-clip",
                                            !field.value && "text-muted-foreground"
                                        )}
                                        onClick={() => setPopoverOpen((val) => !val)}
                                    >
                                        {field.value
                                            ? courses?.find(
                                                (course) => course.id.toString() === field.value
                                            )?.title
                                            : "Select course"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="max-w-[572px] w-screen p-0">
                                <Command className={"max-h-96 w-full overflow-y-scroll pt-12"}>
                                    <div className={"fixed z-10 bg-popover w-full rounded-md top-[1px] scale-x-[99%]"}>
                                        <CommandInput placeholder="Search courses..."/>
                                    </div>
                                    <CommandEmpty>No course found.</CommandEmpty>
                                    <CommandGroup className={"overflow-visible"} heading={"Standalone"}>
                                        {courses?.filter(course => !course.title.toLowerCase().includes('theoretical') && !course.title.toLowerCase().includes('astrophysics') && course.id !== 0).map((course) => (
                                            <CommandItem
                                                value={course.type + course.title}
                                                key={course.id}
                                                onSelect={() => {
                                                    setPopoverOpen(false);
                                                    form.setValue("course", course.id.toString());
                                                }}
                                            >
                                                <p>{course.title} <span
                                                    className={"text-xs text-muted-foreground"}>{course.type}</span></p>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                    <CommandSeparator/>
                                    <CommandGroup className={"overflow-visible"} heading={"With Astrophysics"}>
                                        {courses?.filter(course => course.title.toLowerCase().includes('astrophysics') && course.id !== 0).map((course) => (
                                            <CommandItem
                                                value={course.type + course.title}
                                                key={course.id}
                                                onSelect={() => {
                                                    form.setValue("course", course.id.toString())
                                                }}
                                            >
                                                <p>{course.title} <span
                                                    className={"text-xs text-muted-foreground"}>{course.type}</span></p>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                    <CommandSeparator/>
                                    <CommandGroup className={"overflow-visible"} heading={"With Theoretical"}>
                                        {courses?.filter(course => course.title.toLowerCase().includes('theoretical') && course.id !== 0).map((course) => (
                                            <CommandItem
                                                value={course.type + course.title}
                                                key={course.id}
                                                onSelect={() => {
                                                    form.setValue("course", course.id.toString())
                                                }}
                                            >
                                                <p>{course.title} <span
                                                    className={"text-xs text-muted-foreground"}>{course.type}</span></p>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        <FormDescription>
                            Your enrolled course. This will affect what modules are available to you.
                            Not a physics student? Choose <Button variant={"link"} type={"button"}
                                                                  onClick={() => form.setValue("course", "0")}
                                                                  className={"underline p-0 text-muted-foreground h-fit"}>Other</Button>.
                        </FormDescription>
                        <FormMessage/>
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="yearOfStudy"
                render={({field}) => (
                    <FormItem className={"w-full"}>
                        <FormLabel>
                            Start of studies
                        </FormLabel>
                        <FormControl>
                            <Input type={"number"} {...field} />
                        </FormControl>
                        <FormDescription>The year your studies started. Not a student? You can ignore this field.</FormDescription>
                        <FormMessage/>
                    </FormItem>
                )}
            />
        </>
    )
}

const PasswordInputs = () => {
    const form = useFormContext<z.infer<typeof formSchema>>();
    return (<>
        <FormField
            control={form.control}
            name="password"
            render={({field}) => (
                <FormItem className={"w-full"}>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                        <Input type={"password"} {...field} />
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="confirmPassword"
            render={({field}) => (
                <FormItem className={"w-full"}>
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                        <Input type={"password"} {...field} />
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
        />
    </>)
}
