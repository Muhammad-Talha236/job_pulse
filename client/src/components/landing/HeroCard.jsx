import {
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  Check,
  Code2,
  DollarSign,
  Globe2,
  Heart,
  MapPin,
  Rocket,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

function CardShell({ children, className = "", slide }) {
  return (
    <div
      className={`
        relative overflow-hidden
        rounded-[22px]
        border ${slide.theme.border}
        bg-[#111827]/95
        shadow-[0_35px_100px_rgba(0,0,0,0.55)]
        backdrop-blur-2xl
        ${className}
      `}
    >
      <div
        className={`pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full ${slide.theme.glow} blur-[80px]`}
      />

      {children}
    </div>
  );
}

function Header({ slide, title, subtitle }) {
  return (
    <div className="relative flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${slide.theme.accentSoft} ${slide.theme.accent}`}
        >
          <BriefcaseBusiness size={16} />
        </div>

        <div>
          <p className="text-[11px] font-semibold text-white">{title}</p>
          <p className="mt-0.5 text-[8px] text-slate-500">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.035] px-2.5 py-1.5">
        <span
          className={`h-1.5 w-1.5 rounded-full ${slide.theme.accentBg} animate-pulse`}
        />
        <span className="text-[8px] text-slate-500">Live</span>
      </div>
    </div>
  );
}

function JobItem({ title, company, meta, match, slide, icon }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.055] bg-[#0b1220]/80 p-3 transition-all">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${slide.theme.accentSoft} ${slide.theme.accent}`}
      >
        {icon || <BriefcaseBusiness size={15} />}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[10px] font-bold text-white">{title}</p>
        <p className="mt-1 truncate text-[8px] text-slate-500">
          {company}
        </p>
        <p className="mt-1 text-[7px] text-slate-600">{meta}</p>
      </div>

      <div className="text-right">
        <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[8px] font-bold text-emerald-400">
          {match}
        </span>
      </div>
    </div>
  );
}

function LinkedInCard({ slide }) {
  return (
    <CardShell slide={slide} className="h-[390px] w-[570px]">
      <Header
        slide={slide}
        title="Recommended for you"
        subtitle="Based on your profile"
      />

      <div className="relative p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[8px] uppercase tracking-[0.18em] text-slate-600">
              Your recommendations
            </p>
            <p className="mt-1 text-sm font-bold text-white">
              Top career matches
            </p>
          </div>

          <span className="rounded-lg bg-blue-500/10 px-2.5 py-1.5 text-[8px] font-bold text-blue-400">
            96% profile fit
          </span>
        </div>

        <div className="space-y-2.5">
          <JobItem
            slide={slide}
            title="Senior React Developer"
            company="Microsoft · Remote"
            meta="React · TypeScript · Next.js"
            match="96%"
            icon={<Code2 size={15} />}
          />

          <JobItem
            slide={slide}
            title="Frontend Engineer"
            company="Stripe · San Francisco"
            meta="React · UI Systems · APIs"
            match="92%"
            icon={<Globe2 size={15} />}
          />

          <JobItem
            slide={slide}
            title="Product Engineer"
            company="Vercel · Remote"
            meta="Next.js · React · Design"
            match="89%"
            icon={<Zap size={15} />}
          />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <Metric label="New roles" value="24" />
          <Metric label="Companies" value="18" />
          <Metric label="Matches" value="96%" />
        </div>
      </div>
    </CardShell>
  );
}

