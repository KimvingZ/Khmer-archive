import Link from "next/link";
import collection from "../../collection.config.js";
import AuthPage from "../../components/AuthPage.js";
import LoginForm from "../../components/LoginForm.js";

export const metadata = { title: `Log in — ${collection.name}` };

const styles = {
  forgot: { fontSize: 15, marginTop: 20 },
  link: { color: "#2EE6A8" },
};

// What /auth/confirm sends along in ?link=. A Map rather than an object: the
// value comes from the address bar, and a plain object would answer
// ?link=constructor with something that isn't a sentence.
const NOTICES = new Map([
  ["confirmed", "បានបញ្ជាក់អ៊ីមែលរបស់អ្នកហើយ។ សូមចូលគណនី · Your email is confirmed. Log in to start adding games."],
  ["expired", "តំណនេះផុតកំណត់ ឬបានប្រើរួចហើយ។ សូមសាកល្បងចូលគណនី។ បើនៅតែមិនបាន សូមបង្កើតគណនីម្ដងទៀតដោយប្រើអ៊ីមែលដដែល ដើម្បីទទួលតំណថ្មី · That link has expired or was already used. Try logging in. If that doesn't work, sign up again with the same email to get a new link."],
]);

export default async function LoginPage({ searchParams }) {
  const { link } = await searchParams;

  return (
    <AuthPage
      title="Log in"
      description="សូមចូលគណនី ដើម្បីបន្ថែមល្បែង និងគ្រប់គ្រងល្បែងដែលអ្នកបានបន្ថែម · Log in to add a game and to manage the games you have added."
      altText="Do not have an account yet? · មិនទាន់មានគណនី?"
      altHref="/signup"
      altLabel="Sign up · ចុះឈ្មោះ"
    >
      <LoginForm notice={NOTICES.get(link)} />
      <p style={styles.forgot}>
        <Link href="/forgot-password" style={styles.link}>
          Forgot your password? · ភ្លេចពាក្យសម្ងាត់?
        </Link>
      </p>
    </AuthPage>
  );
}
