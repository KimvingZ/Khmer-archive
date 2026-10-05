import { youtubeUrl } from "../lib/entryRules.js";

const styles = {
  line: { margin: "0 0 16px" },
  link: {
    fontFamily: "'Courier New', monospace",
    fontSize: 13,
    color: "#2EE6A8",
    textDecoration: "none",
    borderBottom: "1px solid #2E3644",
  },
};

// The entry's YouTube link, shown only in the exact shape the form stores.
// Checking it again here means a value that reached the table some other way
// can never become a javascript: link or a jump to another site.
export default function WatchLink({ url }) {
  if (!url || youtubeUrl(url) !== url) return null;
  return (
    <p style={styles.line}>
      <a href={url} target="_blank" rel="noopener noreferrer" style={styles.link}>
        ▶ Watch it being played on YouTube · <span lang="km">មើលវីដេអូ</span>
      </a>
    </p>
  );
}
