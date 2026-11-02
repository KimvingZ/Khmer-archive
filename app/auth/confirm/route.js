import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server.js";

// Where the link in a confirmation email lands. Supabase has already done the
// checking by now: a good link arrives with a one-time `code`, a dead one
// (expired, or already used) arrives without it.
//
// The code only turns into a session in the browser that signed up, because
// the other half of it is a cookie there. Signing up on a laptop and opening
// the email on a phone is normal, so a failed exchange is not bad news: the
// address is confirmed, and that person just has to log in.
export async function GET(request) {
  const { origin, searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  if (!code) return NextResponse.redirect(`${origin}/login?link=expired`);

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  return NextResponse.redirect(`${origin}${error ? "/login?link=confirmed" : "/"}`);
}
