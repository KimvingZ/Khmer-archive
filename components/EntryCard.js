import Link from "next/link";
import Highlight from "./Highlight.js";
import EntryPhoto from "./EntryPhoto.js";
import EntryFacts from "./EntryFacts.js";
import EntryCredit from "./EntryCredit.js";
import WatchLink from "./WatchLink.js";

const KHMER_STACK =
  "'Noto Sans Khmer', 'Khmer OS Battambang', 'Khmer OS', 'Leelawadee UI', 'Nokora', sans-serif";

const styles = {
  card: {
    padding: 24,
    backgroundColor: "#1C222C",
    border: "1px solid #2E3644",
    borderRadius: 10,
    marginTop: 24,
  },
  khmerTitle: {
    fontFamily: KHMER_STACK,
    fontSize: 26,
    lineHeight: 1.6,
    color: "#2EE6A8",
    margin: "0 0 4px",
  },
  title: { fontSize: 20, fontWeight: 700, margin: "0 0 12px" },
  titleLink: { color: "inherit", textDecoration: "none", borderBottom: "1px solid #2E3644" },
  description: {
    fontSize: 16,
    color: "#C7CEDA",
    lineHeight: 1.6,
    margin: "0 0 16px",
  },
  label: {
    fontFamily: "'Courier New', monospace",
    fontSize: 11,
    letterSpacing: 1,
    color: "#5A6373",
    margin: "0 0 6px",
  },
  howToPlay: {
    fontSize: 15,
    color: "#97A1B3",
    lineHeight: 1.6,
    margin: "0 0 20px",
    paddingLeft: 14,
    borderLeft: "2px solid #2E3644",
  },
};

// One game. On the home page (`link`) the title opens the game's own page;
// on that page (`large`) the photo is shown whole instead of cropped.
export default function EntryCard({
  id,
  title,
  khmerTitle,
  description,
  howToPlay,
  players,
  materials,
  occasion,
  place,
  contributor,
  source,
  photoUrl,
  youtubeUrl,
  query,
  link,
  large,
}) {
  const name = <Highlight text={title} query={query} />;

  return (
    <article style={styles.card}>
      <EntryPhoto url={photoUrl} title={title} large={large} />
      {khmerTitle ? (
        <h2 lang="km" style={styles.khmerTitle}>
          <Highlight text={khmerTitle} query={query} />
        </h2>
      ) : null}
      <h3 style={styles.title}>
        {link ? (
          <Link href={`/entries/${id}`} style={styles.titleLink}>
            {name}
          </Link>
        ) : (
          name
        )}
      </h3>

      <p style={styles.description}>
        <Highlight text={description || "No description yet."} query={query} />
      </p>

      {howToPlay ? (
        <>
          <p style={styles.label}>HOW IT IS PLAYED</p>
          <p style={styles.howToPlay}>
            <Highlight text={howToPlay} query={query} />
          </p>
        </>
      ) : null}

      <EntryFacts
        players={players}
        materials={materials}
        occasion={occasion}
        place={place}
        query={query}
      />
      <WatchLink url={youtubeUrl} />
      <EntryCredit contributor={contributor} source={source} query={query} />
    </article>
  );
}
