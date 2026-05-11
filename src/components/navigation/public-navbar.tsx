"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function PublicNavbar() {
  const pathname = usePathname();

  const links = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about-us" },
    { name: "Contact Us", href: "/contactus" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Title */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-sky-600 to-cyan-500 shadow-md shadow-sky-200 flex items-center justify-center">
                <span className="text-white font-bold text-xs">TB</span>
              </div>
              <span className="font-semibold text-xl text-slate-900 tracking-tight">TBML Detect</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-8">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${pathname === link.href
                    ? "border-sky-500 text-slate-900"
                    : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/sign-in"
              className="bg-sky-600 hover:bg-sky-700 text-white rounded-full font-medium text-sm px-5 py-2 transition-colors shadow-sm"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
