// noinspection DuplicatedCode

import {type NextRequest, NextResponse} from "next/server";
import {updateSession} from "@/utils/supabase/middleware";
import {createClient} from "@/utils/supabase/server";

const authorisedPaths = [
    "^/$",
    "^/academics$",
    "^/login$",
    "^/signup$",
    "^/opengraph-image\\.ts$",
    "^/about$",
    "^/privacy$",
    "^/articles$",
    "^/auth/callback$",
    "^/auth/capture$",
    "^/auth/confirm$",
    "^/api/.*"
];

export async function middleware(request: NextRequest) {

    try {

        // Updates session
        // https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=environment&environment=middleware&queryGroups=framework&framework=nextjs
        let response = updateSession(request);

        const supabase = createClient();

        // This will refresh session if expired - required for Server Components
        // https://supabase.com/docs/guides/auth/server-side/nextjs
        const {data: {user}} = await supabase.auth.getUser();

        // Redirect to login page if attempting to access a page that requires authentication
        if (!user) {
            const url = request.nextUrl.clone()
            const authorisedPathsRegex = new RegExp(authorisedPaths.join("|"));
            if (!authorisedPathsRegex.test(url.pathname)) {
                console.log("(middleware.ts) Redirecting to home page")
                url.pathname = '/'
                return NextResponse.redirect(url);
            } else {
                return response;
            }
        }

        if (user.email && !user.email.endsWith("@bath.ac.uk")) {
            console.log("(middleware.ts) Redirecting to email-conv")
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
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}