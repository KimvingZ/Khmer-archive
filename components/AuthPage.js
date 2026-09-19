import Link from "next/link";

const styles = {
  wrap: { maxWidth: 720, margin: "0 auto", padding: "80px 24px" },
  kicker: {
    fontFamily: "'Courier New', monospace",
    color: "#2EE6A8",
    fontSize: 14,
    letterSpacing: 1,
  },
  title: { fontSize: 48, fontWeight: 700, margin: "16px 0 12px", lineHeight: 1.1 },
  description: { fontSize: 18, color: "#97A1B3", lineHeight: 1.6, margin: 0 },
  alt: { fontSize: 15, color: "#97A1B3", marginTop: 32 },
  link: { color: "#2EE6A8" },
};

// The page chrome /login and /signup share, lifted out of app/page.js so the
// front door looks like the rest of the archive instead of like a form that
// wandered in. The form itself is the child; this file has no idea what
// Supabase is.
export default function AuthPage({
  title,
  description,
  children,
  altText,
  altHref,
  altLabel,
}) {
  return (
    <main style={styles.wrap}>
      <p style={styles.kicker}>CONTRIBUTOR ACCOUNTS</p>
      <h1 style={styles.title}>{title}</h1>
      <p style={styles.description}>{description}</p>

      {children}

      <p style={styles.alt}>
        {altText}{" "}
        <Link href={altHref} style={styles.link}>
          {altLabel}
        </Link>
      </p>
    </main>
  );
}
