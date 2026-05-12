import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardAnalyticsCharts } from '../analytics/dashboard-analytics-charts';
import Link from 'next/link';

type TrendPoint = {
  label: string;
  fraud: number;
  suspicious: number;
  reports: number;
};

type VerdictPoint = {
  name: string;
  value: number;
};

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const formatDateKey = (date: Date) => date.toISOString().slice(0, 10);

type AnalyticsRange = 'week' | 'month';

interface AnalyticsSectionProps {
  range?: AnalyticsRange;
}

export async function AnalyticsSection({ range = 'week' }: AnalyticsSectionProps) {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const activeStart = range === 'month' ? startOfMonth : startOfWeek;

  const [rangeLogs, monthlyReports, verdictCounts, totalTransactions, totalReports] = await Promise.all([
    prisma.aml_audit_log.findMany({
      where: {
        loggedAt: { gte: activeStart },
      },
      select: {
        loggedAt: true,
        verdict: true,
      },
      orderBy: {
        loggedAt: 'asc',
      },
    }),
    prisma.sTRReport.findMany({
      where: {
        createdAt: { gte: startOfMonth },
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    }),
    prisma.aml_audit_log.groupBy({
      by: ['verdict'],
      where: {
        loggedAt: { gte: activeStart },
      },
      _count: {
        verdict: true,
      },
    }),
    prisma.aml_audit_log.count(),
    prisma.sTRReport.count(),
  ]);

  const fraudThisPeriod = verdictCounts.find((item) => item.verdict.toLowerCase() === 'fraud')?._count.verdict ?? 0;
  const suspiciousThisPeriod = verdictCounts.find((item) => item.verdict.toLowerCase() === 'suspicious')?._count.verdict ?? 0;
  const legitimateThisPeriod = verdictCounts.find((item) => item.verdict.toLowerCase() === 'legitimate')?._count.verdict ?? 0;
  const reportsThisMonth = monthlyReports.length;

  const trendByDay: Record<string, TrendPoint> = {};
  for (let index = 0; index < 7; index += 1) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + index);
    const key = formatDateKey(date);
    trendByDay[key] = {
      label: dayLabels[date.getDay()],
      fraud: 0,
      suspicious: 0,
      reports: 0,
    };
  }

  rangeLogs.forEach((log) => {
    const key = formatDateKey(log.loggedAt);
    if (!trendByDay[key]) {
      return;
    }

    if (log.verdict.toLowerCase() === 'fraud') {
      trendByDay[key].fraud += 1;
    } else if (log.verdict.toLowerCase() === 'suspicious') {
      trendByDay[key].suspicious += 1;
    }
  });

  monthlyReports.forEach((report) => {
    const key = formatDateKey(report.createdAt);
    if (trendByDay[key]) {
      trendByDay[key].reports += 1;
    }
  });

  const trendData = Object.values(trendByDay);

  const verdictBreakdown: VerdictPoint[] = [
    { name: 'Fraud', value: fraudThisPeriod },
    { name: 'Suspicious', value: suspiciousThisPeriod },
    { name: 'Legitimate', value: legitimateThisPeriod },
  ];

  const recentReports = await prisma.sTRReport.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: {
      transactionId: true,
      createdAt: true,
      actionTaken: true,
      createdBy: {
        select: {
          email: true,
          bankName: true,
        },
      },
    },
  });

  const rangeHref = (nextRange: AnalyticsRange) => `/dashboard?section=analytics&analyticsRange=${nextRange}`;

  return (
    <div className="w-full h-full p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto fade-up">
      <div className="space-y-6 md:space-y-8">
        <section className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/40 px-6 md:px-8 py-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-sky-700 font-semibold">Insights</p>
          <h2 className="mt-2 md:mt-3 text-xl md:text-2xl lg:text-3xl font-semibold text-slate-900">
            AML analytics overview
          </h2>
          <p className="mt-2 md:mt-3 text-sm md:text-base text-slate-600">
            DB-backed case volume, verdict grouping, and STR filing activity across the selected period.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href={rangeHref('week')}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                range === 'week' ? 'bg-sky-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              This Week
            </Link>
            <Link
              href={rangeHref('month')}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                range === 'month' ? 'bg-sky-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              This Month
            </Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Total Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">{totalTransactions.toLocaleString()}</p>
              <p className="mt-2 text-xs text-slate-500">All AML audit log entries</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Fraud This {range === 'month' ? 'Month' : 'Week'}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-rose-600">{fraudThisPeriod}</p>
              <p className="mt-2 text-xs text-slate-500">From the selected period</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Suspicious This {range === 'month' ? 'Month' : 'Week'}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-amber-600">{suspiciousThisPeriod}</p>
              <p className="mt-2 text-xs text-slate-500">Review queue volume</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">STRs Filed This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-sky-700">{reportsThisMonth}</p>
              <p className="mt-2 text-xs text-slate-500">Total filed reports: {totalReports}</p>
            </CardContent>
          </Card>
        </section>

        <DashboardAnalyticsCharts trendData={trendData} verdictBreakdown={verdictBreakdown} />

        <section className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Recent STR filings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentReports.length === 0 ? (
                <p className="text-sm text-slate-500">No STR reports have been filed yet.</p>
              ) : (
                recentReports.map((report) => (
                  <div key={report.transactionId} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="font-semibold text-slate-900">{report.transactionId}</p>
                    <p className="text-sm text-slate-600">{report.createdBy.email}</p>
                    <p className="text-xs text-slate-500 mt-1">{report.actionTaken.replaceAll('_', ' ')}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}