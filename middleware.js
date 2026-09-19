import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

// Why this file exists at all:
//
// A Supabase access token expires after an hour. Refreshing it produces a new
// cookie, and a Server Component can read cookies but cannot write them — so
// the refreshed cookie would have nowhere to land, and the header would start
// showing "logged out" to somebody who is not. Middleware runs before the
// page and it *can* write cookies, so the refresh happens here.
//
// This middleware only refreshes the session. It guards nothing: no part of
// the archive is private yet. Route protection is next week's lab, and it
// belongs here when it comes.
export async function middleware(request) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Twice on purpose: once onto the request, so the page that is
          // about to render sees the fresh cookie, and once onto the
          // response, so the browser keeps it for next time.
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    }
  );

  // This call is the refresh. It looks like a pointless read and it is not —
  // deleting it is how the session quietly stops renewing.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  // Skip Next's own static output and image files; they have no session.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
