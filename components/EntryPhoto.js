import { PHOTO_URL_PREFIX } from "../lib/photos.js";

const styles = {
  photo: {
    display: "block",
    width: "100%",
    borderRadius: 8,
    backgroundColor: "#14181F",
    marginBottom: 18,
  },
  card: { height: 220, objectFit: "cover" },
  page: { maxHeight: 520, objectFit: "contain" },
  missing: {
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    color: "#C9A227",
    padding: "14px 16px",
    border: "1px dashed #2E3644",
    borderRadius: 8,
    margin: "0 0 18px",
  },
};

// An entry's photo, if it has one this archive stored. A photo_url pointing
// anywhere else is never loaded: the check constraint keeps one out of the
// table, and this is the second lock. On an entry's own page a missing photo
// says so in amber, the same way a missing contributor does.
export default function EntryPhoto({ url, title, large }) {
  if (url && url.startsWith(PHOTO_URL_PREFIX)) {
    return (
      <img
        src={url}
        alt={`Photo of ${title}`}
        loading={large ? "eager" : "lazy"}
        style={{ ...styles.photo, ...(large ? styles.page : styles.card) }}
      />
    );
  }
  if (!large) return null;
  return (
    <p style={styles.missing}>
      <span lang="km">មិនទាន់មានរូបថតនៅឡើយទេ</span> · No photo of this game yet
    </p>
  );
}
