"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { accountOptions, commodityOptions, routeOptions } from "@/lib/mock-data";
import { useDashboardStore } from "@/store/dashboard-store";
import type { SimulationInput, SimulationMode, SimulationResult } from "@/types/aml";
import { TransactionTimeline } from "@/components/dashboard/transaction-timeline";

const defaultForm: SimulationInput = {
  senderAccount: "",
  receiverAccount: "",
  amount: 0,
  commodity: "",
  countryRoute: "",
  remarks: "",
};

export function TransactionSimulationPanel() {
  const { simulationMode, simulationResult, setSimulationMode, setSimulationResult } = useDashboardStore();
  const [form, setForm] = useState<SimulationInput>(defaultForm);

  const selectedTypeBadge = useMemo(() => {
    if (simulationResult?.prediction === "Fraud") return "fraud" as const;
    if (simulationResult?.prediction === "Suspicious") return "suspicious" as const;
    return "legitimate" as const;
  }, [simulationResult]);

  const runAnalysis = (mode: SimulationMode): SimulationResult => {
    const amountRisk = form.amount >= 1000000 ? 35 : form.amount >= 500000 ? 22 : 10;
    const routeRisk = form.countryRoute.includes("UAE") || form.countryRoute.includes("Nigeria") ? 25 : 12;
    const remarkRisk = /urgent|third-party|split|cash/i.test(form.remarks) ? 18 : 6;
    const modeBias = mode === "fraud" ? 24 : -6;
    const score = Math.max(5, Math.min(99, amountRisk + routeRisk + remarkRisk + modeBias));

    let prediction: SimulationResult["prediction"] = "Safe";
    if (score >= 80) prediction = "Fraud";
    else if (score >= 50) prediction = "Suspicious";

    const now = new Date();
    const toTime = (plusMin: number) => {
      const date = new Date(now.getTime() + plusMin * 60000);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    return {
      riskScore: score,
      prediction,
      steps: [
        {
          timestamp: toTime(0),
          title: "Transaction Initiated",
          detail: `${form.senderAccount} initiated ${form.commodity} trade to ${form.receiverAccount}.`,
        },
        {
          timestamp: toTime(3),
          title: "Route & Counterparty Screening",
          detail: `Route ${form.countryRoute} screened against AML corridor watchlists.`,
        },
        {
          timestamp: toTime(6),
          title: "Behavioral Scoring",
          detail: `Score assigned using amount pattern, route profile, and textual remarks indicators.`,
        },
        {
          timestamp: toTime(8),
          title: "Risk Outcome Produced",
          detail: `Model produced ${prediction} prediction at ${score}/100 risk score.`,
        },
      ],
    };
  };

  const submitTransaction = () => {
    if (!form.senderAccount || !form.receiverAccount || !form.commodity || !form.countryRoute || !form.amount) {
      toast.error("Please complete all required fields before submission.");
      return;
    }
    toast.success("Transaction initiated in simulation sandbox.");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Section 3: Transaction Simulation Panel</CardTitle>
        <CardDescription>Manually simulate transactions for AML/TBML fraud detection logic testing.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <button
            onClick={() => setSimulationMode("legitimate")}
            className={`rounded-xl border p-4 text-left transition ${
              simulationMode === "legitimate"
                ? "border-emerald-300 bg-emerald-50"
                : "border-slate-200 bg-white hover:border-emerald-200"
            }`}
          >
            <p className="text-xs uppercase tracking-wide text-slate-500">Simulation Card</p>
            <h4 className="mt-1 text-base font-semibold text-slate-800">Initiate Legitimate Transaction</h4>
          </button>

          <button
            onClick={() => setSimulationMode("fraud")}
            className={`rounded-xl border p-4 text-left transition ${
              simulationMode === "fraud"
                ? "border-rose-300 bg-rose-50"
                : "border-slate-200 bg-white hover:border-rose-200"
            }`}
          >
            <p className="text-xs uppercase tracking-wide text-slate-500">Simulation Card</p>
            <h4 className="mt-1 text-base font-semibold text-slate-800">Initiate Fraud Transaction</h4>
          </button>
        </div>

        {simulationMode && (
          <div className="grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Sender Account</label>
              <Select onValueChange={(value) => setForm((prev) => ({ ...prev, senderAccount: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Search sender account" />
                </SelectTrigger>
                <SelectContent>
                  {accountOptions.map((option) => (
                    <SelectItem key={`sender-${option}`} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Receiver Account</label>
              <Select onValueChange={(value) => setForm((prev) => ({ ...prev, receiverAccount: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Search receiver account" />
                </SelectTrigger>
                <SelectContent>
                  {accountOptions.map((option) => (
                    <SelectItem key={`receiver-${option}`} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Amount</label>
              <Input
                type="number"
                placeholder="Enter amount"
                onChange={(event) => setForm((prev) => ({ ...prev, amount: Number(event.target.value) }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Trade Commodity</label>
              <Select onValueChange={(value) => setForm((prev) => ({ ...prev, commodity: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select commodity" />
                </SelectTrigger>
                <SelectContent>
                  {commodityOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-700">Country Route</label>
              <Select onValueChange={(value) => setForm((prev) => ({ ...prev, countryRoute: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select trade corridor" />
                </SelectTrigger>
                <SelectContent>
                  {routeOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-700">Remarks</label>
              <Textarea
                placeholder="Add contextual remarks and unusual behavior observations"
                onChange={(event) => setForm((prev) => ({ ...prev, remarks: event.target.value }))}
              />
            </div>

            <div className="flex flex-wrap gap-2 md:col-span-2">
              <Button onClick={submitTransaction}>Initiate Transaction</Button>
              <Button
                variant="outline"
                onClick={() => {
                  const result = runAnalysis(simulationMode);
                  setSimulationResult(result);
                  toast.success("Risk analysis completed.");
                }}
              >
                Run Risk Analysis
              </Button>
            </div>
          </div>
        )}

        {simulationResult && (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="md:col-span-1">
                <CardContent className="space-y-1 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Risk Score</p>
                  <p className="text-3xl font-bold text-slate-900">{simulationResult.riskScore}/100</p>
                </CardContent>
              </Card>
              <Card className="md:col-span-2">
                <CardContent className="space-y-1 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Prediction</p>
                  <Badge variant={selectedTypeBadge} className="text-sm">
                    {simulationResult.prediction}
                  </Badge>
                </CardContent>
              </Card>
            </div>

            <TransactionTimeline result={simulationResult} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
