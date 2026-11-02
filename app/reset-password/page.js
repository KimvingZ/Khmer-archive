import { redirect } from "next/navigation";
import collection from "../../collection.config.js";
import { createClient } from "../../lib/supabase/server.js";
import AuthPage from "../../components/AuthPage.js";
import ResetForm from "../../components/ResetForm.js";

export const metadata = { title: `New password — ${collection.name}` };

// The session the email link left behind is what lets the password change.
// Without one there is nothing this page can do, so it says how to get one.
export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/forgot-password?link=expired");

  return (
    <AuthPage
      title="New password"
      description="Choose the password you'll log in with from now on."
      altText="Changed your mind?"
      altHref="/"
      altLabel="Back to the games"
    >
      <ResetForm />
    </AuthPage>
  );
}
