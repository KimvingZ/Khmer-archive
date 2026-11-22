import collection from "../../collection.config.js";
import AuthPage from "../../components/AuthPage.js";
import SignupForm from "../../components/SignupForm.js";

export const metadata = { title: `Sign up — ${collection.name}` };

export default function SignupPage() {
  return (
    <AuthPage
      title="Sign up"
      description="សូមបង្កើតគណនី ដើម្បីបន្ថែមល្បែងទៅក្នុងគេហទំព័រ។ ល្បែងនីមួយៗដែលអ្នកបន្ថែមត្រូវបានភ្ជាប់ជាមួយគណនីរបស់អ្នក ហើយមានតែអ្នកប៉ុណ្ណោះដែលអាចកែប្រែ ឬលុបវាបាន · Create an account to add games to the archive. Every game you add is linked to your account, and only you can edit or delete it."
      altText="Already have an account? · មានគណនីរួចហើយ?"
      altHref="/login"
      altLabel="Log in · ចូលគណនី"
    >
      <SignupForm />
    </AuthPage>
  );
}
