import Link from "next/link";
import collection from "../../collection.config.js";
import { createClient } from "../../lib/supabase/server.js";
import { STATUS_LABELS } from "../../lib/review.js";
import PageShell from "../../components/PageShell.js";
import LoginNote from "../../components/LoginNote.js";
import ArchiveNotice from "../../components/ArchiveNotice.js";

export const metadata = { title: `My games — ${collection.name}` };

const styles = {
  list: { listStyle: "none", padding: 0, margin: "32px 0 0" },
  item: { padding: "16px 0", borderBottom: "1px solid #2E3644" },
  khmer: {
    fontFamily: "'Noto Sans Khmer', 'Khmer OS Battambang', 'Khmer OS', 'Leelawadee UI', 'Nokora', sans-serif",
    fontSize: 18,
    lineHeight: 1.6,
    color: "#2EE6A8",
    margin: 0,
  },
  title: { fontSize: 17, fontWeight: 700, color: "#E8EDF2" },
  status: { fontFamily: "'Courier New', monospace", fontSize: 12, margin: "6px 0 0" },
  none: { marginTop: 32, fontSize: 16, color: "#97A1B3" },
  link: { color: "#2EE6A8" },
};

// Green for published, amber for "read this, it is not finished".
const COLORS = { published: "#2EE6A8", pending: "#97A1B3", returned: "#C9A227" };

// Every game the logged-in person added, and where it is in review. The home
// page only lists published games, so this is where a contributor finds one
// that is still waiting, or one the reviewer sent back.
export default async function MyGamesPage() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();

  let body = <LoginNote action="see the games you added" />;
  if (auth.user) {
    const { data: entries, error } = await supabase
      .from("entries")
      .select("id, title, khmerTitle:khmer_title, status")
      // The reviewer can read every game; this page is only your own.
      .eq("owner", auth.user.id)
      .order("created_at", { ascending: false })
      .abortSignal(AbortSignal.timeout(8000));

    if (error) body = <ArchiveNotice kind="unavailable" />;
    else if (entries.length === 0) {
      body = (
        <p style={styles.none}>
          You haven't added a game yet. <Link href="/contribute" style={styles.link}>Add one</Link>.
        </p>
      );
    } else {
      body = (
        <ul style={styles.list}>
          {entries.map((entry) => (
            <li key={entry.id} style={styles.item}>
              <p lang="km" style={styles.khmer}>{entry.khmerTitle}</p>
              <Link href={`/entries/${entry.id}`} style={styles.title}>{entry.title}</Link>
              <p style={{ ...styles.status, color: COLORS[entry.status] }}>{STATUS_LABELS[entry.status]}</p>
            </li>
          ))}
        </ul>
      );
    }
  }

  return (
    <PageShell kicker="MY GAMES" title="My games" description="The games you added, and whether each one is published yet.">
      {body}
    </PageShell>
  );
}
