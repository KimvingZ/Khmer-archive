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
};

// The frame the inner pages share with the home page: a small green kicker,
// a big title, one line of description, then whatever the page is for.
export default function PageShell({ kicker, title, description, children }) {
  return (
    <main style={styles.wrap}>
      <p style={styles.kicker}>{kicker}</p>
      <h1 style={styles.title}>{title}</h1>
      {description ? <p style={styles.description}>{description}</p> : null}
      {children}
    </main>
  );
}
