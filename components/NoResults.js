const styles = {
  box: {
    marginTop: 24,
    padding: "32px 24px",
    border: "1px dashed #2E3644",
    borderRadius: 10,
    textAlign: "center",
  },
  khmer: {
    fontFamily:
      "'Noto Sans Khmer', 'Khmer OS Battambang', 'Khmer OS', 'Leelawadee UI', 'Nokora', sans-serif",
    fontSize: 17,
    lineHeight: 1.9,
    color: "#C7CEDA",
    margin: "0 0 14px",
  },
  english: { fontSize: 15, color: "#97A1B3", lineHeight: 1.6, margin: 0 },
  query: { color: "#2EE6A8" },
};

// The empty state is the archive talking, not the framework. Rewrite the
// wording here whenever the archive's voice changes.
export default function NoResults({ query }) {
  return (
    <div style={styles.box}>
      <p lang="km" style={styles.khmer}>
        រកមិនឃើញល្បែងដែលត្រូវនឹងពាក្យនេះទេ។ គេហទំព័រនេះមានតែល្បែងដែលមាននរណាម្នាក់បានរៀបរាប់ប៉ុណ្ណោះ។
        បើអ្នកស្គាល់ល្បែងនេះ សូមបន្ថែមវាទៅក្នុងគេហទំព័រ។
      </p>
      <p style={styles.english}>
        No game matches <span style={styles.query}>{query}</span>. This archive
        holds only games that someone has described. If you know this game,
        please consider adding it.
      </p>
    </div>
  );
}
