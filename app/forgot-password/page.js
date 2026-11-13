import collection from "../../collection.config.js";
import AuthPage from "../../components/AuthPage.js";
import ForgotForm from "../../components/ForgotForm.js";

export const metadata = { title: `Forgot password — ${collection.name}` };

// What /auth/reset and /reset-password send along in ?link=. A Map for the
// same reason as on /login: the value comes from the address bar.
const NOTICES = new Map([
  ["expired", "តំណនេះផុតកំណត់ ឬបានប្រើរួចហើយ។ សូមស្នើតំណថ្មីខាងក្រោម · That link has expired or was already used. Ask for a new one below."],
  ["other-browser", "តំណនេះដំណើរការតែក្នុង browser ដែលបានស្នើវាប៉ុណ្ណោះ។ សូមស្នើតំណថ្មីនៅទីនេះ រួចបើកអ៊ីមែលក្នុង browser ដដែលនេះ · A reset link only works in the browser that asked for it. Ask for a new one here, then open the email in this browser."],
]);

export default async function ForgotPasswordPage({ searchParams }) {
  const { link } = await searchParams;

  return (
    <AuthPage
      title="Forgot password"
      description="សូមបញ្ចូលអ៊ីមែលនៃគណនីរបស់អ្នក ដើម្បីទទួលតំណសម្រាប់កំណត់ពាក្យសម្ងាត់ថ្មី · Enter the email address of your account to receive a link for setting a new password."
      altText="Remembered your password? · នឹកឃើញពាក្យសម្ងាត់វិញហើយ?"
      altHref="/login"
      altLabel="Log in · ចូលគណនី"
    >
      <ForgotForm notice={NOTICES.get(link)} />
    </AuthPage>
  );
}
