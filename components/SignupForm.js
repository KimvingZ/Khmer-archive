"use client";

import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client.js";
import AuthForm from "./AuthForm.js";

export default function SignupForm() {
  const router = useRouter();

  async function signUp({ email, password }) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({ email, password });

    // The lab asked for one generic message on the *login* page. The leak in
    // this app is here instead: with "Confirm email" switched off, Supabase
    // answers an address that already exists with "User already registered",
    // which is user enumeration handed over in plain English. So this form
    // collapses every failure into one sentence too, and the sentence names
    // the fixable cause (password length) without confirming or denying that
    // the address is known.
    if (error) {
      return "Could not create that account. Check the email address, and use a password of at least 6 characters.";
    }

    // No session means "Confirm email" is still on in the Supabase
    // dashboard. Redirecting to a logged-out home page would just look
    // broken, so say what actually has to happen next.
    if (!data.session) {
      return "Account created. Open the confirmation link in your email, then log in.";
    }

    router.push("/");
    router.refresh();
    return null;
  }

  return (
    <AuthForm
      submitLabel="Create account"
      passwordLabel="PASSWORD · ពាក្យសម្ងាត់ · 6+ CHARACTERS"
      minLength={6}
      autoComplete="new-password"
      onSubmit={signUp}
    />
  );
}
