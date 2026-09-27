import { createClient } from "../lib/supabase/server.js";
import ArchiveSearch from "./ArchiveSearch.js";
import ArchiveNotice from "./ArchiveNotice.js";

// The table's columns are snake_case, the Postgres habit. The components have
// used camelCase since week 3. "khmerTitle:khmer_title" renames a column on
// its way out of Supabase, so nothing downstream of this file has to change.
// owner and created_at are left out on purpose: the page shows neither, and
// whatever is selected here is sent to every visitor's browser.
const COLUMNS =
  "id, title, khmerTitle:khmer_title, description, howToPlay:how_to_play, " +
  "players, materials, occasion, place, contributor, source";

const styles = {
  count: {
    fontFamily: "'Courier New', monospace",
    fontSize: 14,
    color: "#2EE6A8",
    marginTop: 48,
  },
};

// An async Server Component: the query runs on the server, never in the
// browser. While it is out, app/page.js shows the "loading" notice in its
// place (that is what the <Suspense> around it is for).
export default async function ArchiveEntries() {
  const supabase = await createClient();
  const { data: entries, error } = await supabase
    .from("entries")
    .select(COLUMNS)
    .order("created_at", { ascending: false })
    // supabase-js already retries a failed read three times (after 1s, 2s,
    // 4s), so an asleep project gives up in about 7 seconds on its own. A
    // database that hangs instead of failing never would. This caps it at 8.
    .abortSignal(AbortSignal.timeout(8000));

  // Asleep, unreachable, too slow, or refused. Do not let that fall through
  // to "0 games": an empty archive and an unreachable one are different news.
  if (error) {
    console.error("entries query failed:", error.message);
    return <ArchiveNotice kind="unavailable" />;
  }
  if (entries.length === 0) return <ArchiveNotice kind="empty" />;

  return (
    <>
      <p style={styles.count}>
        games in the archive: {entries.length} (for now)
      </p>
      <ArchiveSearch entries={entries} />
    </>
  );
}
