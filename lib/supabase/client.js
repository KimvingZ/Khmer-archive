import { createBrowserClient } from "@supabase/ssr";

// The Supabase client for code running in the browser.
//
// Both values come from the environment and are never written down here:
// AGENTS.md rule 3, and this repository is public. NEXT_PUBLIC_ is not a
// secrecy setting — it means "bake this into the JavaScript every visitor
// downloads". That is correct for the publishable key, which is designed to
// be public, and it is why the service_role key must never appear in this
// project at all.
//
// createBrowserClient stores the session in a cookie rather than in
// localStorage. That is the whole reason @supabase/ssr exists: a cookie is
// sent with the next request, so the server can render the header already
// knowing who you are.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}
