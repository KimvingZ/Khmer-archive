import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server.js";

// Where the link in a password reset email lands. It works like /auth/confirm
// with one difference: here the session is the whole point, because the new
// password can only be saved by someone logged in. So a failed exchange can't
// fall back to "just log in". It means the link was opened in a different
// browser from the one that asked for it, and that is what the person is told.
export async function GET(request) {
  const { origin, searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  if (!code) return NextResponse.redirect(`${origin}/forgot-password?link=expired`);

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  return NextResponse.redirect(
    `${origin}${error ? "/forgot-password?link=other-browser" : "/reset-password"}`
  );
}
