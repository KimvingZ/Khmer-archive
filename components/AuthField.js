const styles = {
  label: {
    display: "block",
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    letterSpacing: 1,
    color: "#97A1B3",
    margin: "0 0 8px",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 16px",
    fontSize: 16,
    color: "#E8EDF2",
    backgroundColor: "#1C222C",
    border: "1px solid #2E3644",
    borderRadius: 10,
    outline: "none",
    marginBottom: 20,
  },
};

// One labelled box on the login, signup and password forms. Anything else
// passed in goes straight onto the <input>.
export default function AuthField({ id, label, ...input }) {
  return (
    <>
      <label htmlFor={id} style={styles.label}>
        {label}
      </label>
      <input id={id} required style={styles.input} {...input} />
    </>
  );
}
