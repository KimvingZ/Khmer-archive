"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client.js";
import { removePhoto } from "../lib/photos.js";

const MONO = "'Courier New', monospace";

const styles = {
  button: {
    fontFamily: MONO,
    fontSize: 13,
    padding: "8px 14px",
    color: "#C7CEDA",
    backgroundColor: "#1C222C",
    border: "1px solid #2E3644",
    borderRadius: 8,
    cursor: "pointer",
  },
  danger: { color: "#0E1116", backgroundColor: "#C9A227", borderColor: "#C9A227" },
  ask: { fontSize: 14, color: "#E8EDF2" },
  row: { display: "inline-flex", alignItems: "center", flexWrap: "wrap", gap: 10 },
  message: { fontSize: 15, color: "#C9A227", margin: "12px 0 0", width: "100%" },
};

// Asks first, on the page rather than in a browser pop-up, then deletes
// through supabase-js. A delete that the row-level security policy refuses
// removes nothing and still reports success, so the returned row is the only
// proof it happened.
export default function DeleteEntryButton({ id }) {
  const router = useRouter();
  const [stage, setStage] = useState("idle"); // idle → confirm → deleting
  const [message, setMessage] = useState(null);

  async function remove() {
    setStage("deleting");
    const supabase = createClient();
    const { data, error } = await supabase
      .from("entries")
      .delete()
      .eq("id", id)
      .select("id, photo_url")
      .abortSignal(AbortSignal.timeout(15000));

    if (error || !data?.length) {
      console.error("delete failed:", error || "no row came back");
      setStage("idle");
      return setMessage("That change wasn't saved.");
    }
    // The entry is gone, so its photo would only be litter in the bucket.
    removePhoto(supabase, data[0].photo_url);
    router.push("/");
    router.refresh();
  }

  if (stage === "idle") {
    return (
      <span style={styles.row}>
        <button type="button" onClick={() => setStage("confirm")} style={styles.button}>
          Delete
        </button>
        {message ? <span role="alert" style={styles.message}>{message}</span> : null}
      </span>
    );
  }

  const busy = stage === "deleting";
  return (
    <span style={styles.row}>
      <span style={styles.ask}>Delete this game for good?</span>
      <button type="button" onClick={remove} disabled={busy} style={{ ...styles.button, ...styles.danger }}>
        {busy ? "Deleting…" : "Yes, delete it"}
      </button>
      <button type="button" onClick={() => setStage("idle")} disabled={busy} style={styles.button}>
        Cancel
      </button>
    </span>
  );
}
