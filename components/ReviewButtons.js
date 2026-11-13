"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client.js";

const MONO = "'Courier New', monospace";

const styles = {
  bar: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginTop: 12, padding: "14px 16px", border: "1px dashed #2E3644", borderRadius: 10 },
  yes: { fontFamily: MONO, fontSize: 13, padding: "8px 14px", color: "#0E1116", backgroundColor: "#2EE6A8", border: "1px solid #2EE6A8", borderRadius: 8, cursor: "pointer" },
  plain: { fontFamily: MONO, fontSize: 13, padding: "8px 14px", color: "#C7CEDA", backgroundColor: "#1C222C", border: "1px solid #2E3644", borderRadius: 8, cursor: "pointer" },
  note: { width: "100%", boxSizing: "border-box", padding: "10px 12px", fontSize: 15, lineHeight: 1.6, color: "#E8EDF2", backgroundColor: "#1C222C", border: "1px solid #2E3644", borderRadius: 8 },
  message: { width: "100%", fontSize: 14, color: "#C9A227", margin: 0 },
};

const NEED_NOTE = "សូមសរសេរថាត្រូវកែអ្វី មិនលើស ៥០០ តួអក្សរ · Say what needs fixing, in 500 characters or fewer.";
// The usual reason is a game already decided in another tab, so there is
// nothing to try again: reloading shows the queue as it is now.
const NOT_CHANGED = "ល្បែងនេះមិនបានផ្លាស់ប្ដូរទេ។ វាប្រហែលជាត្រូវបានផ្សាយ ឬបញ្ជូនត្រឡប់រួចហើយ នៅផ្ទាំងផ្សេង។ សូមផ្ទុកទំព័រឡើងវិញ · This game wasn't changed. It was probably published or returned already, in another tab. Reload the page to see the queue.";

// Publish or Return for one game in the review queue. Return needs a note,
// which the contributor reads on their game's page. Both go through the
// database function review_entry (docs/sprint3-sql/3-review-fixes.sql). It
// changes a game only for a reviewer, and only while the game is still
// waiting, and answers true when it did. false or an error changed nothing.
export default function ReviewButtons({ id }) {
  const router = useRouter();
  const [returning, setReturning] = useState(false);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);

  async function decide(decision, reviewNote) {
    setBusy(true);
    setMessage(null);
    const { data, error } = await createClient()
      .rpc("review_entry", { entry_id: id, decision, note: reviewNote })
      .abortSignal(AbortSignal.timeout(15000));
    if (error || data !== true) {
      console.error("review failed:", error || "review_entry answered false");
      setBusy(false);
      return setMessage(NOT_CHANGED);
    }
    router.refresh(); // the game leaves the queue; stays busy until it does
  }

  function sendBack() {
    const text = note.trim();
    if (!text || Array.from(text).length > 500) return setMessage(NEED_NOTE);
    decide("returned", text);
  }

  return (
    <div style={styles.bar}>
      {returning ? (
        <>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} aria-label="Note to the contributor"
            placeholder="What should the contributor fix? · តើត្រូវកែអ្វី?" style={styles.note} />
          <button type="button" onClick={sendBack} disabled={busy} style={styles.yes}>
            {busy ? "Sending… · កំពុងបញ្ជូន" : "Send back · បញ្ជូនត្រឡប់"}
          </button>
          <button type="button" onClick={() => setReturning(false)} disabled={busy} style={styles.plain}>Cancel · បោះបង់</button>
        </>
      ) : (
        <>
          <button type="button" onClick={() => decide("published", null)} disabled={busy} style={styles.yes}>
            {busy ? "Publishing… · កំពុងផ្សាយ" : "Publish · ផ្សាយ"}
          </button>
          <button type="button" onClick={() => setReturning(true)} disabled={busy} style={styles.plain}>Return · បញ្ជូនត្រឡប់</button>
        </>
      )}
      {message ? <p role="alert" style={styles.message}>{message}</p> : null}
    </div>
  );
}
