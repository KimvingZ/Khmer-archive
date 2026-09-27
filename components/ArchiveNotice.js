const KHMER_STACK =
  "'Noto Sans Khmer', 'Khmer OS Battambang', 'Khmer OS', 'Leelawadee UI', 'Nokora', sans-serif";

// What stands where the games would be when there are no games to show.
// Bilingual and dashed like NoResults, so it reads as the archive talking,
// not the framework. Rewrite the wording here whenever the archive's voice
// changes.
const MESSAGES = {
  loading: {
    khmer: "កំពុងផ្ទុកល្បែង…",
    english: "Loading the games…",
  },
  empty: {
    khmer: "មិនទាន់មានល្បែងនៅក្នុងបណ្ណសារនេះនៅឡើយទេ។",
    english: "No games in this archive yet.",
  },
  unavailable: {
    khmer: "មិនអាចផ្ទុកល្បែងបានទេនៅពេលនេះ។ សូមព្យាយាមម្ដងទៀតនៅពេលក្រោយ។",
    english: "The games could not be loaded just now. Please try again later.",
  },
};

const styles = {
  box: {
    marginTop: 48,
    padding: "32px 24px",
    border: "1px dashed #2E3644",
    borderRadius: 10,
    textAlign: "center",
  },
  khmer: {
    fontFamily: KHMER_STACK,
    fontSize: 17,
    lineHeight: 1.9,
    color: "#C7CEDA",
    margin: "0 0 14px",
  },
  english: { fontSize: 15, color: "#97A1B3", lineHeight: 1.6, margin: 0 },
};

// role="status" lets a screen reader announce the change without stealing
// focus: "loading" first, then whichever notice replaces it.
export default function ArchiveNotice({ kind }) {
  const { khmer, english } = MESSAGES[kind];

  return (
    <div role="status" style={styles.box}>
      <p lang="km" style={styles.khmer}>
        {khmer}
      </p>
      <p style={styles.english}>{english}</p>
    </div>
  );
}
