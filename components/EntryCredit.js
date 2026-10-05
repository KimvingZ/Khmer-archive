import Highlight from "./Highlight.js";

const styles = {
  credit: {
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    color: "#97A1B3",
    borderTop: "1px solid #2E3644",
    paddingTop: 14,
    margin: 0,
  },
  unsourced: { color: "#C9A227" },
};

// Who told it, or, in amber, the honest admission that nobody has yet.
// Moved out of EntryCard unchanged when the card gained a photo.
export default function EntryCredit({ contributor, source, query }) {
  return (
    <p style={styles.credit}>
      {contributor ? (
        <>
          Told by <Highlight text={contributor} query={query} />
        </>
      ) : (
        // `source` is deliberately not highlighted: ArchiveSearch does not
        // search it, so marking it would promise a match that is not there.
        <span style={styles.unsourced}>
          {source || "No contributor recorded yet"}
        </span>
      )}
    </p>
  );
}
