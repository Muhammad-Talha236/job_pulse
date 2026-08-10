// src/pages/LoginPage.jsx

import { ArrowLeft, Zap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import { loginUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

import LoginForm from "../components/auth/LoginForm";

function LoginPage() {
  const navigate = useNavigate();

  /*
   * Get the login function from AuthContext.
   *
   * AuthContext is now responsible for:
   * - storing the token
   * - storing the user
   * - updating React authentication state
   */
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  /*
   * ---------------------------------------------------------
   * Login Submit Handler
   * ---------------------------------------------------------
   */
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setServerError("");

      /*
       * Send credentials to backend.
       */
      const response = await loginUser(data);

      console.log("Login successful:", response);

      /*
       * Give the authentication response to AuthContext.
       *
       * AuthContext now handles:
       * - token
       * - user
       * - localStorage
       * - React authentication state
       */
      login(response);

      /*
       * Navigate to dashboard after authentication.
       */
      navigate("/dashboard");

    } catch (error) {
      console.error("Login failed:", error);

      const message =
        error.response?.data?.message ||
        "Unable to sign in. Please try again.";

      setServerError(message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4 sm:p-6">

      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl lg:grid-cols-2">

        {/* =================================================
            Left Side
        ================================================== */}

        <section className="relative hidden overflow-hidden bg-slate-950 p-12 lg:flex lg:flex-col lg:justify-between">

          {/* Decorative Background */}

          <div
            aria-hidden="true"
            className="absolute inset-0"
          >
            <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />

            <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl" />
          </div>


          {/* Brand */}

          <div className="relative">

            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xl font-bold text-white"
            >

              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
                <Zap size={21} />
              </span>

              <span>
                Job<span className="text-blue-400">Pulse</span>
              </span>

            </Link>

          </div>


          {/* Message */}

          <div className="relative max-w-lg">

            <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
              Welcome back
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">
              Continue your smarter job search.
            </h1>

            <p className="mt-5 text-base leading-7 text-slate-300">
              Sign in to manage your opportunities, track
              applications, and keep your job search organized
              in one focused workspace.
            </p>

          </div>


          {/* Bottom */}

          <p className="relative text-sm text-slate-500">
            Discover smarter. Apply faster.
          </p>

        </section>


        {/* =================================================
            Right Side
        ================================================== */}

        <section className="flex items-center p-6 sm:p-10 lg:p-12">

          <div className="mx-auto w-full max-w-md">

            {/* Mobile Logo */}

            <div className="mb-8 lg:hidden">

              <Link
                to="/"
                className="inline-flex items-center gap-2 text-xl font-bold text-slate-900"
              >

                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <Zap size={19} />
                </span>

                <span>
                  Job<span className="text-blue-600">Pulse</span>
                </span>

              </Link>

            </div>


            {/* Header */}

            <div>

              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Welcome back
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Sign in to continue to your JobPulse workspace.
              </p>

            </div>


            {/* Form */}

            <div className="mt-8">

              <LoginForm
                onSubmit={onSubmit}
                loading={loading}
                serverError={serverError}
              />

            </div>


            {/* Register */}

            <p className="mt-8 text-center text-sm text-slate-600">

              Don't have an account?{" "}

              <Link
                to="/register"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Create an account
              </Link>

            </p>


            {/* Back */}

            <div className="mt-6 text-center">

              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
              >

                <ArrowLeft size={16} />

                Back to home

              </Link>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}

export default LoginPage;