function IndeedCard({ slide }) {
  return (
    <CardShell slide={slide} className="h-[390px] w-[570px]">
      <Header
        slide={slide}
        title="Jobs matching your profile"
        subtitle="24 new opportunities"
      />

      <div className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.025] px-3 py-2">
            <MapPin size={11} className="text-slate-600" />
            <span className="text-[8px] text-slate-500">
              Remote · Worldwide
            </span>
          </div>

          <span className="text-[8px] text-slate-600">
            Sorted by relevance
          </span>
        </div>

        <div className="space-y-2.5">
          <JobItem
            slide={slide}
            title="Full Stack Developer"
            company="Nova Labs"
            meta="$80k–$110k · Full-time · Remote"
            match="98%"
          />

          <JobItem
            slide={slide}
            title="React Developer"
            company="ScaleUp Technologies"
            meta="$70k–$95k · Hybrid · Full-time"
            match="94%"
          />

          <JobItem
            slide={slide}
            title="Software Engineer"
            company="TechFlow"
            meta="$85k–$120k · Remote · Full-time"
            match="91%"
          />
        </div>

        <div className="mt-4 flex items-center justify-between rounded-xl border border-cyan-400/10 bg-cyan-400/[0.035] p-3">
          <div className="flex items-center gap-2">
            <TrendingUp size={14} className="text-cyan-400" />
            <div>
              <p className="text-[9px] font-bold text-white">
                12 new matches today
              </p>
              <p className="text-[7px] text-slate-600">
                JobPulse is watching for you
              </p>
            </div>
          </div>

          <ArrowUpRight size={14} className="text-cyan-400" />
        </div>
      </div>
    </CardShell>
  );
}

function UpworkCard({ slide }) {
  return (
    <CardShell slide={slide} className="h-[390px] w-[570px]">
      <Header
        slide={slide}
        title="Projects matched to you"
        subtitle="12 high-quality matches"
      />

      <div className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[8px] uppercase tracking-[0.18em] text-slate-600">
              Freelance radar
            </p>
            <p className="mt-1 text-sm font-bold text-white">
              Projects worth applying to
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-[8px] text-emerald-400">
            <DollarSign size={12} />
            $45–75/hr
          </div>
        </div>

        <div className="space-y-2.5">
          <JobItem
            slide={slide}
            title="Build a React SaaS Dashboard"
            company="Fixed price · $2,500"
            meta="React · Tailwind · Node.js"
            match="97%"
            icon={<Code2 size={15} />}
          />

          <JobItem
            slide={slide}
            title="Frontend Developer for Startup"
            company="$55/hr · 20+ hrs/week"
            meta="React · TypeScript · Figma"
            match="94%"
            icon={<Rocket size={15} />}
          />

          <JobItem
            slide={slide}
            title="MERN Stack Application"
            company="Fixed price · $4,000"
            meta="MongoDB · Express · React"
            match="90%"
            icon={<BriefcaseBusiness size={15} />}
          />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-7 w-7 rounded-full border-2 border-[#111827] bg-slate-700"
              />
            ))}
          </div>

          <span className="text-[8px] text-slate-500">
            8 projects discovered in the last hour
          </span>
        </div>
      </div>
    </CardShell>
  );
}

function FiverrCard({ slide }) {
  return (
    <CardShell slide={slide} className="h-[390px] w-[570px]">
      <Header
        slide={slide}
        title="Trending opportunities"
        subtitle="Matched to your skills"
      />

      <div className="grid grid-cols-2 gap-3 p-5">
        {[
          ["React Dashboard", "$850", "98%"],
          ["Landing Page", "$450", "94%"],
          ["Next.js Website", "$1,200", "91%"],
          ["MERN App", "$2,400", "88%"],
        ].map(([title, price, match]) => (
          <div
            key={title}
            className="rounded-xl border border-white/[0.06] bg-[#0b1220]/80 p-3"
          >
            <div className="flex h-20 items-center justify-center rounded-lg bg-gradient-to-br from-green-500/10 to-blue-500/5">
              <Code2 size={25} className="text-green-400/70" />
            </div>

            <p className="mt-3 truncate text-[9px] font-bold text-white">
              {title}
            </p>

            <div className="mt-2 flex items-center justify-between">
              <span className="text-[9px] font-bold text-green-400">
                {price}
              </span>

              <span className="text-[7px] text-slate-600">
                {match} match
              </span>
            </div>
          </div>
        ))}
      </div>
    </CardShell>
  );
}

