import { useEffect, useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  Code2,
  DollarSign,
  Search,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

const SLIDE_DURATION = 4000;

const heroSlides = [
  {
    id: "upwork",
    platform: "Upwork",
    eyebrow: "Freelance opportunities",
    heading: "Find freelance work that moves you forward.",
    description:
      "Discover projects that match your skills, experience, and goals before the competition gets there.",
    accent: "emerald",
    mainPosition: "left-[58%] top-[58px] rotate-[5deg]",
    mainWidth: "w-[570px]",
    smallPositions: [
      "right-[6%] top-[125px] rotate-[8deg]",
      "left-[9%] bottom-[75px] rotate-[-8deg]",
    ],
  },
  {
    id: "linkedin",
    platform: "LinkedIn",
    eyebrow: "Professional opportunities",
    heading: "Build your next career connection.",
    description:
      "Find relevant roles, companies, and professional opportunities from one intelligent workspace.",
    accent: "blue",
    mainPosition: "right-[8%] top-[72px] rotate-[-5deg]",
    mainWidth: "w-[590px]",
    smallPositions: [
      "left-[5%] top-[115px] rotate-[-8deg]",
      "right-[18%] bottom-[62px] rotate-[7deg]",
    ],
  },
  {
    id: "indeed",
    platform: "Indeed",
    eyebrow: "Jobs that fit you",
    heading: "Find jobs that fit your future.",
    description:
      "Stop searching endlessly. JobPulse brings relevant opportunities together and helps you act faster.",
    accent: "cyan",
    mainPosition: "left-[55%] top-[95px] rotate-[4deg]",
    mainWidth: "w-[610px]",
    smallPositions: [
      "right-[5%] top-[100px] rotate-[9deg]",
      "left-[8%] bottom-[70px] rotate-[-6deg]",
    ],
  },
  {
    id: "fiverr",
    platform: "Fiverr",
    eyebrow: "Freelance marketplace",
    heading: "Turn your skills into opportunities.",
    description:
      "Discover freelance work where your expertise can create real impact and new income.",
    accent: "green",
    mainPosition: "right-[10%] top-[62px] rotate-[-6deg]",
    mainWidth: "w-[580px]",
    smallPositions: [
      "left-[7%] top-[145px] rotate-[-9deg]",
      "right-[25%] bottom-[58px] rotate-[6deg]",
    ],
  },
  {
    id: "wellfound",
    platform: "Wellfound",
    eyebrow: "Startup opportunities",
    heading: "Find your next big move.",
    description:
      "Discover ambitious startups and high-growth roles built for people who want to grow.",
    accent: "orange",
    mainPosition: "left-[56%] top-[70px] rotate-[6deg]",
    mainWidth: "w-[600px]",
    smallPositions: [
      "right-[6%] top-[125px] rotate-[8deg]",
      "left-[10%] bottom-[60px] rotate-[-7deg]",
    ],
  },
];

const accentStyles = {
  emerald: {
    text: "text-emerald-400",
    bg: "bg-emerald-500",
    soft: "bg-emerald-500/10",
    border: "border-emerald-400/20",
    glow: "bg-emerald-500/10",
  },
  blue: {
    text: "text-blue-400",
    bg: "bg-blue-500",
    soft: "bg-blue-500/10",
    border: "border-blue-400/20",
    glow: "bg-blue-500/10",
  },
  cyan: {
    text: "text-cyan-400",
    bg: "bg-cyan-500",
    soft: "bg-cyan-500/10",
    border: "border-cyan-400/20",
    glow: "bg-cyan-500/10",
  },
  green: {
    text: "text-green-400",
    bg: "bg-green-500",
    soft: "bg-green-500/10",
    border: "border-green-400/20",
    glow: "bg-green-500/10",
  },
  orange: {
    text: "text-orange-400",
    bg: "bg-orange-500",
    soft: "bg-orange-500/10",
    border: "border-orange-400/20",
    glow: "bg-orange-500/10",
  },
};

function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState("next");

  const current = heroSlides[activeIndex];
  const accent = accentStyles[current.accent];

  /*
   * IMPORTANT:
   * This timer is completely independent from hover.
   * So hero ALWAYS changes after 4 seconds.
   */
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection("next");

      setActiveIndex((prev) => (prev + 1) % heroSlides.length);
    }, SLIDE_DURATION);

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index) => {
    setDirection(index > activeIndex ? "next" : "previous");
    setActiveIndex(index);
  };

  return (
    <section className="relative isolate h-[700px] overflow-hidden bg-[#070b14] text-white">
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0">
        {/* Dynamic glow */}
        <div
          key={`glow-${current.id}`}
          className={`absolute left-1/2 top-[-180px] h-[550px] w-[800px] -translate-x-1/2 rounded-full blur-[150px] ${accent.glow} animate-[glowIn_1400ms_ease-out]`}
        />

        <div className="absolute bottom-[-280px] left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-blue-600/[0.025] blur-[150px]" />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(148,163,184,0.35) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(148,163,184,0.35) 1px,
                transparent 1px
              )
            `,
            backgroundSize: "60px 60px",
            maskImage:
              "linear-gradient(to bottom, black 0%, transparent 75%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, transparent 75%)",
          }}
        />

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#070b14_82%)]" />

        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#070b14] to-transparent" />
      </div>

      {/* =====================================================
          FLOATING CARDS
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        {/* Main dashboard */}

        <div
          key={`${current.id}-main`}
          className={`
            absolute z-10
            ${current.mainPosition}
            ${current.mainWidth}
            animate-[mainCardIn_1100ms_cubic-bezier(0.22,1,0.36,1)]
          `}
        >
          <MainDashboard slide={current} />
        </div>

        {/* Small cards */}

        <div
          key={`${current.id}-small-one`}
          className={`
            absolute z-20
            ${current.smallPositions[0]}
            animate-[smallCardIn_1000ms_cubic-bezier(0.22,1,0.36,1)]
          `}
        >
          <FloatingOpportunityCard slide={current} />
        </div>

        <div
          key={`${current.id}-small-two`}
          className={`
            absolute z-20
            ${current.smallPositions[1]}
            animate-[smallCardIn_1150ms_cubic-bezier(0.22,1,0.36,1)]
          `}
        >
          <MatchCard slide={current} />
        </div>
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="relative z-30 mx-auto flex h-full max-w-7xl items-start justify-center px-4 pt-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}

          <div
            key={`${current.id}-badge`}
            className={`
              mb-6 inline-flex
              items-center gap-2
              rounded-full
              border ${accent.border}
              bg-white/[0.045]
              px-4 py-2
              text-xs font-semibold
              text-slate-300
              shadow-[0_10px_40px_rgba(0,0,0,0.2)]
              backdrop-blur-xl
              animate-[contentEnter_850ms_cubic-bezier(0.22,1,0.36,1)]
            `}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${accent.bg} animate-pulse`}
            />

            <Sparkles size={14} className={accent.text} />

            {current.platform}

            <span className="text-slate-700">•</span>

            {current.eyebrow}
          </div>

          {/* Heading */}

          <div
            key={`${current.id}-heading`}
            className={`
              animate-[contentEnter_950ms_cubic-bezier(0.22,1,0.36,1)]
            `}
          >
            <h1 className="text-5xl font-bold leading-[1.02] tracking-[-0.055em] text-white sm:text-6xl lg:text-[70px]">
              {current.heading}
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-slate-400 sm:text-lg">
              {current.description}
            </p>
          </div>

          {/* CTA */}

          <div
            key={`${current.id}-cta`}
            className="mt-8 flex animate-[contentUp_900ms_cubic-bezier(0.22,1,0.36,1)] flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link
              to="/login"
              className="
                group inline-flex w-full
                items-center justify-center gap-2
                rounded-xl
                bg-blue-600
                px-7 py-3.5
                text-sm font-semibold
                text-white
                shadow-[0_0_40px_rgba(37,99,235,0.25)]
                transition-all duration-300
                hover:-translate-y-0.5
                hover:bg-blue-500
                hover:shadow-[0_0_60px_rgba(37,99,235,0.4)]
                sm:w-auto
              "
            >
              <Search size={17} />

              Start Finding Jobs

              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            <a
              href="#features"
              className="
                inline-flex w-full
                items-center justify-center
                rounded-xl
                border border-white/[0.08]
                bg-white/[0.035]
                px-7 py-3.5
                text-sm font-semibold
                text-slate-300
                backdrop-blur-xl
                transition-all duration-300
                hover:border-white/[0.15]
                hover:bg-white/[0.07]
                sm:w-auto
              "
            >
              Explore Features
            </a>
          </div>

          {/* Trust */}

          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-600">
            <Check size={14} className="text-emerald-400" />
            Built for developers, freelancers & modern job seekers
          </div>
        </div>
      </div>

      {/* =====================================================
          CAROUSEL CONTROLS
      ===================================================== */}

      <div className="absolute bottom-7 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3">
        {heroSlides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => goToSlide(index)}
            aria-label={`Show ${slide.platform}`}
            className={`
              h-1.5 rounded-full
              transition-all duration-500
              ${
                index === activeIndex
                  ? `w-9 ${accent.bg}`
                  : "w-1.5 bg-white/15 hover:bg-white/30"
              }
            `}
          />
        ))}
      </div>

      {/* =====================================================
          ANIMATIONS
      ===================================================== */}

      <style>{`
        @keyframes contentEnter {
          0% {
            opacity: 0;
            transform: translateY(18px);
            filter: blur(8px);
          }

          55% {
            opacity: 0.75;
            filter: blur(2px);
          }

          100% {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }

        @keyframes contentUp {
          0% {
            opacity: 0;
            transform: translateY(15px);
          }

          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes mainCardIn {
          0% {
            opacity: 0;
            transform:
              translate3d(45px, 25px, 0)
              scale(0.92)
              rotate(0deg);
            filter: blur(9px);
          }

          45% {
            opacity: 0.65;
            filter: blur(3px);
          }

          75% {
            opacity: 0.95;
          }

          100% {
            opacity: 1;
            transform:
              translate3d(0, 0, 0)
              scale(1)
              rotate(var(--rotation));
            filter: blur(0);
          }
        }

        @keyframes smallCardIn {
          0% {
            opacity: 0;
            transform:
              translate3d(25px, 35px, 0)
              scale(0.8)
              rotate(-4deg);
            filter: blur(7px);
          }

          60% {
            opacity: 0.8;
            filter: blur(1px);
          }

          100% {
            opacity: 1;
            transform:
              translate3d(0, 0, 0)
              scale(1)
              rotate(0deg);
            filter: blur(0);
          }
        }

        @keyframes glowIn {
          0% {
            opacity: 0;
            transform: translateX(-50%) scale(0.75);
          }

          100% {
            opacity: 1;
            transform: translateX(-50%) scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </section>
  );
}

/* =========================================================
   MAIN DASHBOARD CARD
========================================================= */

function MainDashboard({ slide }) {
  const accent = accentStyles[slide.accent];

  const data = {
    Upwork: {
      title: "Recommended projects",
      subtitle: "Matched to your profile",
      stat: "24",
      statLabel: "New projects",
      jobs: [
        ["React Dashboard Development", "$2,400", "96%"],
        ["Next.js SaaS Application", "$3,100", "92%"],
        ["Full Stack Web App", "$1,800", "89%"],
      ],
    },

    LinkedIn: {
      title: "Recommended roles",
      subtitle: "Based on your experience",
      stat: "18",
      statLabel: "New roles",
      jobs: [
        ["Senior Frontend Engineer", "Remote", "97%"],
        ["React Developer", "Lahore", "94%"],
        ["Full Stack Engineer", "Remote", "91%"],
      ],
    },

    Indeed: {
      title: "Jobs for you",
      subtitle: "Fresh opportunities",
      stat: "32",
      statLabel: "New jobs",
      jobs: [
        ["Frontend Developer", "$80k–$110k", "95%"],
        ["React Engineer", "$90k–$120k", "93%"],
        ["Software Engineer", "$85k–$115k", "88%"],
      ],
    },

    Fiverr: {
      title: "Gig opportunities",
      subtitle: "Matched to your skills",
      stat: "16",
      statLabel: "Potential gigs",
      jobs: [
        ["React Web Development", "$500+", "96%"],
        ["Landing Page Design", "$300+", "91%"],
        ["MERN Stack Project", "$900+", "89%"],
      ],
    },

    Wellfound: {
      title: "Startup opportunities",
      subtitle: "High-growth companies",
      stat: "12",
      statLabel: "New startups",
      jobs: [
        ["Founding Frontend Engineer", "Series A", "98%"],
        ["Full Stack Engineer", "Seed", "94%"],
        ["Product Engineer", "Series B", "90%"],
      ],
    },
  };

  const content = data[slide.platform];

  return (
    <div
      className="
        relative overflow-hidden
        rounded-[24px]
        border border-white/[0.12]
        bg-[#111827]
        p-3
        shadow-[0_40px_120px_rgba(0,0,0,0.65)]
      "
    >
      {/* Browser top */}

      <div className="flex h-9 items-center gap-1.5 rounded-t-xl border-b border-white/[0.06] bg-[#0b1120] px-3">
        <span className="h-2 w-2 rounded-full bg-white/10" />
        <span className="h-2 w-2 rounded-full bg-white/10" />
        <span className="h-2 w-2 rounded-full bg-white/10" />

        <div className="mx-auto h-5 w-56 rounded-md border border-white/[0.05] bg-white/[0.025]" />
      </div>

      <div className="grid grid-cols-[150px_1fr]">
        {/* Sidebar */}

        <div className="border-r border-white/[0.06] bg-[#0b1120] p-4">
          <div className="mb-7 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600">
              <Zap size={13} />
            </div>

            <span className="text-xs font-bold text-white">
              JobPulse
            </span>
          </div>

          <div className="space-y-1.5">
            <DashboardNav
              active
              icon={<Search size={12} />}
              text="Discover"
            />

            <DashboardNav
              icon={<BriefcaseBusiness size={12} />}
              text="Saved Jobs"
            />

            <DashboardNav
              icon={<TrendingUp size={12} />}
              text="Applications"
            />

            <DashboardNav
              icon={<Users size={12} />}
              text="Profile"
            />
          </div>
        </div>

        {/* Dashboard */}

        <div className="bg-[#151d2d] p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[9px] uppercase tracking-wider text-slate-500">
                {content.subtitle}
              </p>

              <h3 className="mt-1 text-lg font-bold text-white">
                {content.title}
              </h3>
            </div>

            <div className="rounded-lg border border-white/[0.07] bg-[#0c1322] px-3 py-2">
              <p className={`text-xl font-bold ${accent.text}`}>
                {content.stat}
              </p>

              <p className="text-[8px] text-slate-600">
                {content.statLabel}
              </p>
            </div>
          </div>

          {/* Stats */}

          <div className="mt-5 grid grid-cols-3 gap-2">
            <DashboardStat
              icon={<Sparkles size={12} />}
              label="Matches"
              value="96%"
              accent={accent}
            />

            <DashboardStat
              icon={<BriefcaseBusiness size={12} />}
              label="Saved"
              value="18"
              accent={accent}
            />

            <DashboardStat
              icon={<TrendingUp size={12} />}
              label="Applied"
              value="07"
              accent={accent}
            />
          </div>

          {/* Jobs */}

          <div className="mt-4 space-y-2">
            {content.jobs.map(([title, company, match]) => (
              <DashboardJob
                key={title}
                title={title}
                company={company}
                match={match}
                accent={accent}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SMALL OPPORTUNITY CARD
========================================================= */

function FloatingOpportunityCard({ slide }) {
  const accent = accentStyles[slide.accent];

  const platformData = {
    Upwork: {
      icon: <Code2 size={17} />,
      title: "React Dashboard",
      subtitle: "Upwork project",
      amount: "$2,400",
    },

    LinkedIn: {
      icon: <Users size={17} />,
      title: "Senior React Engineer",
      subtitle: "LinkedIn opportunity",
      amount: "97% match",
    },

    Indeed: {
      icon: <Search size={17} />,
      title: "Frontend Developer",
      subtitle: "Indeed job",
      amount: "$105k",
    },

    Fiverr: {
      icon: <DollarSign size={17} />,
      title: "MERN Stack Project",
      subtitle: "Fiverr gig",
      amount: "$900+",
    },

    Wellfound: {
      icon: <Sparkles size={17} />,
      title: "Founding Engineer",
      subtitle: "Wellfound startup",
      amount: "98% match",
    },
  };

  const data = platformData[slide.platform];

  return (
    <div
      className="
        w-[225px]
        rounded-2xl
        border border-white/[0.13]
        bg-[#172033]
        p-4
        shadow-[0_25px_70px_rgba(0,0,0,0.55)]
        backdrop-blur-xl
      "
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent.soft} ${accent.text}`}
        >
          {data.icon}
        </div>

        <div className="min-w-0">
          <p className="truncate text-[11px] font-bold text-white">
            {data.title}
          </p>

          <p className="mt-0.5 text-[9px] text-slate-500">
            {data.subtitle}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span
          className={`rounded-full ${accent.soft} px-2.5 py-1 text-[9px] font-bold ${accent.text}`}
        >
          {data.amount}
        </span>

        <span className="text-[9px] text-emerald-400">
          Just now
        </span>
      </div>
    </div>
  );
}

