import { PublicNavbar } from "@/components/navigation/public-navbar";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  FileSearch,
  Globe,
  Radar,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import Link from "next/link";

import { flaggedFraudAccounts, suspiciousTransactions } from "@/lib/mock-data";

const stats = [
  {
    label: "Flagged accounts",
    value: flaggedFraudAccounts.length.toString().padStart(2, "0"),
    note: "High-risk trade relationships",
    icon: AlertTriangle,
  },
  {
    label: "Suspicious alerts",
    value: suspiciousTransactions.length.toString().padStart(2, "0"),
    note: "Cases waiting analyst review",
    icon: Radar,
  },
  {
    label: "Corridors covered",
    value: "06",
    note: "Cross-border TBML routes",
    icon: Globe,
  },
];

const objectives = [
  {
    title: "Detect invoice abuse",
    description: "Catch mismatched values, repeated thresholds, and suspicious trade narratives before they escalate.",
    icon: FileSearch,
  },
  {
    title: "Prioritize by risk",
    description: "Surface the highest-risk corridors and counterparties first so analysts can move faster.",
    icon: BarChart3,
  },
  {
    title: "Support compliance review",
    description: "Keep evidence, alerts, and STR-ready context together inside a single workflow.",
    icon: ShieldCheck,
  },
];

const workflow = [
  {
    step: "01",
    title: "Monitor trade signals",
    text: "Import account, shipment, route, and value indicators into a live compliance console.",
  },
  {
    step: "02",
    title: "Score the patterns",
    text: "Rank risk using behavioral anomalies, trade corridor risk, and documentation quality.",
  },
  {
    step: "03",
    title: "Act on the case",
    text: "Escalate confirmed issues, generate STR support, and coordinate with originating banks.",
  },
];

const heroCases = [...flaggedFraudAccounts.slice(0, 2), ...suspiciousTransactions.slice(0, 2)];

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-hidden bg-slate-50 font-sans selection:bg-sky-200 selection:text-sky-900">
      <PublicNavbar />
      <main className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pb-32">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="animate-[float_14s_ease-in-out_infinite] absolute -left-20 top-12 h-56 w-56 rounded-full bg-linear-to-br from-sky-200/60 to-cyan-100/20 blur-3xl sm:-left-24 sm:h-72 sm:w-72" />
          <div className="animate-[float_18s_ease-in-out_infinite] absolute right-0 top-24 h-72 w-72 rounded-full bg-linear-to-br from-indigo-200/50 to-transparent blur-3xl sm:h-96 sm:w-96" />
          <div className="animate-[pulse_9s_ease-in-out_infinite] absolute -bottom-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-linear-to-br from-amber-100/60 to-rose-100/20 blur-3xl sm:left-1/3 sm:h-112 sm:w-md sm:translate-x-0" />
          <div className="hero-grid absolute inset-0 opacity-60" />
        </div>

        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700 shadow-sm backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                TBML compliance workspace
              </div>

              <h1 className="mt-6 text-5xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                Detect trade laundering.
                <span className="mt-3 block bg-linear-to-r from-sky-700 via-cyan-500 to-emerald-500 bg-clip-text text-transparent">
                  Explain risk clearly.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl">
                A realistic anti-money-laundering console for trade finance teams. Monitor flagged accounts, suspicious transactions, and compliance workflows in one place with case-focused context.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-full bg-slate-950 px-7 py-4 text-base font-semibold text-white shadow-lg shadow-slate-300 transition-transform hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  Open Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/sign-up"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/80 px-7 py-4 text-base font-semibold text-slate-800 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:text-slate-950"
                >
                  Start Free
                </Link>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {stats.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="glass-panel animate-[fade-up_700ms_ease-out_both] rounded-3xl border border-white/70 p-5 shadow-xl shadow-slate-200/40"
                      style={{ animationDelay: `${index * 120}ms` }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
                          <p className="mt-2 text-3xl font-black text-slate-950">{item.value}</p>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-slate-600">{item.note}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 rounded-[2.5rem] bg-linear-to-br from-sky-100/60 via-white to-cyan-50/40 blur-2xl" />
              <div className="relative overflow-hidden rounded-4xl border border-white/70 bg-white/90 p-4 shadow-2xl shadow-slate-200/60 backdrop-blur-xl sm:p-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Live case board</p>
                    <h2 className="mt-1 text-xl font-bold text-slate-950">Sample TBML alerts</h2>
                  </div>
                  <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Streaming
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {heroCases.map((item, index) => {
                    const isFraud = "holderName" in item;
                    const title = isFraud ? item.holderName : item.sender;
                    const route = isFraud ? item.country : item.tradeType;
                    const badge = isFraud ? `Risk ${item.riskScore}/100` : item.riskLevel;
                    const tags = isFraud ? item.riskIndicators : [item.suspicionReason];

                    return (
                      <div
                        key={item.transactionId}
                        className="animate-[fade-up_700ms_ease-out_both] rounded-2xl border border-slate-100 bg-slate-50/80 p-4 transition-transform hover:-translate-y-0.5"
                        style={{ animationDelay: `${index * 110 + 180}ms` }}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-semibold text-slate-900">{title}</p>
                            <p className="mt-1 text-sm text-slate-600">{route}</p>
                            <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">{item.transactionId}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-slate-900">${item.amount.toLocaleString()}</p>
                            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-rose-600">{badge}</p>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 grid gap-3 rounded-2xl border border-slate-100 bg-slate-950 p-4 text-white sm:grid-cols-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Flagged value</p>
                    <p className="mt-1 text-xl font-bold">$6.1M</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Avg risk</p>
                    <p className="mt-1 text-xl font-bold">92.5%</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Analyst status</p>
                    <p className="mt-1 text-xl font-bold">Review ready</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {objectives.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="glass-panel animate-[fade-up_700ms_ease-out_both] rounded-4xl border border-slate-200 p-6 shadow-lg shadow-slate-200/50 sm:p-7"
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-sky-700 shadow-sm ring-1 ring-slate-100">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-slate-950">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2.25rem] bg-linear-to-r from-slate-950 via-slate-900 to-slate-800 p-8 text-white shadow-2xl shadow-slate-300/40 sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                  <Workflow className="h-3.5 w-3.5" />
                  Detection workflow
                </div>
                <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">Designed to mirror a real compliance desk.</h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                  The dashboard connects case review, suspicious transaction analysis, and STR preparation into one operational view so investigators can move from alert to action without losing context.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {workflow.map((item) => (
                  <div key={item.step} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">{item.step}</p>
                    <h3 className="mt-2 font-bold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
