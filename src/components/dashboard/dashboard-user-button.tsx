"use client";

import dynamic from "next/dynamic";

const ClerkUserButton = dynamic(
  () => import("@clerk/nextjs").then((mod) => mod.UserButton),
  {
    ssr: false,
    loading: () => <div className="h-9 w-9 rounded-full bg-slate-200" aria-hidden="true" />,
  }
);

export function DashboardUserButton() {
  return <ClerkUserButton afterSignOutUrl="/" />;
}
