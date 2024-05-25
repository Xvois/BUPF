import {type NextRequest, NextResponse} from "next/server";
import {type CookieOptions, createServerClient} from "@supabase/ssr";

const authorisedPaths = ["/", "/academics", "/login", "/signup"];

export async function middleware(request: NextRequest) {

	try {
		let response = NextResponse.next({
			request: {
				headers: request.headers,
			},
		});
		const supabase = createServerClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL!,
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
			{
				cookies: {
					get(name: string) {
						return request.cookies.get(name)?.value;
					},
					set(name: string, value: string, options: CookieOptions) {
						// If the cookie is updated, update the cookies for the request and response
						request.cookies.set({
							name,
							value,
							...options,
						});
						response = NextResponse.next({
							request: {
								headers: request.headers,
							},
						});
						response.cookies.set({
							name,
							value,
							...options,
						});
					},
					remove(name: string, options: CookieOptions) {
						// If the cookie is removed, update the cookies for the request and response
						request.cookies.set({
							name,
							value: "",
							...options,
						});
						response = NextResponse.next({
							request: {
								headers: request.headers,
							},
						});
						response.cookies.set({
							name,
							value: "",
							...options,
						});
					},
				},
			},
		);

		// This will refresh session if expired - required for Server Components
		// https://supabase.com/docs/guides/auth/server-side/nextjs
		const {data: {user}} = await supabase.auth.getUser();

		// Redirect to login page if attempting to access a page that requires authentication
		if (!user) {
			const url = request.nextUrl.clone()
			if (!authorisedPaths.includes(url.pathname)) {
				url.pathname = '/'
				return NextResponse.redirect(url);
			} else {
				return response;
			}
		}

		if (user.email && !user.email.endsWith("@bath.ac.uk")) {
			const url = request.nextUrl.clone()
			url.pathname = '/email-conv'
			return NextResponse.rewrite(url)
		}

		return response;
	} catch (error) {
		// If you are here, a Supabase client could not be created!
		// This is likely because you have not set up environment variables.
		return NextResponse.next({
			request: {
				headers: request.headers,
			},
		});
	}
}


export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		'/((?!api|_next/static|_next/image|favicon.ico|robots.txt).*)',
	],
}