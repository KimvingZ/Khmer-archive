"use client";

import { useState } from "react";

const styles = {
  form: { marginTop: 32 },
  label: {
    display: "block",
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    letterSpacing: 1,
    color: "#5A6373",
    margin: "0 0 8px",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 16px",
    fontSize: 16,
    color: "#E8EDF2",
    backgroundColor: "#1C222C",
    border: "1px solid #2E3644",
    borderRadius: 10,
    outline: "none",
    marginBottom: 20,
  },
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
// and the page is already on its way somewhere else.
export default function AuthForm({
  submitLabel,
  passwordLabel = "PASSWORD · ពាក្យសម្ងាត់",
  minLength,
  autoComplete,
  onSubmit,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    setMessage(await onSubmit({ email, password }));
    setBusy(false);
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <label htmlFor="email" style={styles.label}>
        EMAIL · អ៊ីមែល
      </label>
      <input
        id="email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />

      <label htmlFor="password" style={styles.label}>
        {passwordLabel}
      </label>
      <input
        id="password"
        type="password"
        autoComplete={autoComplete}
        required
        minLength={minLength}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
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
