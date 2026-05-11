import { getCurrentUser } from '@/lib/auth';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DashboardPage({ searchParams }: PageProps) {
  const user = await getCurrentUser();

  if (!user) {
    return null; // Layout redirects to sign-in
  }

  const params = (await searchParams) ?? {};
  const fraudSearch = typeof params.fraudSearch === "string" ? params.fraudSearch : "";
  const fraudPage = Number(typeof params.fraudPage === "string" ? params.fraudPage : "1");
  const fraudMinRisk = Number(typeof params.fraudMinRisk === "string" ? params.fraudMinRisk : "80");
  const activeSection = typeof params.section === "string" ? params.section : "dashboard";

  return (
    <DashboardLayout
      userRole={user.role}
      userEmail={user.email}
      fraudSearch={fraudSearch}
      fraudPage={Number.isFinite(fraudPage) ? fraudPage : 1}
      fraudMinRisk={Number.isFinite(fraudMinRisk) ? fraudMinRisk : 80}
      activeSection={activeSection}
    />
  );
}



