import { BellRing, ShieldAlert, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskHeatmapChart } from "@/components/dashboard/risk-heatmap-chart";

type Props = {
  totalTransactions: number;
  fraudAlerts: number;
  suspiciousAlerts: number;
};

export function HeaderStats({ totalTransactions, fraudAlerts, suspiciousAlerts }: Props) {
  return (
    <section className="grid gap-4 xl:grid-cols-4">
      <Card className="xl:col-span-1">
        <CardHeader>
          <CardTitle className="text-sm text-slate-500">Total Transactions Today</CardTitle>
        </CardHeader>
        <CardContent className="flex items-end justify-between">
          <p className="text-3xl font-bold text-slate-900">{totalTransactions.toLocaleString()}</p>
          <Wallet className="h-5 w-5 text-slate-400" />
        </CardContent>
      </Card>

      <Card className="xl:col-span-1">
        <CardHeader>
          <CardTitle className="text-sm text-slate-500">Fraud Alerts Count</CardTitle>
        </CardHeader>
        <CardContent className="flex items-end justify-between">
          <p className="text-3xl font-bold text-rose-600">{fraudAlerts}</p>
          <ShieldAlert className="h-5 w-5 text-rose-400" />
        </CardContent>
      </Card>

      <Card className="xl:col-span-1">
        <CardHeader>
          <CardTitle className="text-sm text-slate-500">Suspicious Alerts Count</CardTitle>
        </CardHeader>
        <CardContent className="flex items-end justify-between">
          <p className="text-3xl font-bold text-amber-600">{suspiciousAlerts}</p>
          <BellRing className="h-5 w-5 text-amber-400" />
        </CardContent>
      </Card>

      <Card className="xl:col-span-1">
        <CardHeader>
          <CardTitle className="text-sm text-slate-500">Risk Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <RiskHeatmapChart />
        </CardContent>
      </Card>
    </section>
  );
}
