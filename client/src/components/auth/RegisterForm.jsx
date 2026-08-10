// src/components/auth/RegisterForm.jsx

import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  User,
} from "lucide-react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

/*
 * ---------------------------------------------------------
 * Registration Validation Schema
 * ---------------------------------------------------------
 *
 * This schema defines what valid registration data looks like.
 */
const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters"),

    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /[A-Z]/,
        "Password must contain at least one uppercase letter"
      )
      .regex(
        /[0-9]/,
        "Password must contain at least one number"
      ),

    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),

    terms: z
      .boolean()
      .refine((value) => value === true, {
        message: "You must accept the terms and conditions",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function RegisterForm({
  onSubmit,
  loading = false,
  serverError = "",
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),

    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      {/* Server Error */}
      {serverError && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
        >
          {serverError}
        </div>
      )}

      {/* Full Name */}
      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Full name
        </label>

        <div className="relative">
          <User
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Muhammad Talha"
            className={`w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
              errors.name
                ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
            }`}
            {...register("name")}
          />
        </div>

        {errors.name && (
          <p className="mt-2 text-sm text-red-600">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email */}
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

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Password
        </label>

        <div className="relative">
          <LockKeyhole
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Create a password"
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
              showPassword ? "Hide password" : "Show password"
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

        <p className="mt-2 text-xs text-slate-500">
          Use at least 8 characters, one uppercase letter, and one
          number.
        </p>
      </div>

      {/* Confirm Password */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Confirm password
        </label>

        <div className="relative">
          <LockKeyhole
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Repeat your password"
            className={`w-full rounded-xl border bg-white py-3 pl-10 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
              errors.confirmPassword
                ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
            }`}
            {...register("confirmPassword")}
          />

          <button
            type="button"
            aria-label={
              showConfirmPassword
                ? "Hide confirmed password"
                : "Show confirmed password"
            }
            onClick={() =>
              setShowConfirmPassword((current) => !current)
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showConfirmPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>

        {errors.confirmPassword && (
          <p className="mt-2 text-sm text-red-600">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Terms */}
      <div>
        <label className="flex cursor-pointer items-start gap-3">
          <span className="relative mt-0.5 flex">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              {...register("terms")}
            />
          </span>

          <span className="text-sm leading-5 text-slate-600">
            I agree to the{" "}
            <Link
              to="/terms"
              className="font-medium text-blue-600 hover:text-blue-700"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              className="font-medium text-blue-600 hover:text-blue-700"
            >
              Privacy Policy
            </Link>
            .
          </span>
        </label>

        {errors.terms && (
          <p className="mt-2 text-sm text-red-600">
            {errors.terms.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          "Creating account..."
        ) : (
          <>
            <Check size={18} />
            Create account
          </>
        )}
      </button>
    </form>
  );
}

export default RegisterForm;