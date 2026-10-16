const styles = {
  mark: {
    backgroundColor: "#2EE6A8",
    color: "#0E1116",
    borderRadius: 3,
    padding: "0 2px",
    fontWeight: 600,
  },
};

// A Khmer syllable is several characters: a consonant, then vowel signs and
// marks, and a subscript consonant after a coeng (្). A <mark> that stops in
// the middle of one makes the browser draw it in broken pieces, so every
// match is widened to whole syllables before it is marked.
const KHMER_SIGN = /[\u17B4-\u17D3\u17DD]/;
const COENG = "\u17D2";
const insideSyllable = (text, i) => KHMER_SIGN.test(text[i] || "") || text[i - 1] === COENG;

// Marks every occurrence of the search word inside one piece of text. It does
// not decide what matched — ArchiveSearch already did that. This only shows
// the reader where, so a hit buried in a paragraph stops looking like magic.
export default function Highlight({ text, query }) {
  const value = String(text || "");
  const needle = String(query || "").trim().toLowerCase();
  if (!needle) return <>{value}</>;

  // indexOf, not a regex: a visitor typing "(" or "*" would break a regex
  // built out of their own input, and escaping that costs more than this loop.
  // Safe on Khmer for the same reason the search is — toLowerCase leaves Khmer
  // untouched, so positions found here still line up with the original string.
  const haystack = value.toLowerCase();
  const parts = [];
  let cursor = 0;
  let at = haystack.indexOf(needle);

  while (at !== -1) {
    let start = at;
    let end = at + needle.length;
    while (start > cursor && insideSyllable(value, start)) start--;
    while (end < value.length && insideSyllable(value, end)) end++;
    if (start > cursor) parts.push(value.slice(cursor, start));
    parts.push(
      <mark key={start} style={styles.mark}>
        {value.slice(start, end)}
      </mark>
    );
    cursor = end;
    at = haystack.indexOf(needle, cursor);
  }
  parts.push(value.slice(cursor));

  return <>{parts}</>;
}
