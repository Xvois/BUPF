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

export default function EmailPopup() {

	const searchParams = useSearchParams();
	const isAwaitingEmail = window.localStorage.getItem('awaitingEmail');

	// yikes
	const {data: postgrestResponse} = useSWR("/api/auth", fetcher);
	const userData = postgrestResponse?.data;
	const user = userData?.user;
	const email = user?.email;
	const isValid = email?.endsWith("@bath.ac.uk");

	// Form
	const emailSchema = z.string().email().refine(email => email.endsWith('@bath.ac.uk'), {
		message: 'Email must end with @bath.ac.uk',
	});
	const form = useForm({
		resolver: zodResolver(emailSchema),
	});
	const onSubmit = async (data: FieldValues) => {
		if (typeof data.email === 'string') {
			window.localStorage.setItem("awaitingEmail", "true")
			await handleEmailChange(data.email);
		}
	};

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
		<AlertDialog open={!isValid}>
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
								We have sent an email with a link to confirm your email. Please check your inbox
								and spam folder.
							</div>
						)
						:
						(
							<form onSubmit={form.handleSubmit(onSubmit)} className={"flex space-x-4"}>
								<Input type="email" {...form.register('email')} placeholder="Enter your Bath email"/>
								<Button type="submit">
									<SendHorizonal className={'h-4 w-4'}/>
								</Button>
							</form>
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