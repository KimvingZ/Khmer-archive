import { Suspense } from "react";
import collection from "../collection.config.js";
import ArchiveEntries from "../components/ArchiveEntries.js";
import ArchiveNotice from "../components/ArchiveNotice.js";

const KHMER_STACK =
  "'Noto Sans Khmer', 'Khmer OS Battambang', 'Khmer OS', 'Leelawadee UI', 'Nokora', sans-serif";

const styles = {
  wrap: {
    maxWidth: 720,
    margin: "0 auto",
    padding: "80px 24px",
  },
  kicker: {
    fontFamily: "'Courier New', monospace",
    color: "#2EE6A8",
    fontSize: 14,
    letterSpacing: 1,
  },
  title: {
    fontSize: 48,
    fontWeight: 700,
    margin: "16px 0 12px",
    lineHeight: 1.1,
  },
  khmerName: {
    fontFamily: KHMER_STACK,
    fontSize: 28,
    lineHeight: 1.6,
    color: "#2EE6A8",
    margin: "0 0 16px",
  },
  khmerDescription: {
    fontFamily: KHMER_STACK,
    fontSize: 18,
    lineHeight: 1.9,
    color: "#C7CEDA",
    margin: "0 0 12px",
  },
  description: {
    fontSize: 18,
    color: "#97A1B3",
    lineHeight: 1.6,
    margin: 0,
  },
  card: {
    marginTop: 48,
    padding: 24,
    backgroundColor: "#1C222C",
    border: "1px solid #2E3644",
    borderRadius: 10,
  },
  cardLabel: {
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    color: "#97A1B3",
    margin: 0,
  },
  cardValue: {
    fontSize: 16,
    margin: "6px 0 0",
  },
  footer: {
    marginTop: 64,
    paddingTop: 24,
    borderTop: "1px solid #2E3644",
    fontSize: 13,
    color: "#97A1B3",
  },
};

export default function Home() {
  return (
    <main style={styles.wrap}>
      <p style={styles.kicker}>KHMER LIVING ARCHIVE</p>
      <h1 style={styles.title}>{collection.name}</h1>
      <p lang="km" style={styles.khmerName}>{collection.khmerName}</p>
      <p lang="km" style={styles.khmerDescription}>{collection.khmerDescription}</p>
      <p style={styles.description}>{collection.description}</p>

      <div style={styles.card}>
        <p style={styles.cardLabel}>CURATED BY · រៀបចំដោយ</p>
        <p style={styles.cardValue}>{collection.curator}</p>
      </div>
      <div style={styles.card}>
        <p style={styles.cardLabel}>SOURCE · ប្រភព</p>
        <p style={styles.cardValue}>{collection.source}</p>
      </div>

      {/* Everything above arrives at once; it comes from collection.config.js.
          The games come from Supabase, so they get a loading notice of
          their own instead of holding the whole page back. */}
      <Suspense fallback={<ArchiveNotice kind="loading" />}>
        <ArchiveEntries />
      </Suspense>

      <footer style={styles.footer}>
        <span lang="km">បង្កើតក្នុងមុខវិជ្ជា ICT 340 នៅសាកលវិទ្យាល័យអាមេរិកាំងភ្នំពេញ ឆ្នាំ ២០២៦</span> ·
        Built in ICT 340 — Vibe Coding, American University of Phnom Penh, Fall
        2026.
      </footer>
    </main>
  );
}
