"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { FraudAccount } from "@/types/aml";

type StrReport = {
  executiveSummary: string;
  transactionDetails: string;
  riskIndicators: string;
  recommendation: string;
};

type StrApiResponse = {
  report?: {
    executiveSummary?: unknown;
    transactionDetails?: unknown;
    riskIndicators?: unknown;
    recommendation?: unknown;
  };
};

function toDisplayText(value: unknown, fallback: string): string {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map((entry) => toDisplayText(entry, "")).filter(Boolean).join("\n");
  }

  if (value && typeof value === "object") {
    const objectLines = Object.entries(value as Record<string, unknown>).map(
      ([key, val]) => `${key}: ${toDisplayText(val, "")}`,
    );
    return objectLines.join("\n");
  }

  return fallback;
}

function normalizeReport(data: StrApiResponse): StrReport {
  const report = data.report ?? {};
  return {
    executiveSummary: toDisplayText(report.executiveSummary, "Executive summary unavailable."),
    transactionDetails: toDisplayText(report.transactionDetails, "Transaction details unavailable."),
    riskIndicators: toDisplayText(report.riskIndicators, "Risk indicators unavailable."),
    recommendation: toDisplayText(report.recommendation, "Recommendation unavailable."),
  };
}

export function FraudRowActions({ account }: { account: FraudAccount }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<StrReport | null>(null);

  const generateReport = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/str/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountHolder: account.holderName,
          transactionId: account.transactionId,
          amount: account.amount,
          countryRoute: account.country,
          riskIndicators: account.riskIndicators,
          tradeDetails: account.tradeDetails,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate STR report");
      }

      const data = (await response.json()) as StrApiResponse;
      setReport(normalizeReport(data));
      toast.success("STR report generated successfully.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not generate report.");
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = () => {
    if (!report) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Suspicious Transaction Report", 14, 18);
    doc.setFontSize(11);

    const lines = [
      "Executive Summary",
      report.executiveSummary,
      "",
      "Transaction Details",
      report.transactionDetails,
      "",
      "Risk Indicators",
      report.riskIndicators,
      "",
      "Recommendation",
      report.recommendation,
    ];

    const wrapped = doc.splitTextToSize(lines.join("\n"), 180);
    doc.text(wrapped, 14, 30);
    doc.save(`STR-${account.transactionId}.pdf`);
  };

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
      <Button
        size="sm"
        className="w-full justify-center"
        onClick={() => {
          setIsOpen(true);
          if (!report) {
            void generateReport();
          }
        }}
      >
        Generate STR Report
      </Button>
      <Button
        size="sm"
        className="w-full justify-center"
        variant="outline"
        onClick={() => toast.success(`Compliance team notified for ${account.accountId}.`)}
      >
        Notify Compliance Team
      </Button>
      <Button
        size="sm"
        className="w-full justify-center"
        variant="destructive"
        onClick={() => toast.warning(`Account ${account.accountId} frozen.`)}
      >
        Freeze Account
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Auto-Generated STR Report</SheetTitle>
            <SheetDescription>{account.holderName} • {account.transactionId}</SheetDescription>
          </SheetHeader>

          <div className="space-y-5">
            {loading && (
              <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                <Loader2 className="h-4 w-4 animate-spin" /> Generating report with Groq...
              </div>
            )}

            {report && (
              <div className="space-y-4 rounded-xl border border-slate-200 p-4">
                <section>
                  <h4 className="font-semibold text-slate-900">Executive Summary</h4>
                  <p className="mt-1 text-sm text-slate-600">{report.executiveSummary}</p>
                </section>
                <section>
                  <h4 className="font-semibold text-slate-900">Transaction Details</h4>
                  <p className="mt-1 text-sm text-slate-600">{report.transactionDetails}</p>
                </section>
                <section>
                  <h4 className="font-semibold text-slate-900">Risk Indicators</h4>
                  <p className="mt-1 text-sm text-slate-600">{report.riskIndicators}</p>
                </section>
                <section>
                  <h4 className="font-semibold text-slate-900">Recommendation</h4>
                  <p className="mt-1 text-sm text-slate-600">{report.recommendation}</p>
                </section>
              </div>
            )}

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Button className="w-full justify-center" variant="outline" onClick={() => void generateReport()} disabled={loading}>
                Regenerate Report
              </Button>
              <Button className="w-full justify-center" onClick={downloadPdf} disabled={!report}>
                Download as PDF
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
