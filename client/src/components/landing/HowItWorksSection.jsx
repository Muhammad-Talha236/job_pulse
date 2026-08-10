// src/components/landing/HowItWorksSection.jsx

import {
  ArrowRight,
  Database,
  Search,
  SlidersHorizontal,
} from "lucide-react";

const steps = [
  {
    id: 1,
    icon: Search,
    title: "Discover Opportunities",
    description:
      "JobPulse collects opportunities from supported job sources so you don't have to search each platform manually.",
  },
  {
    id: 2,
    icon: Database,
    title: "Process & Organize",
    description:
      "Collected information is cleaned, structured, and organized so different job sources can be viewed consistently.",
  },
  {
    id: 3,
    icon: SlidersHorizontal,
    title: "Find Your Matches",
    description:
      "Search, filter, and organize opportunities based on the skills, roles, and preferences that matter to you.",
  },
];

function HowItWorksSection() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">

          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            How It Works
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            From scattered opportunities to one workspace
          </h2>

          <p className="mt-4 text-lg leading-8 text-slate-600">
            JobPulse simplifies the journey from discovering a job to
            deciding whether it's worth applying for.
          </p>

        </div>

        {/* Steps */}
        <div className="relative mt-16">

          {/* Connecting Line */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-16 hidden h-px w-2/3 -translate-x-1/2 bg-slate-200 lg:block"
          />

          <div className="relative grid gap-12 lg:grid-cols-3 lg:gap-8">

            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.id}
                  className="relative flex flex-col items-center text-center"
                >

                  {/* Step Number / Icon */}
                  <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-100 bg-white text-blue-600 shadow-sm">
                    <Icon size={26} />
                  </div>

                  {/* Step Number */}
                  <span className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                    Step {String(step.id).padStart(2, "0")}
                  </span>

                  {/* Title */}
                  <h3 className="mt-3 text-xl font-semibold text-slate-900">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">
                    {step.description}
                  </p>

                </article>
              );
            })}

          </div>
        </div>

        {/* Bottom Message */}
        <div className="mx-auto mt-16 flex max-w-2xl items-center justify-center gap-2 text-sm font-medium text-slate-500">
          <span>
            One workspace. Less searching. More opportunities.
          </span>

          <ArrowRight size={16} />
        </div>

      </div>
    </section>
  );
}

export default HowItWorksSection;