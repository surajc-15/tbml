import { AdminUserForm } from './admin-user-form';
import { SuspiciousTransactionsTable } from './suspicious-transactions-table';
import { FlaggedFraudTable } from './flagged-fraud-table';

interface BankUserDashboardViewProps {
  userBank?: string;
  fraudSearch?: string;
  fraudPage?: number;
  fraudMinRisk?: number;
  suspiciousSearch?: string;
  suspiciousPage?: number;
}

export function BankUserDashboardView({
  userBank = '',
  fraudSearch = '',
  fraudPage = 1,
  fraudMinRisk = 80,
  suspiciousSearch = '',
  suspiciousPage = 1,
}: BankUserDashboardViewProps) {
  return (
    <div className="w-full h-full p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto fade-up">
      <div className="space-y-6 md:space-y-8">
        <section className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/40 px-6 md:px-8 py-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-sky-700 font-semibold">Bank User Console</p>
          <h2 className="mt-2 md:mt-3 text-xl md:text-2xl lg:text-3xl font-semibold text-slate-900">
            Monitoring cases assigned to your bank
          </h2>
          <p className="mt-2 md:mt-3 text-sm md:text-base text-slate-600">
            Review suspicious alerts and fraud cases in the same dashboard flow, then wait for compliance-generated STR actions.
          </p>
        </section>

        {/* <section className="w-full">
          <AdminUserForm createdBy={userBank || 'Bank user'} />
        </section> */}

        {/* Fraud Transactions - shown first */}
        <FlaggedFraudTable
          userRole="BANK_USER"
          userBank={userBank}
          query={fraudSearch}
          page={Number.isFinite(fraudPage) ? fraudPage : 1}
          minRisk={Number.isFinite(fraudMinRisk) ? fraudMinRisk : 80}
        />

        {/* Suspicious Transactions - shown below fraud */}
        <SuspiciousTransactionsTable 
          userBank={userBank}
          query={suspiciousSearch} 
          page={suspiciousPage} 
        />
      </div>
    </div>
  );
}