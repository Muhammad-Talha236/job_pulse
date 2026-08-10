// src/components/landing/FeaturesSection.jsx

import {
  Bell,
  Bookmark,
  Search,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

import FeatureCard from "./FeatureCard";

/*
 * Feature data
 *
 * Keeping the content separate from the UI
 * makes the component easier to maintain.
 */
const features = [
  {
    id: 1,
    icon: Search,
    title: "Unified Job Search",
    description:
      "Discover opportunities from multiple job platforms through one clean and focused workspace.",
  },
  {
    id: 2,
    icon: Zap,
    title: "Fast Job Discovery",
    description:
      "Reduce the time spent checking different websites by bringing relevant opportunities together.",
  },
  {
    id: 3,
    icon: Target,
    title: "Smart Matching",
    description:
      "Organize opportunities around your skills, preferences, and career goals.",
  },
  {
    id: 4,
    icon: Bell,
    title: "Job Alerts",
    description:
      "Stay informed when new opportunities matching your preferences become available.",
  },
  {
    id: 5,
    icon: Sparkles,
    title: "AI Assistance",
    description:
      "Use AI-powered tools to understand job descriptions and make better application decisions.",
  },
  {
    id: 6,
    icon: Bookmark,
    title: "Save Opportunities",
    description:
      "Keep interesting jobs organized so you can return to them when you're ready to apply.",
  },
];

function FeaturesSection() {
  return (
    <section
      id="features"
      className="bg-slate-50 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">

          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Powerful Features
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Everything you need to find jobs faster
          </h2>

          <p className="mt-4 text-lg leading-8 text-slate-600">
            JobPulse brings discovery, organization, and intelligent
            assistance together in one workspace.
          </p>

        </div>

        {/* Feature Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard
              key={feature.id}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

export default FeaturesSection;