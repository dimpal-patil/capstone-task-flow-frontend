import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import { Button, Input, ErrorAlert } from "../components/ui/primitives";
import ThemeToggle from "../components/ui/ThemeToggle";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const data = await loginUser(email, password);

      auth?.login(data.token);

      navigate("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Login failed");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-700 via-brand-800 to-indigo-900 px-4 py-10 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 border-t-4 border-t-brand-600 bg-white dark:border-slate-700 dark:bg-slate-900 p-6 shadow-2xl shadow-slate-900/20 dark:shadow-slate-950/70 sm:p-9">
        <div className="mb-8 text-center">
          <p className="text-sm font-extrabold tracking-widest text-brand-700">
            TaskFlow
          </p>
          <h1 className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
            Log in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="login-email"
              className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Email
            </label>

            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Password
            </label>

            <div className="relative">
              <Input
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="pr-16"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                onClick={() => setShowPassword((visible) => !visible)}
                className="absolute inset-y-0 right-3 text-xs font-bold text-brand-700 hover:text-brand-900 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <ErrorAlert message={error} />

          <Button type="submit" fullWidth disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Login"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="font-bold text-brand-700 underline-offset-4 transition hover:text-brand-900 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
