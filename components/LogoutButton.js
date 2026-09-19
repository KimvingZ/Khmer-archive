"use client";

import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client.js";

const styles = {
  button: {
    fontFamily: "'Courier New', monospace",
    fontSize: 13,
    padding: "6px 12px",
    color: "#C7CEDA",
    backgroundColor: "#1C222C",
    border: "1px solid #2E3644",
    borderRadius: 8,
    cursor: "pointer",
  },
};

// The only client-side piece of the header. signOut() clears the Supabase
// cookie in the browser; refresh() makes the server render the header again
// so it stops showing an email that is no longer signed in.
export default function LogoutButton() {
  const router = useRouter();

  async function logOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button type="button" onClick={logOut} style={styles.button}>
      Log out
    </button>
  );
}
