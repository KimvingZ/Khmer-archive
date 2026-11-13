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
      description="សូមជ្រើសរើសពាក្យសម្ងាត់ថ្មីសម្រាប់គណនីរបស់អ្នក · Choose a new password for your account."
      altText="Keep your current password? · រក្សាពាក្យសម្ងាត់ដដែល?"
      altHref="/"
      altLabel="Back to the games · ត្រឡប់ទៅល្បែងវិញ"
    >
      <ResetForm />
    </AuthPage>
  );
}
