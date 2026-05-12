"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  LineChart,
} from 'recharts';

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

type Props = {
  trendData: TrendPoint[];
  verdictBreakdown: VerdictPoint[];
  compact?: boolean;
};

const verdictColors = ['#e11d48', '#f59e0b', '#0f766e'];

export function DashboardAnalyticsCharts({ trendData, verdictBreakdown, compact = false }: Props) {
  return (
    <div className={compact ? 'grid gap-4 xl:grid-cols-2' : 'grid gap-4 xl:grid-cols-2'}>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Weekly case trend</h3>
        <div className={compact ? 'h-[240px]' : 'h-[320px]'}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="fraud" stroke="#e11d48" strokeWidth={3} dot />
              <Line type="monotone" dataKey="suspicious" stroke="#f59e0b" strokeWidth={3} dot />
              <Line type="monotone" dataKey="reports" stroke="#0f766e" strokeWidth={3} dot />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Activity breakdown</h3>
        <div className={compact ? 'h-[240px]' : 'h-[320px]'}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="fraud" fill="#e11d48" radius={[6, 6, 0, 0]} />
              <Bar dataKey="suspicious" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              <Bar dataKey="reports" fill="#0f766e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-6 h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={verdictBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {verdictBreakdown.map((entry, index) => (
                  <Cell key={entry.name} fill={verdictColors[index % verdictColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}