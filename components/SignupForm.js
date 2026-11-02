"use client";

import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client.js";
import { UNREACHABLE } from "../lib/authMessages.js";
import AuthForm from "./AuthForm.js";

// Supabase's two ways of saying the email could not go out: too many sent this
// hour, or an address its built-in mailer refuses. Neither says anything about
// who has an account, so they can have a true sentence of their own.
const MAIL_TROUBLE = ["over_email_send_rate_limit", "email_address_not_authorized"];

export default function SignupForm() {
  const router = useRouter();

  async function signUp({ email, password }) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      // Where the link in the confirmation email comes back to.
      options: { emailRedirectTo: `${window.location.origin}/auth/confirm` },
    });

    if (error?.name === "AuthRetryableFetchError") return UNREACHABLE;
    if (MAIL_TROUBLE.includes(error?.code)) {
      return "មិនអាចផ្ញើអ៊ីមែលបញ្ជាក់បានទេឥឡូវនេះ។ សូមសាកល្បងម្ដងទៀតពេលក្រោយ · The confirmation email couldn't be sent just now. Please try again later.";
    }

    // Every other failure gets one sentence. It names the fixable cause
    // (password length) without confirming or denying that the address is
    // known.
    if (error) {
      return "មិនអាចបង្កើតគណនីនេះបានទេ។ សូមពិនិត្យអ៊ីមែល ហើយប្រើពាក្យសម្ងាត់យ៉ាងហោចណាស់ ៦ តួអក្សរ · Could not create that account. Check the email address, and use a password of at least 6 characters.";
    }

    // "Confirm email" is on, so a new account has no session until its link
    // has been opened. An address that already has an account lands here too:
    // Supabase answers exactly as if it were new and sends no email, which is
    // what stops this form telling strangers who is registered. So this
    // sentence has to be true for both.
    if (!data.session) {
      return "សូមពិនិត្យអ៊ីមែលរបស់អ្នក ហើយបើកតំណបញ្ជាក់ រួចចូលគណនី។ បើមានគណនីរួចហើយ សូមចូលគណនីតែម្ដង · Check your email and open the confirmation link, then log in. If you already have an account, just log in.";
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
