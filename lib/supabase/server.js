import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// The Supabase client for Server Components, route handlers and server
// actions. Same two environment variables as the browser client; the
// difference is where the session cookie is read from.
export async function createClient() {
  // In Next 15 cookies() is async. Awaiting it here, before the client is
  // built, is also what marks the route dynamic — so none of this runs at
  // build time, when the environment variables may not exist yet.
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // A Server Component is not allowed to set cookies, so this
            // throws whenever the client is used from one. Safe to swallow:
            // middleware.js has already written any refreshed cookie on the
            // way in. Without middleware this catch would be hiding a bug.
          }
        },
      },
    }
  );
}
