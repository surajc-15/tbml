import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function CompliancePanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Compliance Workbench</CardTitle>
        <CardDescription>Regulatory readiness snapshot and AML control health overview.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">KYC Refresh</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">93%</p>
          <Badge variant="legitimate" className="mt-2">On Track</Badge>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">STR Filing SLA</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">98%</p>
          <Badge variant="legitimate" className="mt-2">Healthy</Badge>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Audit Exceptions</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">4</p>
          <Badge variant="suspicious" className="mt-2">Review Needed</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
