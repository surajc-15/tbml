"use client";

import {
  GraduationCap,
  BrainCircuit,
  Building2,
  Globe2,
  BadgeCheck,
  ShieldCheck,
  Sparkles,
  Quote,
  Users,
  BookOpen,
  Network,
} from "lucide-react";

/* ─── Feature pill ─── */
function Pill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-sky-200/80 bg-sky-50 px-4 py-1.5 text-[13px] font-semibold tracking-wide text-sky-700">
      {label}
    </span>
  );
}

/* ─── Capability card ─── */
function CapCard({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <div className="group relative flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white/70 p-6 backdrop-blur-sm transition-all duration-400 hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-[0_12px_32px_rgba(14,165,233,0.08)]">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-100 to-cyan-50 text-sky-600 transition-all duration-400 group-hover:from-sky-600 group-hover:to-cyan-500 group-hover:text-white">
        <Icon size={22} />
      </div>
      <div>
        <p className="text-[15px] font-semibold text-slate-900">{title}</p>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{description}</p>
      </div>
    </div>
  );
}

/* ─── Member card ─── */
function MemberCard({ name, usn, index }: { name: string; usn: string; index: number }) {
  const accents = [
    "from-sky-600 to-cyan-500",
    "from-cyan-600 to-teal-500",
    "from-sky-700 to-indigo-500",
  ];
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white/80 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-[0_16px_40px_rgba(14,165,233,0.1)]">
      {/* Index watermark */}
      <span className="absolute right-4 top-3 font-serif text-6xl font-bold text-slate-100 select-none transition-colors duration-300 group-hover:text-sky-50">
        0{index + 1}
      </span>

      <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${accents[index]} flex items-center justify-center text-white`}>
        <GraduationCap size={20} />
      </div>

      <p className="mt-5 text-lg font-bold tracking-tight text-slate-900">{name}</p>
      <span className="mt-2 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold tracking-widest text-slate-600 group-hover:bg-sky-100 group-hover:text-sky-700">
        {usn}
      </span>
    </div>
  );
}

/* ─── Guide card ─── */
function GuideCard({
  role,
  name,
  sub,
  accent,
}: {
  role: string;
  name: string;
  sub: string;
  accent: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border p-7 ${accent}`}>
      <Quote className="absolute right-6 top-6 h-10 w-10 opacity-10" />
      <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-70">{role}</p>
      <h3 className="mt-3 text-2xl font-bold tracking-tight">{name}</h3>
      <p className="mt-1.5 text-sm opacity-70">{sub}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN SECTION
