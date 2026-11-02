"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "../lib/supabase/client.js";
import { UNREACHABLE } from "../lib/authMessages.js";
import AuthForm from "./AuthForm.js";
import DoneNote from "./DoneNote.js";

const TOO_SHORT = "សូមប្រើពាក្យសម្ងាត់យ៉ាងហោចណាស់ ៦ តួអក្សរ · Use a password of at least 6 characters.";

const styles = {
  back: { display: "inline-block", marginTop: 16, fontSize: 15, color: "#2EE6A8" },
};

// The email link has already logged the person in, which is why this form
// only asks for the new password. Supabase ends the account's other logins
// when the password changes, so a stolen session stops working too.
export default function ResetForm() {
  const [done, setDone] = useState(false);

  async function save({ password }) {
    if (password.length < 6) return TOO_SHORT;

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error?.name === "AuthRetryableFetchError") return UNREACHABLE;
    if (error?.code === "weak_password") return TOO_SHORT;
    if (error?.code === "same_password") {
      return "នេះជាពាក្យសម្ងាត់ចាស់របស់អ្នក។ សូមជ្រើសរើសពាក្យសម្ងាត់ថ្មី · That's your current password. Choose a new one.";
    }
    if (error) {
      return "តំណនេះអស់សុពលភាពហើយ។ សូមស្នើតំណថ្មីពីទំព័រចូលគណនី · This reset has run out of time. Ask for a new link from the log in page.";
    }

    setDone(true);
    return null;
  }

  if (done) {
    return (
      <DoneNote
        title="បានប្ដូរពាក្យសម្ងាត់ហើយ · Password changed"
        khmer="អ្នកបានចូលគណនីរួចហើយ។ លើកក្រោយ សូមប្រើពាក្យសម្ងាត់ថ្មីនេះ។"
        english="You're logged in. Use your new password next time."
      >
        <Link href="/" style={styles.back}>
          ← All games
        </Link>
      </DoneNote>
    );
  }

  return (
    <AuthForm
      submitLabel="Save new password"
      showEmail={false}
      passwordLabel="NEW PASSWORD · ពាក្យសម្ងាត់ថ្មី · 6+ CHARACTERS"
      minLength={6}
      autoComplete="new-password"
      onSubmit={save}
    />
  );
}
