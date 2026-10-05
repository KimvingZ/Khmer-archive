import Link from "next/link";
import DeleteEntryButton from "./DeleteEntryButton.js";

const MONO = "'Courier New', monospace";

const styles = {
  bar: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 16,
    padding: "14px 16px",
    border: "1px dashed #2E3644",
    borderRadius: 10,
  },
  label: { fontFamily: MONO, fontSize: 11, letterSpacing: 1, color: "#5A6373" },
  edit: {
    fontFamily: MONO,
    fontSize: 13,
    padding: "8px 14px",
    color: "#0E1116",
    backgroundColor: "#2EE6A8",
    borderRadius: 8,
    textDecoration: "none",
  },
};

// Edit and Delete, shown only to the person who added the game. Hiding them
// is manners, not protection: anyone else who tries anyway is refused by the
// row-level security policies in the database, button or no button.
export default function OwnerActions({ id }) {
  return (
    <div style={styles.bar}>
      <span style={styles.label}>YOU ADDED THIS GAME</span>
      <Link href={`/entries/${id}/edit`} style={styles.edit}>
        Edit
      </Link>
      <DeleteEntryButton id={id} />
    </div>
  );
}
