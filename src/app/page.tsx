import { HeaderStats } from "@/components/dashboard/header-stats";
import { Sidebar } from "@/components/dashboard/sidebar";
import { FlaggedFraudTable } from "@/components/dashboard/flagged-fraud-table";
import { SuspiciousTransactionsTable } from "@/components/dashboard/suspicious-transactions-table";
import { TransactionSimulationPanel } from "@/components/dashboard/transaction-simulation-panel";
import { CompliancePanel } from "@/components/dashboard/compliance-panel";
import { flaggedFraudAccounts, suspiciousTransactions } from "@/lib/mock-data";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Home({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const section = typeof params.section === "string" ? params.section : "overview";
  const fraudSearch = typeof params.fraudSearch === "string" ? params.fraudSearch : "";
  const suspiciousSearch = typeof params.suspiciousSearch === "string" ? params.suspiciousSearch : "";
  const fraudPage = Number(typeof params.fraudPage === "string" ? params.fraudPage : "1");
  const suspiciousPage = Number(typeof params.suspiciousPage === "string" ? params.suspiciousPage : "1");
  const fraudMinRisk = Number(typeof params.fraudMinRisk === "string" ? params.fraudMinRisk : "80");

  const validSections = new Set(["overview", "fraud", "suspicious", "simulation", "compliance"]);
  const activeSection = validSections.has(section) ? section : "overview";

  return (
    <div className="min-h-screen p-3 md:p-6 lg:p-8">
      <div className="flex w-full gap-4 lg:gap-6">
        <Sidebar />
        <main className="min-w-0 flex-1 space-y-6">
          <section className="glass-panel fade-up rounded-2xl border border-slate-200 px-5 py-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-sky-700">Anti Money Laundering Console</p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-900">Trade-Based Money Laundering Detection Dashboard</h2>
            <p className="mt-2 text-sm text-slate-600">
              Monitor confirmed fraud, investigate suspicious activity, and run transaction simulations from one compliance-ready workspace.
            </p>
          </section>

          <HeaderStats
            totalTransactions={7642}
            fraudAlerts={flaggedFraudAccounts.length}
            suspiciousAlerts={suspiciousTransactions.length}
          />

          <section className="fade-up space-y-6">
            {activeSection === "overview" && (
              <>
                <FlaggedFraudTable
                  query={fraudSearch}
                  page={Number.isFinite(fraudPage) ? fraudPage : 1}
                  minRisk={Number.isFinite(fraudMinRisk) ? fraudMinRisk : 80}
                />
                <SuspiciousTransactionsTable
                  query={suspiciousSearch}
                  page={Number.isFinite(suspiciousPage) ? suspiciousPage : 1}
                />
                <TransactionSimulationPanel />
              </>
            )}

            {activeSection === "fraud" && (
              <FlaggedFraudTable
                query={fraudSearch}
                page={Number.isFinite(fraudPage) ? fraudPage : 1}
                minRisk={Number.isFinite(fraudMinRisk) ? fraudMinRisk : 80}
              />
            )}

            {activeSection === "suspicious" && (
              <SuspiciousTransactionsTable
                query={suspiciousSearch}
                page={Number.isFinite(suspiciousPage) ? suspiciousPage : 1}
              />
            )}

            {activeSection === "simulation" && <TransactionSimulationPanel />}

            {activeSection === "compliance" && <CompliancePanel />}
          </section>
        </main>
      </div>
    </div>
  );
}
