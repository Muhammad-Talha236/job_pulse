// src/pages/LoginPage.jsx

import { ArrowLeft, Zap } from "lucide-react";
import { Link } from "react-router-dom";

import LoginForm from "../components/auth/LoginForm";

function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-4 py-12 sm:px-6 lg:px-8">

        <div className="grid w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl lg:grid-cols-2">

          {/* Left Side - Branding */}
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
                Your next opportunity is waiting.
              </h1>

              <p className="mt-5 text-base leading-7 text-slate-300">
                Sign in to continue discovering, organizing, and tracking
                opportunities from your job search workspace.
              </p>

            </div>

            {/* Bottom Message */}
            <p className="relative text-sm text-slate-500">
              Discover smarter. Apply faster.
            </p>

          </section>

          {/* Right Side - Login */}
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
                  Sign in to your JobPulse account to continue.
                </p>

              </div>

              {/* Form */}
              <div className="mt-8">
                <LoginForm />
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

              {/* Back to Home */}
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

      </div>
    </main>
  );
}

export default LoginPage;