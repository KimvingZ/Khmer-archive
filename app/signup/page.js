import collection from "../../collection.config.js";
import AuthPage from "../../components/AuthPage.js";
import SignupForm from "../../components/SignupForm.js";

export const metadata = { title: `Sign up — ${collection.name}` };

export default function SignupPage() {
  return (
    <AuthPage
      title="Sign up"
      description="This archive only holds games somebody has actually sat down and described. An account is where your name goes when that somebody is you."
      altText="Already have an account?"
      altHref="/login"
      altLabel="Log in"
    >
      <SignupForm />
    </AuthPage>
  );
}
