// src/components/landing/HeroSection.jsx

import { ArrowRight, Search, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-slate-950">
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
      >
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-indigo-600/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-4xl text-center">

          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300">
            <Sparkles size={16} />

            Intelligent Job Discovery
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Find the right jobs.
            <span className="block text-blue-500">
              Before everyone else.
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
            JobPulse brings job opportunities from multiple platforms into
            one intelligent workspace so you can discover, track, and act
            faster.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">

            <Link
              to="/login"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-xl sm:w-auto"
            >
              <Search size={18} />

              Start Finding Jobs

              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <a
              href="#features"
              className="inline-flex w-full items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-6 py-3.5 text-sm font-semibold text-slate-200 transition-colors hover:border-slate-600 hover:bg-slate-800 sm:w-auto"
            >
              Explore Features
            </a>

          </div>

          {/* Trust Message */}
          <p className="mt-8 text-sm text-slate-500">
            Built for developers, freelancers, and modern job seekers.
          </p>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;