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
      description="Enter your account's email and we'll send you a link to set a new password."
      altText="Remembered it?"
      altHref="/login"
      altLabel="Log in"
    >
      <ForgotForm notice={NOTICES.get(link)} />
    </AuthPage>
  );
}
