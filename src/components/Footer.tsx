export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-violet-400/30 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-violet-100 shadow-inner -mt-30">
      <div className="mx-auto w-full max-w-7xl px-5 py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* LEFT */}
          <div className="space-y-1">
            <p className="text-sm font-semibold tracking-wide text-violet-100">
              Department of Compliance & Anti-Money Laundering
            </p>
            <p className="text-[11px] text-violet-300">
              Enterprise Risk Intelligence Platform
            </p>
          </div>

          {/* RIGHT */}
          <div className="text-left sm:text-right">
            <p className="font-mono text-xs text-violet-200">
              TBML AML Dashboard
            </p>
            <p className="text-[11px] text-violet-400">Version 1.0 • {year}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="my-4 h-px bg-gradient-to-r from-transparent via-violet-400/30 to-transparent"></div>

        {/* Bottom */}
        <p className="text-center text-[11px] text-violet-400">
          © {year} Trade-Based Money Laundering Detection Corporation. All
          Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
