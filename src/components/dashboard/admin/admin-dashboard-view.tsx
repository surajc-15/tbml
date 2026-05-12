import { FlaggedFraudTable } from '../flagged-fraud-table';

interface AdminDashboardViewProps {
  fraudSearch?: string;
  fraudPage?: number;
  fraudMinRisk?: number;
}

export function AdminDashboardView({
  fraudSearch = '',
  fraudPage = 1,
  fraudMinRisk = 80,
}: AdminDashboardViewProps) {
  return (
    <div className="w-full h-full p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto fade-up">
      <div className="space-y-6 md:space-y-8">
        <section className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/40 px-6 md:px-8 py-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
          <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-sky-700 font-semibold">
            Anti Money Laundering Console
          </p>
          <h2 className="mt-2 md:mt-3 text-xl md:text-2xl lg:text-3xl font-semibold text-slate-900">
            Fraud transactions and bank user management
          </h2>
              <p className="mt-2 md:mt-3 text-sm md:text-base text-slate-600">
                Fraud verdict transactions are listed below for compliance review.
              </p>
        </section>


        <section className="w-full">
          <FlaggedFraudTable
            userRole="ADMIN"
            query={fraudSearch}
            page={Number.isFinite(fraudPage) ? fraudPage : 1}
            minRisk={Number.isFinite(fraudMinRisk) ? fraudMinRisk : 80}
          />
        </section>
      </div>
    </div>
  );
}