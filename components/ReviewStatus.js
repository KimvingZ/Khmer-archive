import { STATUS_LABELS } from "../lib/review.js";

const styles = {
  // The archive's amber for "read this, it is not finished".
  box: { marginTop: 24, padding: "16px 20px", border: "1px dashed #C9A227", borderRadius: 10 },
  label: { fontFamily: "'Courier New', monospace", fontSize: 13, letterSpacing: 1, color: "#C9A227", margin: "0 0 8px" },
  text: { fontSize: 15, color: "#C7CEDA", lineHeight: 1.7, margin: 0 },
  note: { fontSize: 15, color: "#E8EDF2", lineHeight: 1.6, margin: "12px 0 0", whiteSpace: "pre-wrap" },
  noteLabel: { fontFamily: "'Courier New', monospace", fontSize: 12, color: "#97A1B3" },
};

const TEXT = {
  pending:
    "អ្នកទស្សនាមិនទាន់ឃើញល្បែងនេះទេ រហូតដល់អ្នកពិនិត្យបណ្ណសារផ្សាយវា · Visitors can't see this game until the archive's reviewer publishes it.",
  returned:
    "អ្នកពិនិត្យបានបញ្ជូនល្បែងនេះត្រឡប់មកវិញ។ សូមកែតាមកំណត់សម្គាល់ខាងក្រោម រួចរក្សាទុក ដើម្បីបញ្ជូនវាទៅពិនិត្យម្ដងទៀត · The reviewer sent this game back. Fix what the note asks, then save it to send it for review again.",
};

// Where an unpublished game stands, shown on its own page. Only its owner and
// the reviewer can open an unpublished game at all (the database's rule), so
// they are the only people who ever see this box.
export default function ReviewStatus({ status, note }) {
  if (!TEXT[status]) return null;
  return (
    <div role="status" style={styles.box}>
      <p style={styles.label}>{STATUS_LABELS[status]}</p>
      <p style={styles.text}>{TEXT[status]}</p>
      {note ? (
        <p style={styles.note}>
          <span style={styles.noteLabel}>NOTE · កំណត់សម្គាល់ </span>
          {note}
        </p>
      ) : null}
    </div>
  );
}
