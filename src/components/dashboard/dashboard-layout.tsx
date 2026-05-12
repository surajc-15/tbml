import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { DashboardSection } from './sections/dashboard-section';
import { NewUserRegistrationSection } from './sections/new-user-section';
import { DashboardSidebar } from './dashboard-sidebar';
import { AnalyticsSection } from './sections/analytics-section';
import { BankUserDashboardView } from './bank-user-dashboard-view';
import { TransactionSimulationPanel } from './transaction-simulation-panel';
import { FlaggedFraudTable } from './flagged-fraud-table';
import { SuspiciousTransactionsTable } from './suspicious-transactions-table';

interface DashboardLayoutProps {
  userRole?: string;
  userEmail?: string;
  userBank?: string;
  fraudSearch: string;
  fraudPage: number;
  fraudMinRisk: number;
  suspiciousSearch?: string;
  suspiciousPage?: number;
  analyticsRange?: 'week' | 'month';
  activeSection?: string;
}

export async function DashboardLayout({
  userRole,
  userEmail,
  userBank = '',
  fraudSearch,
  fraudPage,
  fraudMinRisk,
  suspiciousSearch = '',
  suspiciousPage = 1,
  analyticsRange = 'week',
  activeSection = 'dashboard',
}: DashboardLayoutProps) {
  const isAdmin = userRole === 'ADMIN';

  return (
    <div className="flex h-full min-h-screen bg-slate-50">
      <DashboardSidebar userRole={userRole} activeSection={activeSection} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Suspense fallback={<LoadingSpinner />}>
          {isAdmin ? (
            // Admin sections
            activeSection === 'analytics' ? (
              <AnalyticsSection range={analyticsRange} />
            ) : activeSection === 'bank-users' ? (
              <NewUserRegistrationSection createdBy={userEmail || ''} />
            ) : (
              <DashboardSection
                fraudSearch={fraudSearch}
                fraudPage={fraudPage}
                fraudMinRisk={fraudMinRisk}
              />
            )
          ) : (
            // Bank user sections
            activeSection === 'analytics' ? (
              <AnalyticsSection range={analyticsRange} />
            ) : activeSection === 'suspicious' ? (
              <div className="w-full h-full p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto fade-up">
                <SuspiciousTransactionsTable 
                  userBank={userBank}
                  query={suspiciousSearch} 
                  page={suspiciousPage} 
                />
              </div>
            ) : activeSection === 'fraud' ? (
              <div className="w-full h-full p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto fade-up">
                <FlaggedFraudTable
                  userRole="BANK_USER"
                  userBank={userBank}
                  query={fraudSearch}
                  page={fraudPage}
                  minRisk={fraudMinRisk}
                />
              </div>
            ) : activeSection === 'simulate' ? (
              <div className="w-full h-full p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto fade-up">
                <TransactionSimulationPanel />
              </div>
            ) : (
              // Default dashboard view showing both fraud and suspicious
              <BankUserDashboardView
                userBank={userBank}
                fraudSearch={fraudSearch}
                fraudPage={fraudPage}
                fraudMinRisk={fraudMinRisk}
                suspiciousSearch={suspiciousSearch}
                suspiciousPage={suspiciousPage}
              />
            )
          )}
        </Suspense>
      </main>
    </div>
  );
}
