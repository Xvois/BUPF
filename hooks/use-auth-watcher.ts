'use client';
import {useEffect} from "react";
import {createClient} from "@/utils/supabase/client";
import {Session} from "@supabase/auth-js";

type AuthWatcherProps = {
  onInitialSession?: (session: Session | null) => void | Promise<void>,
  onSignedIn?: (session: Session | null) => void | Promise<void>,
  onSignedOut?: (session: Session | null) => void | Promise<void>,
  onPasswordRecovery?: (session: Session | null) => void | Promise<void>,
  onTokenRefreshed?: (session: Session | null) => void | Promise<void>,
  onUserUpdated?: (session: Session | null) => void | Promise<void>
}

export function useAuthWatcher({
                                 onInitialSession,
                                 onSignedIn,
                                 onSignedOut,
                                 onPasswordRecovery,
                                 onTokenRefreshed,
                                 onUserUpdated
}: AuthWatcherProps) {
  useEffect(() => {
    const supabase = createClient();
    const {data} = supabase.auth.onAuthStateChange((event, session) => {

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
}