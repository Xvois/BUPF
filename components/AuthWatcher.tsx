"use client"

import {createClient} from "@/utils/supabase/client";
import {useEffect} from "react";

/*
Provides realtime subscription to auth events.
 */

type AuthWatcherProps = {
    onInitialSession?: (session: any) => void | Promise<void>,
    onSignedIn?: (session: any) => void | Promise<void>,
    onSignedOut?: (session: any) => void | Promise<void>,
    onPasswordRecovery?: (session: any) => void | Promise<void>,
    onTokenRefreshed?: (session: any) => void | Promise<void>,
    onUserUpdated?: (session: any) => void | Promise<void>
}

export default function AuthWatcher({
    onInitialSession,
    onSignedIn,
    onSignedOut,
    onPasswordRecovery,
    onTokenRefreshed,
    onUserUpdated
}: AuthWatcherProps) {
    useEffect(() => {
        const supabase = createClient();
        const { data } = supabase.auth.onAuthStateChange((event, session) => {
            console.log(event, session)

            if (event === 'INITIAL_SESSION' && onInitialSession) {
                onInitialSession(session);
            } else if (event === 'SIGNED_IN' && onSignedIn) {
                onSignedIn(session);
            } else if (event === 'SIGNED_OUT' && onSignedOut) {
                onSignedOut(session);
            } else if (event === 'PASSWORD_RECOVERY' && onPasswordRecovery) {
                onPasswordRecovery(session);
            } else if (event === 'TOKEN_REFRESHED' && onTokenRefreshed) {
                onTokenRefreshed(session);
            } else if (event === 'USER_UPDATED' && onUserUpdated) {
                onUserUpdated(session);
            }
        });

        return () => {
            data?.subscription.unsubscribe();
        };
    }, []);

    return null;
}