import Link from "next/link";
import { createClient } from "../lib/supabase/server.js";
import LogoutButton from "./LogoutButton.js";

const MONO = "'Courier New', monospace";

const styles = {
  bar: { borderBottom: "1px solid #2E3644", backgroundColor: "#171C25" },
  inner: {
    maxWidth: 720,
    margin: "0 auto",
    padding: "14px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
  },
  home: { fontFamily: MONO, fontSize: 12, letterSpacing: 1, color: "#2EE6A8", textDecoration: "none" },
  right: { display: "flex", alignItems: "center", flexWrap: "wrap", gap: 16 },
  // An email is long and a phone is narrow: let it break rather than shove
  // the logout button off the edge of the screen.
  email: { fontFamily: MONO, fontSize: 13, color: "#97A1B3", overflowWrap: "anywhere" },
  link: { fontFamily: MONO, fontSize: 13, color: "#C7CEDA", textDecoration: "none", borderBottom: "1px solid #2E3644" },
};

// A Server Component: it reads the session cookie on the server, so the page
// arrives already knowing who you are. No flash of "Log in" before the real
// answer catches up.
export default async function SiteHeader() {
  const supabase = await createClient();
  // getUser() re-checks the token with Supabase. getSession() would take the
  // cookie's word for it, and the cookie lives in a browser the visitor
  // controls.
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  return (
    <header style={styles.bar}>
      <div style={styles.inner}>
        <Link href="/" style={styles.home}>
          KHMER LIVING ARCHIVE
        </Link>

        <div style={styles.right}>
          {user ? (
            <>
              <span style={styles.email}>{user.email}</span>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" style={styles.link}>
                Log in
              </Link>
              <Link href="/signup" style={styles.link}>
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
