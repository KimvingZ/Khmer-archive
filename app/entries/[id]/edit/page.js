import Link from "next/link";
import { notFound } from "next/navigation";
import collection from "../../../../collection.config.js";
import { createClient } from "../../../../lib/supabase/server.js";
import PageShell from "../../../../components/PageShell.js";
import EntryForm from "../../../../components/EntryForm.js";
import LoginNote from "../../../../components/LoginNote.js";
import ArchiveNotice from "../../../../components/ArchiveNotice.js";

export const metadata = { title: `Edit a game — ${collection.name}` };

// The form uses the table's own column names, so the saved values drop
// straight into it.
const COLUMNS =
  "id, owner, title, khmer_title, description, how_to_play, players, materials, " +
  "occasion, place, contributor, source, photo_url, youtube_url";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const styles = {
  back: { display: "inline-block", marginTop: 24, fontSize: 15, color: "#2EE6A8" },
  note: { marginTop: 40, fontSize: 16, color: "#C9A227", lineHeight: 1.6 },
};

// The same form as /contribute, filled in. Only the owner gets it; the page
// telling anyone else no is manners, and the update policy is the lock.
export default async function EditEntryPage({ params }) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();

  const supabase = await createClient();
  const [{ data: entry, error }, { data: auth }] = await Promise.all([
    supabase.from("entries").select(COLUMNS).eq("id", id).abortSignal(AbortSignal.timeout(8000)).maybeSingle(),
    supabase.auth.getUser(),
  ]);
  if (error) console.error("entry query failed:", error.message);
  else if (!entry) notFound();

  // owner stays here: the form gets every saved value except that one.
  const { owner, ...saved } = entry || {};
  let body;
  if (!entry) body = <ArchiveNotice kind="unavailable" />;
  else if (!auth.user) body = <LoginNote action="edit this game" />;
  else if (auth.user.id !== owner) body = <p style={styles.note}>Only the person who added this game can edit it.</p>;
  else body = <EntryForm entry={saved} />;

  return (
    <PageShell kicker="EDIT" title={entry ? `Edit ${entry.title}` : "Edit a game"}>
      <Link href={`/entries/${id}`} style={styles.back}>
        ← Back to the game
      </Link>
      {body}
    </PageShell>
  );
}
