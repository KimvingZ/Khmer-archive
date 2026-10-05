const styles = {
  button: {
    width: "100%",
    padding: "14px 16px",
    fontSize: 16,
    fontWeight: 700,
    color: "#0E1116",
    backgroundColor: "#2EE6A8",
    border: "1px solid #2EE6A8",
    borderRadius: 10,
    cursor: "pointer",
  },
  busy: {
    backgroundColor: "#1C222C",
    borderColor: "#2E3644",
    color: "#5A6373",
    cursor: "wait",
  },
  // Same amber as an EntryCard's missing contributor: "read this".
  message: { fontSize: 15, color: "#C9A227", lineHeight: 1.6, margin: "20px 0 0" },
};

// The form's submit button and the one sentence under it. Disabled while a
// save is running, so a slow upload can't be sent twice.
export default function SaveButton({ saving, label, message }) {
  return (
    <>
      <button
        type="submit"
        disabled={saving}
        style={{ ...styles.button, ...(saving ? styles.busy : null) }}
      >
        {saving ? "Saving…" : label}
      </button>
      {message ? (
        <p role="alert" style={styles.message}>
          {message}
        </p>
      ) : null}
    </>
  );
}
