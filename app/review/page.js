import collection from "../../collection.config.js";
import { createClient } from "../../lib/supabase/server.js";
import { CARD_COLUMNS } from "../../lib/entryColumns.js";
import { isReviewer } from "../../lib/review.js";
import PageShell from "../../components/PageShell.js";
import LoginNote from "../../components/LoginNote.js";
import ArchiveNotice from "../../components/ArchiveNotice.js";
import EntryCard from "../../components/EntryCard.js";
import ReviewButtons from "../../components/ReviewButtons.js";

export const metadata = { title: `Review queue — ${collection.name}` };

const styles = {
  note: { marginTop: 40, fontSize: 16, color: "#C9A227", lineHeight: 1.6 },
  empty: { marginTop: 40, fontSize: 16, color: "#97A1B3", lineHeight: 1.6 },
};

// The reviewer's queue: every game waiting for review, oldest first, each
// with Publish and Return. Checking for a reviewer on this page is manners.
// The lock is the database: anyone else who asks Supabase for these games
// gets nothing back, and a publish from anyone else is refused.
export default async function ReviewPage() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();

  let body;
  if (!auth.user) body = <LoginNote action="review games" />;
  else if (!(await isReviewer(supabase, auth.user.id))) {
    body = <p style={styles.note}>មានតែអ្នកពិនិត្យបណ្ណសារប៉ុណ្ណោះ ដែលអាចបើកបញ្ជីនេះបាន · Only the archive's reviewer can open the review queue.</p>;
  } else body = await waitingGames(supabase);

  return (
    <PageShell kicker="REVIEW" title="Review queue" description="Games contributors have added or changed. Publish one to put it in the archive, or return it with a note saying what to fix.">
      {body}
    </PageShell>
  );
}

// Not a component: the reviewer's list, fetched on the server like the home page's.
async function waitingGames(supabase) {
  const { data: entries, error } = await supabase
    .from("entries")
    .select(CARD_COLUMNS)
    .eq("status", "pending")
    .order("created_at", { ascending: true })
    .abortSignal(AbortSignal.timeout(8000));

  if (error) {
    console.error("review queue failed:", error.message);
    return <ArchiveNotice kind="unavailable" />;
  }
  if (entries.length === 0) {
    return <p style={styles.empty}>គ្មានល្បែងណារង់ចាំការពិនិត្យទេ · Nothing is waiting for review.</p>;
  }
  return entries.map((entry) => (
    <div key={entry.id}>
      <EntryCard {...entry} link />
      <ReviewButtons id={entry.id} />
    </div>
  ));
}