function WellfoundCard({ slide }) {
  return (
    <CardShell slide={slide} className="h-[390px] w-[570px]">
      <Header
        slide={slide}
        title="Startup matches"
        subtitle="Companies growing fast"
      />

      <div className="p-5">
        <div className="mb-4 rounded-xl border border-orange-400/10 bg-orange-400/[0.035] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10">
              <Rocket size={20} className="text-orange-400" />
            </div>

            <div>
              <p className="text-[11px] font-bold text-white">
                LaunchLabs
              </p>
              <p className="mt-1 text-[8px] text-slate-500">
                Series A · 32 employees · Remote
              </p>
            </div>

            <span className="ml-auto rounded-full bg-orange-500/10 px-2 py-1 text-[7px] font-bold text-orange-400">
              96% fit
            </span>
          </div>

          <div className="mt-4 flex gap-2">
            <Tag>React</Tag>
            <Tag>AI</Tag>
            <Tag>Remote</Tag>
          </div>
        </div>

        <div className="space-y-2.5">
          <JobItem
            slide={slide}
            title="Founding Frontend Engineer"
            company="LaunchLabs"
            meta="Remote · Equity · Full-time"
            match="96%"
            icon={<Rocket size={15} />}
          />

          <JobItem
            slide={slide}
            title="Product Engineer"
            company="Orbit AI"
            meta="Remote · Series A"
            match="91%"
            icon={<SparklesIcon />}
          />
        </div>

        <div className="mt-4 flex items-center gap-5">
          <div className="flex items-center gap-1.5">
            <Users size={12} className="text-orange-400" />
            <span className="text-[8px] text-slate-500">32 people</span>
          </div>

          <div className="flex items-center gap-1.5">
            <TrendingUp size={12} className="text-emerald-400" />
            <span className="text-[8px] text-slate-500">
              Growing 42%
            </span>
          </div>
        </div>
      </div>
    </CardShell>
  );
}

function SparklesIcon() {
  return <Star size={15} />;
}

function Metric({ label, value }) {
  return (
    <div className="rounded-xl border border-white/[0.05] bg-white/[0.025] px-3 py-2.5">
      <p className="text-[7px] text-slate-600">{label}</p>
      <p className="mt-1 text-sm font-bold text-white">{value}</p>
    </div>
  );
}

function Tag({ children }) {
  return (
    <span className="rounded-full border border-white/[0.07] bg-white/[0.035] px-2.5 py-1 text-[7px] text-slate-400">
      {children}
    </span>
  );
}

export function MainHeroCard({ slide }) {
  const cards = {
    linkedin: LinkedInCard,
    indeed: IndeedCard,
    upwork: UpworkCard,
    fiverr: FiverrCard,
    wellfound: WellfoundCard,
  };

  const Card = cards[slide.layout] || LinkedInCard;

  return <Card slide={slide} />;
}

export function SmallHeroCard({
  slide,
  type = "match",
  className = "",
}) {
  const content = {
    match: {
      title: "AI Match",
      value: "96%",
      subtitle: "Perfect fit",
      icon: <Zap size={14} />,
    },
    saved: {
      title: "Saved jobs",
      value: "18",
      subtitle: "Ready to apply",
      icon: <Heart size={14} />,
    },
    discovered: {
      title: "New matches",
      value: "12",
      subtitle: "Just discovered",
      icon: <TrendingUp size={14} />,
    },
  }[type];

  return (
    <div
      className={`
        w-[190px]
        rounded-2xl
        border border-white/[0.09]
        bg-[#151e2d]/95
        p-3.5
        shadow-[0_25px_70px_rgba(0,0,0,0.5)]
        backdrop-blur-2xl
        ${className}
      `}
    >
      <div className="flex items-center gap-2.5">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${slide.theme.accentSoft} ${slide.theme.accent}`}
        >
          {content.icon}
        </div>

        <div>
          <p className="text-[8px] uppercase tracking-wider text-slate-600">
            {content.title}
          </p>

          <p className="mt-0.5 text-sm font-bold text-white">
            {content.value}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-[8px] text-slate-500">
        <Check size={10} className="text-emerald-400" />
        {content.subtitle}
      </div>
    </div>
  );
}