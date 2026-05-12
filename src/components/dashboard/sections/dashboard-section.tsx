import { AdminDashboardView } from '../admin/admin-dashboard-view';

interface DashboardSectionProps {
  fraudSearch?: string;
  fraudPage?: number;
  fraudMinRisk?: number;
}

export function DashboardSection({
  fraudSearch = '',
  fraudPage = 1,
  fraudMinRisk = 80,
}: DashboardSectionProps) {
  return (
    <AdminDashboardView
      fraudSearch={fraudSearch}
      fraudPage={fraudPage}
      fraudMinRisk={fraudMinRisk}
    />
  );
}

