// src/components/auth/LoginForm.jsx

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  LogIn,
  Mail,
} from "lucide-react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

/*
 * ---------------------------------------------------------
 * Login Validation Schema
 * ---------------------------------------------------------
 *
 * Login only requires:
 *
 * 1. Email
 * 2. Password
 */
const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required"),
});


/*
 * ---------------------------------------------------------
 * Login Form
 * ---------------------------------------------------------
 *
 * Props:
 *
 * onSubmit
 *   Function provided by LoginPage.
 *   Responsible for calling the backend API.
 *
 * loading
 *   Controlled by LoginPage while the API request is running.
 *
 * serverError
 *   Error returned from the backend.
 */
function LoginForm({
  onSubmit,
  loading = false,
  serverError = "",
}) {
  const [showPassword, setShowPassword] = useState(false);

  /*
   * -------------------------------------------------------
   * React Hook Form
   * -------------------------------------------------------
   */
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });


  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >

      {/* -------------------------------------------------
          Server Error
      -------------------------------------------------- */}

      {serverError && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
        >
          {serverError}
        </div>
      )}


      {/* -------------------------------------------------
          Email
      -------------------------------------------------- */}

      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Email address
        </label>

        <div className="relative">

          <Mail
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={`w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
              errors.email
                ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
            }`}
            {...register("email")}
          />

        </div>

        {errors.email && (
          <p className="mt-2 text-sm text-red-600">
            {errors.email.message}
          </p>
        )}
      </div>


      {/* -------------------------------------------------
          Password
      -------------------------------------------------- */}

      <div>

        <div className="mb-2 flex items-center justify-between">

          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-700"
          >
            Password
          </label>

          <Link
            to="/forgot-password"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Forgot password?
          </Link>

        </div>


        <div className="relative">

          <LockKeyhole
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />


          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            className={`w-full rounded-xl border bg-white py-3 pl-10 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
              errors.password
                ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
            }`}
            {...register("password")}
          />


          <button
            type="button"
            aria-label={
              showPassword
                ? "Hide password"
                : "Show password"
            }
            onClick={() =>
              setShowPassword((current) => !current)
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>

        </div>


        {errors.password && (
          <p className="mt-2 text-sm text-red-600">
            {errors.password.message}
          </p>
        )}

      </div>


      {/* -------------------------------------------------
          Submit
      -------------------------------------------------- */}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >

        {loading ? (
          "Signing in..."
        ) : (
          <>
            <LogIn size={18} />
            Sign in
          </>
        )}

      </button>

    </form>
  );
}

export default LoginForm;