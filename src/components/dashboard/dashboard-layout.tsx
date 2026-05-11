import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { DashboardSection } from './sections/dashboard-section';
import { NewUserRegistrationSection } from './sections/new-user-section';
import { DashboardSidebar } from './dashboard-sidebar';
import { FileText } from 'lucide-react';

interface DashboardLayoutProps {
  userRole?: string;
  userEmail?: string;
  fraudSearch: string;
  fraudPage: number;
  fraudMinRisk: number;
  activeSection?: string;
}

export async function DashboardLayout({
  userRole,
  userEmail,
  fraudSearch,
  fraudPage,
  fraudMinRisk,
  activeSection = 'dashboard',
}: DashboardLayoutProps) {
  const renderSection = () => {
    switch (activeSection) {
      case 'new-user':
        return <NewUserRegistrationSection createdBy={userEmail || ''} />;
      case 'reports':
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-6">Reports</h1>
            <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
              <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">Reports section coming soon</p>
            </div>
          </div>
        );
      case 'dashboard':
      default:
        return (
          <DashboardSection
            userRole={userRole}
            userEmail={userEmail}
            fraudSearch={fraudSearch}
            fraudPage={fraudPage}
            fraudMinRisk={fraudMinRisk}
          />
        );
    }
  };

  return (
    <div className="flex h-full min-h-screen bg-slate-50">
      <DashboardSidebar userRole={userRole} userEmail={userEmail} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Suspense fallback={<LoadingSpinner />}>
          {renderSection()}
        </Suspense>
      </main>
    </div>
  );
}
