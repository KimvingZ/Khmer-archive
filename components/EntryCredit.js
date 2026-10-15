import Highlight from "./Highlight.js";

const styles = {
  credit: {
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    lineHeight: 1.6,
    color: "#97A1B3",
    borderTop: "1px solid #2E3644",
    paddingTop: 14,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  line: { margin: 0 },
  label: { color: "#5A6373", letterSpacing: 1, marginRight: 8 },
  // The archive's amber for "read this, it is not finished".
  unsourced: { margin: 0, color: "#C9A227" },
};

// Where this game comes from. The named source is always shown, so a reader
// can go and check it. "Told by" is only for a real person who was
// interviewed; until there is one, the amber line says so out loud rather
// than letting a published source pass for an interview.
export default function EntryCredit({ contributor, source, query }) {
  return (
    <div style={styles.credit}>
      {contributor ? (
        <p style={styles.line}>
          <span style={styles.label}>TOLD BY · អ្នកប្រាប់</span>
          <Highlight text={contributor} query={query} />
        </p>
      ) : null}
      {source ? (
        // `source` is deliberately not highlighted: ArchiveSearch does not
        // search it, so marking it would promise a match that is not there.
        <p style={styles.line}>
          <span style={styles.label}>SOURCE · ប្រភព</span>
          {source}
        </p>
      ) : null}
      {contributor ? null : (
        <p style={styles.unsourced}>No one has been interviewed for this game yet.</p>
      )}
    </div>
  );
}
