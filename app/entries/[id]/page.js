import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "../../../lib/supabase/server.js";
import { CARD_COLUMNS } from "../../../lib/entryColumns.js";
import EntryCard from "../../../components/EntryCard.js";
import ArchiveNotice from "../../../components/ArchiveNotice.js";
import OwnerActions from "../../../components/OwnerActions.js";

// Entry ids are uuids. Anything else can't be one, so it is a 404 without
// asking the database.
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const styles = {
  wrap: { maxWidth: 720, margin: "0 auto", padding: "48px 24px 80px" },
  back: {
    fontFamily: "'Courier New', monospace",
    fontSize: 13,
    color: "#2EE6A8",
    textDecoration: "none",
  },
};

// One game on its own page: where a card's title leads, and where the form
// sends you after a save.
export default async function EntryPage({ params }) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();

  const supabase = await createClient();
  const [{ data: entry, error }, { data: auth }] = await Promise.all([
    supabase
      .from("entries")
      .select(`${CARD_COLUMNS}, owner`)
      .eq("id", id)
      .abortSignal(AbortSignal.timeout(8000))
      .maybeSingle(),
    supabase.auth.getUser(),
  ]);

  // Unreachable is not the same news as "no such game".
  if (error) console.error("entry query failed:", error.message);
  else if (!entry) notFound();

  // owner is only compared here, on the server. It is not passed on to
  // anything that renders, so it never reaches the browser.
  const { owner, ...shown } = entry || {};
  const isOwner = Boolean(entry && auth.user && auth.user.id === owner);

  return (
    <main style={styles.wrap}>
      <Link href="/" style={styles.back}>
        ← All games
      </Link>
      {entry ? <EntryCard {...shown} large /> : <ArchiveNotice kind="unavailable" />}
      {isOwner ? <OwnerActions id={entry.id} /> : null}
    </main>
  );
}
