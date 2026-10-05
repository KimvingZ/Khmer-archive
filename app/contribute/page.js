import collection from "../../collection.config.js";
import { createClient } from "../../lib/supabase/server.js";
import PageShell from "../../components/PageShell.js";
import EntryForm from "../../components/EntryForm.js";
import LoginNote from "../../components/LoginNote.js";

export const metadata = { title: `Add a game — ${collection.name}` };

// Only a logged-in contributor gets the form. Hiding it is manners, not
// security: the insert policy refuses a logged-out write either way.
export default async function ContributePage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  return (
    <PageShell
      kicker="CONTRIBUTE"
      title="Add a game"
      description="One game per entry, described the way it is played where you learned it, with a photo."
    >
      {data.user ? <EntryForm /> : <LoginNote action="add a game" />}
    </PageShell>
  );
}
