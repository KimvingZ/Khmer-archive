const styles = {
  box: {
    marginTop: 32,
    padding: 24,
    backgroundColor: "#1C222C",
    border: "1px solid #2EE6A8",
    borderRadius: 10,
  },
  title: { fontSize: 20, fontWeight: 700, lineHeight: 1.6, color: "#2EE6A8", margin: "0 0 12px" },
  khmer: {
    fontFamily:
      "'Noto Sans Khmer', 'Khmer OS Battambang', 'Khmer OS', 'Leelawadee UI', 'Nokora', sans-serif",
    fontSize: 16,
    lineHeight: 1.9,
    color: "#C7CEDA",
    margin: "0 0 10px",
  },
  english: { fontSize: 16, color: "#97A1B3", lineHeight: 1.6, margin: 0 },
};

// Takes the place of a form once the form has done its job, so there is
// nothing left to press twice. Green, because this is good news: amber is the
// archive's colour for "read this, it is not finished".
export default function DoneNote({ title, khmer, english, children }) {
  return (
    <div role="status" style={styles.box}>
      <h2 style={styles.title}>{title}</h2>
      <p lang="km" style={styles.khmer}>
        {khmer}
      </p>
      <p style={styles.english}>{english}</p>
      {children}
    </div>
  );
}
