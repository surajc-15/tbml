import { getCurrentUser } from '@/lib/auth';
import { Sidebar } from '@/components/dashboard/sidebar';
import { DashboardSection } from '@/components/dashboard/sections/dashboard-section';
import { NewUserRegistrationSection } from '@/components/dashboard/sections/new-user-section';
import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DashboardPage({ searchParams }: PageProps) {
  const user = await getCurrentUser();

  if (!user) {
    return null; // Layout redirects to sign-in
  }

  const params = (await searchParams) ?? {};
  const section = typeof params.section === "string" ? params.section : "dashboard";
  const fraudSearch = typeof params.fraudSearch === "string" ? params.fraudSearch : "";
  const fraudPage = Number(typeof params.fraudPage === "string" ? params.fraudPage : "1");
  const fraudMinRisk = Number(typeof params.fraudMinRisk === "string" ? params.fraudMinRisk : "80");

  return (
    <div className="flex flex-1 overflow-hidden h-[calc(100vh-5rem)] w-full">
      <Sidebar activeSection={section} userRole={user.role} />
      <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden relative bg-slate-50">
        <Suspense fallback={<LoadingSpinner />}>
          {section === 'new-user' ? (
            <NewUserRegistrationSection createdBy={user.email} />
          ) : (
            <DashboardSection
              userRole={user.role}
              userEmail={user.email}
              fraudSearch={fraudSearch}
              fraudPage={Number.isFinite(fraudPage) ? fraudPage : 1}
              fraudMinRisk={Number.isFinite(fraudMinRisk) ? fraudMinRisk : 80}
            />
          )}
        </Suspense>
      </main>
    </div>
  );
}


