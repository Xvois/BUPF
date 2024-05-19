'use client'

import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from "@/components/ui/alert-dialog";
import useSWR from "swr";
import {fetcher} from "@/utils/fetcher";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {z} from "zod";
import {FieldValues, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {handleEmailChange} from "@/components/EmailPopup/actions";
import {ServerError} from "@/components/ServerError";
import {useSearchParams} from "next/navigation";
import {SendHorizonal} from "lucide-react";
import {useAuthWatcher} from "@/hooks/use-auth-watcher";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {useEffect} from "react";

export default function EmailPopup() {

	const searchParams = useSearchParams();
	const isAwaitingEmail = window.localStorage.getItem('awaitingEmail');

	const {data: postgrestResponse} = useSWR("/api/auth", fetcher);
	const userData = postgrestResponse?.data;
	const user = userData?.user;
	const email = user?.email;
	const isInvalid = email ? !email.endsWith("@bath.ac.uk") : false;

	// Form
	const emailSchema = z.object({
		email: z.string().email().refine(email => email.endsWith('@bath.ac.uk'), {
			message: 'Email must end with @bath.ac.uk',
		})
	});
	const form = useForm({
		resolver: zodResolver(emailSchema),
	});
	const onSubmit = async (data: FieldValues) => {
		console.log('submitting')
		if (typeof data.email === 'string') {
			window.localStorage.setItem("awaitingEmail", "true")
			await handleEmailChange(data.email);
		}
	};

	useEffect(() => {
		if (searchParams.has("email_error")) {
			window.localStorage.removeItem("awaitingEmail");
		}
	}, [searchParams])

	// Await change
	useAuthWatcher({
		onUserUpdated: (session) => {
			const user = session?.user;
			if (user?.email?.endsWith('@bath.ac.uk')) {
				window.localStorage.removeItem("awaitingEmail")
				window.location.reload();
			} else {
				form.reset();
			}
		}
	})

	return (
		<AlertDialog open={isInvalid}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Change your email to a Bath University email to continue
					</AlertDialogTitle>
					<AlertDialogDescription>
						Personal emails are no longer valid on the platform, you will not be able to continue to use the
						site
						if you do not change your email.
					</AlertDialogDescription>
				</AlertDialogHeader>
				{
					isAwaitingEmail ? (
							<div>
								We have sent an email with a link to confirm your email to both your new and old
								address. Please check your inbox
								and spam folder.
							</div>
						)
						:
						(
							<Form {...form}>
								<form id="emailForm" onSubmit={form.handleSubmit(onSubmit)}
									  className={"flex space-x-4"}>
									<FormField
										control={form.control}
										name="email"
										render={({field}) => (
											<FormItem className={"w-full"}>
												<FormControl>
													<Input type={"email"} {...field} />
												</FormControl>
												<FormMessage/>
											</FormItem>
										)}
									/>
									<Button form="emailForm" type="submit">
										<SendHorizonal className={'h-4 w-4'}/>
									</Button>
								</form>
							</Form>

						)
				}

				<AlertDialogFooter>
					<ServerError>
						{searchParams.get("email_error")}
					</ServerError>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}