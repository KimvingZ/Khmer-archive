"use client";

import { useState } from "react";
import AuthField from "./AuthField.js";

const styles = {
  form: { marginTop: 32 },
  button: {
    width: "100%",
    padding: "14px 16px",
    fontSize: 16,
    fontWeight: 700,
    color: "#0E1116",
    backgroundColor: "#2EE6A8",
    border: "1px solid #2EE6A8",
    borderRadius: 10,
    cursor: "pointer",
  },
  busy: {
    backgroundColor: "#1C222C",
    borderColor: "#2E3644",
    color: "#5A6373",
    cursor: "wait",
  },
  // Same amber an EntryCard uses for a missing contributor: the archive's
  // colour for "read this, it is not finished".
  message: { fontSize: 15, color: "#C9A227", lineHeight: 1.6, margin: "20px 0 0" },
};

// Two fields, a busy state and one message line. It does not know Supabase
// exists. Whoever renders it passes an `onSubmit` that takes
// { email, password } and returns a sentence to show, or null when it worked
// and the page is already on its way somewhere else. `notice` is a sentence
// that is already showing when the page opens.
export default function AuthForm({
  submitLabel,
  passwordLabel = "PASSWORD · ពាក្យសម្ងាត់",
  minLength,
  autoComplete,
  notice = null,
  onSubmit,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(notice);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    setMessage(await onSubmit({ email, password }));
    setBusy(false);
  }

  // noValidate turns off the browser's pop-up bubbles, which only speak the
  // browser's language. A mistake goes through onSubmit instead and gets the
  // same Khmer and English sentence as every other failure.
  return (
    <form onSubmit={handleSubmit} noValidate style={styles.form}>
      <AuthField
        id="email"
        type="email"
        label="EMAIL · អ៊ីមែល"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <AuthField
        id="password"
        type="password"
        label={passwordLabel}
        autoComplete={autoComplete}
        minLength={minLength}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        type="submit"
        disabled={busy}
        style={{ ...styles.button, ...(busy ? styles.busy : null) }}
      >
        {busy ? "one moment…" : submitLabel}
      </button>

      {message ? (
        <p style={styles.message} role="alert">
          {message}
        </p>
      ) : null}
    </form>
  );
}
