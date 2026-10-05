// Latin first, then the Khmer fonts the cards use, so a box can hold either
// script without the Khmer falling back to whatever the system finds.
const FONTS =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans Khmer', 'Khmer OS Battambang', 'Leelawadee UI', sans-serif";

const styles = {
  field: { marginBottom: 24 },
  label: {
    display: "block",
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    letterSpacing: 1,
    color: "#5A6373",
    margin: "0 0 6px",
  },
  hint: { fontSize: 13, color: "#5A6373", margin: "0 0 8px" },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 14px",
    fontSize: 16,
    fontFamily: FONTS,
    lineHeight: 1.6,
    color: "#E8EDF2",
    backgroundColor: "#1C222C",
    border: "1px solid #2E3644",
    borderRadius: 10,
    outline: "none",
    resize: "vertical",
  },
  // The archive's amber for "read this, it is not finished".
  invalid: { borderColor: "#C9A227" },
  error: { fontSize: 14, color: "#C9A227", margin: "6px 0 0" },
};

// One labelled box, its hint, and the message saying what to fix. It holds no
// state: the form passes the value in and hears about every keystroke.
export default function FormField({ name, label, hint, long, khmer, value, error, onChange }) {
  const Box = long ? "textarea" : "input";
  return (
    <div style={styles.field}>
      <label htmlFor={name} style={styles.label}>
        {label}
      </label>
      {hint ? (
        <p id={`${name}-hint`} style={styles.hint}>
          {hint}
        </p>
      ) : null}
      <Box
        id={name}
        name={name}
        lang={khmer ? "km" : undefined}
        rows={long ? 5 : undefined}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : hint ? `${name}-hint` : undefined}
        style={{ ...styles.input, ...(error ? styles.invalid : null) }}
      />
      {error ? (
        <p id={`${name}-error`} style={styles.error}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