═══════════════════════════════════════════════════════════ */
export function AboutUsSection() {
  return (
    <section className="relative overflow-hidden bg-[#f7f9fc] px-6 py-28 md:px-12 lg:px-24">

      {/* ── Ambient background ── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-sky-100/60 blur-[140px]" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-cyan-100/50 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.022)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.022)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl space-y-24">

        {/* ══ SECTION 1 — Header & Vision ══════════════════════════════ */}
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">

          {/* Left: Identity */}
          <div>
            <div className="inline-flex items-center gap-2.5 rounded-full border border-sky-200 bg-white/90 px-5 py-2 text-sm font-semibold text-sky-700 shadow-sm backdrop-blur-md">
              <GraduationCap size={15} />
              Major Project · RV College of Engineering
            </div>

            <h1 className="mt-7 font-['Georgia',serif] text-4xl font-bold leading-[1.08] tracking-[-0.02em] text-slate-900 md:text-5xl lg:text-[56px]">
              Federated Heterogeneous
              <span className="mt-1 block bg-gradient-to-r from-sky-700 to-cyan-500 bg-clip-text text-transparent">
                Graph Neural Networks
              </span>
              <span className="mt-0.5 block text-[0.88em] text-slate-700">
                for Real-Time TBML Detection
              </span>
            </h1>

            <div className="mt-8 flex flex-wrap gap-2">
              {["Graph Neural Networks", "Federated Learning", "TBML Detection", "Fraud Analytics"].map((t) => (
                <Pill key={t} label={t} />
              ))}
            </div>
          </div>

          {/* Right: Vision card */}
          <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 p-8 shadow-[0_24px_64px_rgba(15,23,42,0.06)] backdrop-blur-xl md:p-10">
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-sky-100/60 blur-[80px]" />
            <div className="relative z-10">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-600 to-cyan-500 text-white shadow-md shadow-sky-200">
                  <BrainCircuit size={28} />
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-600">Research Vision</p>
              </div>

              <p className="mt-6 text-[17px] leading-[1.75] text-slate-600">
                The project develops an intelligent TBML detection ecosystem capable of identifying
                suspicious trade behavior through{" "}
                <span className="font-semibold text-slate-900">graph-based transaction intelligence</span>{" "}
                and federated learning architectures — enabling scalable fraud detection without
                compromising institutional data confidentiality.
              </p>

              {/* Divider */}
              <div className="mt-8 flex items-center gap-4">
                <div className="h-px flex-1 bg-gradient-to-r from-sky-200 to-transparent" />
                <Building2 size={16} className="text-slate-400" />
                <div className="h-px flex-1 bg-gradient-to-l from-sky-200 to-transparent" />
              </div>

              <p className="mt-5 text-sm text-slate-500">
                Department of Computer Science & Engineering,{" "}
                <span className="font-semibold text-slate-700">RV College of Engineering</span>
              </p>
            </div>
          </div>
        </div>

        {/* ══ SECTION 2 — Acknowledgements / Team ════════════════════ */}
        <div>
          {/* Heading row */}
          <div className="flex flex-col gap-2 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-600">Acknowledgements</p>
              <h2 className="mt-2 font-['Georgia',serif] text-3xl font-bold tracking-tight text-slate-900">
                The People Behind This Work
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-slate-500">
              Collaboratively developed by three final-year CSE students with guidance from dedicated
              academic mentors.
            </p>
          </div>

          {/* Two-column: Members + Guides */}
          <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]">

            {/* Members */}
            <div>
              <div className="mb-5 flex items-center gap-2">
                <Users size={16} className="text-sky-600" />
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Student Contributors</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { name: "Nikhil Vasu", usn: "1RV22CS128" },
                  { name: "Rohith Biradar", usn: "1RV22CS164" },
                  { name: "Suraj Chanaveeragoudra", usn: "1RV22CS211" },
                ].map((m, i) => (
                  <MemberCard key={m.usn} name={m.name} usn={m.usn} index={i} />
                ))}
              </div>
            </div>

            {/* Guides */}
            <div>
              <div className="mb-5 flex items-center gap-2">
                <BookOpen size={16} className="text-sky-600" />
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Project Guides</p>
              </div>
              <div className="flex flex-col gap-4">
                <GuideCard
                  role="Internal Guide"
                  name="Dr. Nagaraja G. S"
                  sub="Professor, RV College of Engineering"
                  accent="border-sky-200 bg-sky-50 text-slate-900"
                />
                <GuideCard
                  role="External Guide"
                  name="Dr. Somesh Nandi"
                  sub="Assistant Professor"
                  accent="border-cyan-200 bg-cyan-50 text-slate-900"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ══ SECTION 3 — Capabilities ════════════════════════════════ */}
        <div>
          <div className="mb-10 flex flex-col gap-2 border-b border-slate-200 pb-6">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-600">Project Highlights</p>
            <h2 className="font-['Georgia',serif] text-3xl font-bold tracking-tight text-slate-900">
              Advanced Research Capabilities
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <CapCard
              icon={BrainCircuit}
              title="Federated Learning"
              description="Privacy-aware distributed architecture enabling collaborative fraud intelligence across institutions."
            />
            <CapCard
              icon={Globe2}
              title="Real-Time Monitoring"
              description="Continuous cross-border transaction analysis for early suspicious activity detection."
            />
            <CapCard
              icon={ShieldCheck}
              title="TBML Intelligence"
              description="Graph-based anomaly detection for identifying suspicious trade financing patterns."
            />
            <CapCard
              icon={BadgeCheck}
              title="Fraud Workflows"
              description="Automated STR workflows and intelligent investigation pipelines for compliance teams."
            />
          </div>
        </div>

        {/* ══ FOOTER STRIP ════════════════════════════════════════════ */}
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/60 py-8 text-center backdrop-blur-sm">
          <Network size={18} className="text-sky-400" />
          <p className="text-sm text-slate-500">
            Department of Computer Science & Engineering &mdash;{" "}
            <span className="font-semibold text-slate-700">RV College of Engineering</span>
          </p>
          <p className="text-xs text-slate-400">Academic Year 2025 – 26 · Major Project</p>
        </div>

      </div>
    </section>
  );
}