import collection from "../../collection.config.js";
import AuthPage from "../../components/AuthPage.js";
import LoginForm from "../../components/LoginForm.js";

export const metadata = { title: `Log in — ${collection.name}` };

export default function LoginPage() {
  return (
    <AuthPage
      title="Log in"
      description="Welcome back. The games you describe stay attached to the name you signed up with."
      altText="No account yet?"
      altHref="/signup"
      altLabel="Sign up"
    >
      <LoginForm />
    </AuthPage>
  );
}
