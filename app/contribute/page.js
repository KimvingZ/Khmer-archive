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
      description="ការបញ្ចូលនីមួយៗសម្រាប់ល្បែងតែមួយ ដោយរៀបរាប់តាមរបៀបដែលគេលេងនៅកន្លែងដែលអ្នកបានរៀន និងមានរូបថតមួយ។ អ្នកពិនិត្យគេហទំព័រអានល្បែងថ្មីនីមួយៗជាមុនសិន ហើយអ្នកទស្សនាឃើញវាបានតែបន្ទាប់ពីវាត្រូវបានផ្សាយ · Add one game per entry, described as it is played where you learned it, with a photo. The archive's reviewer reads each new game first, and visitors see it only after it is published."
    >
      {data.user ? <EntryForm /> : <LoginNote action="add a game" />}
    </PageShell>
  );
}