/* =========================================================
   MATCH CARD
========================================================= */

function MatchCard({ slide }) {
  const accent = accentStyles[slide.accent];

  return (
    <div
      className="
        w-[190px]
        rounded-2xl
        border border-white/[0.12]
        bg-[#101827]
        p-4
        shadow-[0_25px_70px_rgba(0,0,0,0.5)]
      "
    >
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">
          AI Match
        </span>

        <Sparkles size={13} className={accent.text} />
      </div>

      <div className="mt-3 flex items-center gap-3">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full ${accent.soft}`}
        >
          <span className={`text-sm font-black ${accent.text}`}>
            96%
          </span>
        </div>

        <div>
          <p className="text-[11px] font-bold text-white">
            Strong match
          </p>

          <p className="mt-1 text-[9px] text-slate-500">
            Skills align perfectly
          </p>
        </div>
      </div>

      <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className={`h-full w-[96%] rounded-full ${accent.bg}`}
        />
      </div>
    </div>
  );
}

/* =========================================================
   DASHBOARD HELPERS
========================================================= */

function DashboardNav({ icon, text, active = false }) {
  return (
    <div
      className={`
        flex items-center gap-2 rounded-lg px-2.5 py-2 text-[9px]
        ${
          active
            ? "bg-blue-500/10 text-blue-400"
            : "text-slate-600"
        }
      `}
    >
      {icon}
      {text}
    </div>
  );
}

function DashboardStat({ icon, label, value, accent }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0d1525] p-2.5">
      <div className="flex items-center gap-1.5 text-slate-600">
        {icon}
        <span className="text-[8px]">{label}</span>
      </div>

      <p className={`mt-1 text-sm font-bold ${accent.text}`}>
        {value}
      </p>
    </div>
  );
}

function DashboardJob({
  title,
  company,
  match,
  accent,
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-[#0d1525] p-3">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${accent.soft} ${accent.text}`}
      >
        <BriefcaseBusiness size={13} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[10px] font-bold text-white">
          {title}
        </p>

        <p className="mt-0.5 text-[8px] text-slate-600">
          {company}
        </p>
      </div>

      <span
        className={`rounded-full ${accent.soft} px-2 py-1 text-[8px] font-bold ${accent.text}`}
      >
        {match}
      </span>
    </div>
  );
}

export default HeroSection;