"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { AlertTriangle, BarChart3, FileWarning, ShieldCheck, WalletCards } from "lucide-react";

const links = [
  { icon: BarChart3, label: "Overview", section: "overview" },
  { icon: FileWarning, label: "Flagged Fraud", section: "fraud" },
  { icon: AlertTriangle, label: "Suspicious Alerts", section: "suspicious" },
  { icon: WalletCards, label: "Simulation Panel", section: "simulation" },
  { icon: ShieldCheck, label: "Compliance", section: "compliance" },
];

export function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeSection = searchParams.get("section") ?? "overview";

  const buildSectionHref = (section: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("section", section);
    return `${pathname}?${params.toString()}`;
  };

  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white/85 px-4 py-6 backdrop-blur-xl lg:block">
      <div className="mb-8 rounded-xl bg-gradient-to-br from-sky-600 to-cyan-500 p-4 text-white shadow-lg shadow-sky-200">
        <p className="text-xs uppercase tracking-widest text-sky-100">Trade AML</p>
        <h1 className="mt-1 text-lg font-semibold">TBML Detection System</h1>
        <p className="mt-1 text-xs text-sky-100">Regulatory Intelligence Console</p>
      </div>
      <nav className="space-y-1">
        {links.map((link) => (
          <Link
            key={link.label}
            href={buildSectionHref(link.section)}
            aria-current={activeSection === link.section ? "page" : undefined}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition ${
              activeSection === link.section
                ? "bg-sky-50 text-sky-700"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
