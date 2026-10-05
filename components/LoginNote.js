import Link from "next/link";

const styles = {
  box: {
    marginTop: 40,
    padding: "28px 24px",
    border: "1px dashed #2E3644",
    borderRadius: 10,
  },
  khmer: {
    fontFamily:
      "'Noto Sans Khmer', 'Khmer OS Battambang', 'Khmer OS', 'Leelawadee UI', 'Nokora', sans-serif",
    fontSize: 17,
    lineHeight: 1.9,
    color: "#C7CEDA",
    margin: "0 0 10px",
  },
  english: { fontSize: 16, color: "#97A1B3", lineHeight: 1.6, margin: 0 },
  link: { color: "#2EE6A8" },
};

// Stands where a form would be when nobody is logged in. It is a signpost,
// not the lock: the database refuses a logged-out write whether or not this
// page shows a form.
export default function LoginNote({ action }) {
  return (
    <div style={styles.box}>
      <p lang="km" style={styles.khmer}>
        សូមចូលគណនីជាមុនសិន។
      </p>
      <p style={styles.english}>
        You need an account to {action}.{" "}
        <Link href="/login" style={styles.link}>
          Log in
        </Link>{" "}
        or{" "}
        <Link href="/signup" style={styles.link}>
          sign up
        </Link>
        . It takes a minute.
      </p>
    </div>
  );
}
