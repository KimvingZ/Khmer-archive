"use client";

import { useState } from "react";
import { createClient } from "../lib/supabase/client.js";
import { UNREACHABLE } from "../lib/authMessages.js";
import AuthForm from "./AuthForm.js";
import DoneNote from "./DoneNote.js";

export default function ForgotForm({ notice }) {
  const [sent, setSent] = useState(false);

  async function sendLink({ email }) {
    if (!email.includes("@")) {
      return "សូមបញ្ចូលអ៊ីមែលនៃគណនីរបស់អ្នក · Enter the email address of your account.";
    }

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset`,
    });
    if (error?.name === "AuthRetryableFetchError") return UNREACHABLE;

    // Every other answer ends the same way, on purpose. Sent, refused or rate
    // limited: if this form said which, it would tell strangers which
    // addresses have an account here.
    setSent(true);
    return null;
  }

  if (sent) {
    return (
      <DoneNote
        title="សូមពិនិត្យអ៊ីមែល · Check your email"
        khmer="បើអ៊ីមែលនេះមានគណនី យើងបានផ្ញើតំណសម្រាប់ដាក់ពាក្យសម្ងាត់ថ្មីទៅហើយ។ សូមបើកតំណនោះក្នុង browser ដដែលនេះ ក្នុងរយៈពេល ១ ម៉ោង។ បើរកមិនឃើញ សូមមើលក្នុង Spam។"
        english="If that address has an account, we sent it a link to set a new password. Open the link in this same browser within 1 hour. Can't find it? Look in Spam."
      />
    );
  }

  return (
    <AuthForm
      submitLabel="Send reset link"
      showPassword={false}
      notice={notice}
      onSubmit={sendLink}
    />
  );
}
