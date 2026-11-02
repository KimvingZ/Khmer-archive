"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client.js";
import { UNREACHABLE } from "../lib/authMessages.js";
import AuthForm from "./AuthForm.js";
import DoneNote from "./DoneNote.js";

// Supabase's two ways of saying no email went out: too soon or too many this
// hour, or an address its built-in mailer refuses. Neither says anything about
// who has an account, so they can have a true sentence of their own.
const MAIL_TROUBLE = ["over_email_send_rate_limit", "email_address_not_authorized"];

export default function SignupForm() {
  const router = useRouter();
  const [sentTo, setSentTo] = useState(null);

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
      return "មិនទាន់អាចផ្ញើអ៊ីមែលថ្មីបានទេ។ បើអ្នកទើបតែស្នើ សូមពិនិត្យប្រអប់អ៊ីមែល និង Spam។ បើមិនដូច្នោះទេ សូមសាកល្បងម្ដងទៀតបន្តិចក្រោយ · No new email could be sent just now. If you only just asked, check your inbox and Spam. Otherwise try again in a little while.";
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
    // what stops this form telling strangers who is registered. So DoneNote's
    // words have to be true for both.
    if (!data.session) {
      setSentTo(email);
      return null;
    }

    router.push("/");
    router.refresh();
    return null;
  }

  if (sentTo) {
    return (
      <DoneNote
        title="សូមពិនិត្យអ៊ីមែល · Check your email"
        khmer={`យើងបានផ្ញើតំណបញ្ជាក់ទៅ ${sentTo}។ សូមបើកតំណនោះ ដើម្បីបញ្ចប់ការបង្កើតគណនី។ បើរកមិនឃើញ សូមមើលក្នុង Spam។ បើអ្នកមានគណនីនេះរួចហើយ នឹងគ្មានអ៊ីមែលផ្ញើមកទេ សូមចូលគណនីតែម្ដង។`}
        english={`We sent a confirmation link to ${sentTo}. Open it to finish creating your account. Can't find it? Look in Spam. If you already have an account here, no email is sent: just log in.`}
      />
    );
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
