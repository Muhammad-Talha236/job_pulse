// src/components/landing/CTASection.jsx

import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

function CTASection() {
  return (
    <section className="bg-slate-950 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 px-6 py-16 text-center shadow-2xl sm:px-12 lg:px-20">

          {/* Decorative Background */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
          >
            <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />

            <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-indigo-600/10 blur-3xl" />
          </div>

          {/* Content */}
          <div className="relative mx-auto max-w-3xl">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300">
              <Sparkles size={16} />

              Start your job search smarter
            </div>

            {/* Heading */}
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Ready to find your next opportunity?
            </h2>

            {/* Description */}
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              Spend less time searching and more time applying to
              opportunities that actually match your goals.
            </p>

            {/* CTA */}
            <div className="mt-8">
              <Link
                to="/login"
                className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-xl"
              >
                Start Finding Jobs

                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;