"use client";

import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client.js";
import AuthForm from "./AuthForm.js";

export default function LoginForm() {
  const router = useRouter();

  async function logIn({ email, password }) {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // One sentence for every failure, on purpose. "No account with that
    // email" would answer, free of charge and as fast as an attacker cares
    // to ask, the only question they came with: is this address registered
    // here? Wrong password and unknown address must be indistinguishable
    // from the outside. The real error is not logged to the console either
    // — the console is not private, and it would leak the same answer.
    if (error) return "Invalid email or password.";

    router.push("/");
    // The header is a Server Component. It only learns about the new session
    // when the server renders the page again, which is what refresh() asks
    // for. Without this line you land on a home page that still says
    // "Log in".
    router.refresh();
    return null;
  }

  return (
    <AuthForm
      submitLabel="Log in"
      autoComplete="current-password"
      onSubmit={logIn}
    />
  );
}
