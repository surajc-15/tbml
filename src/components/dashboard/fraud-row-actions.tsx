"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { FraudAccount, StrReport } from "@/types/aml";

type StrApiResponse = {
  alreadyGenerated?: boolean;
  source?: string;
  report?: {
    id?: number;
    transactionId?: string;
    createdAt?: string;
    actionTaken?: string;
    createdById?: string;
    createdBy?: {
      email?: string | null;
      name?: string | null;
      username?: string | null;
    } | null;
    reportMarkdown?: string | null;
    executiveSummary?: unknown;
    transactionDetails?: unknown;
    riskIndicators?: unknown;
    analyticalInsights?: unknown;
    recommendation?: unknown;
    professionalNotice?: unknown;
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
    analyticalInsights: toDisplayText(report.analyticalInsights, "Analytical insights unavailable."),
    recommendation: toDisplayText(report.recommendation, "Recommendation unavailable."),
    professionalNotice: toDisplayText(report.professionalNotice, "Professional notice unavailable."),
  };
}

function stripSectionTitle(value: string): string {
  const [firstLine, ...remaining] = value.split("\n");
  if (/^[A-Za-z ]+$/.test(firstLine.trim()) && remaining.length > 0) {
    return remaining.join("\n");
  }
  return value;
}

function sectionLines(content: string): string[] {
  return content
    .split("\n")
    .map((line) => line.replace(/^[-*\d.\s]+/, "").trim())
    .filter(Boolean);
}

function reportSections(report: StrReport): Array<{ title: string; content: string }> {
  return [
    { title: "Executive Summary", content: stripSectionTitle(report.executiveSummary) },
    { title: "Transaction Details", content: stripSectionTitle(report.transactionDetails) },
    { title: "Risk Indicators", content: stripSectionTitle(report.riskIndicators) },
    { title: "Analytical Insights", content: stripSectionTitle(report.analyticalInsights) },
    { title: "Recommendation", content: stripSectionTitle(report.recommendation) },
    { title: "Professional Notice", content: stripSectionTitle(report.professionalNotice) },
  ];
}

function parseStoredReportMarkdown(markdown: string): StrReport {
  const sections: Record<string, string> = {};
  let currentTitle: string | null = null;
  let buffer: string[] = [];

  const commit = () => {
    if (currentTitle) {
      sections[currentTitle] = buffer.join("\n").trim();
    }
    buffer = [];
  };

  markdown.split(/\r?\n/).forEach((line) => {
    const headingMatch = line.match(/^#{1,6}\s+(.*)$/);
    if (headingMatch) {
      commit();
      currentTitle = headingMatch[1].trim();
      return;
    }

    buffer.push(line);
  });

  commit();

  const pick = (...titles: string[]) => titles.map((title) => sections[title]).find(Boolean) ?? "";

  return {
    executiveSummary: pick("Executive Summary"),
    transactionDetails: pick("Transaction Details"),
    riskIndicators: pick("Risk Indicators"),
    analyticalInsights: pick("Analytical Insights"),
    recommendation: pick("Recommendation"),
    professionalNotice: pick("Professional Notice"),
  };
}

export function FraudRowActions({ account, userRole }: { account: FraudAccount; userRole?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifying, setNotifying] = useState(false);
  const [actionLoading, setActionLoading] = useState<"freeze" | "documents" | null>(null);
  const [alreadyNotified, setAlreadyNotified] = useState(Boolean(account.hasStrReport));
  const [showReport, setShowReport] = useState(false);
  const [report, setReport] = useState<StrReport | null>(null);
  const [storedReportMeta, setStoredReportMeta] = useState<{
    createdAt?: string;
    actionTaken?: string;
    createdByEmail?: string | null;
    createdByName?: string | null;
    createdByUsername?: string | null;
  } | null>(null);

  const metadataEntries = Object.entries(account.strMetadata ?? {}).filter(([key]) => key !== "reasons_for_flagging");
  const primaryMetrics = metadataEntries.slice(0, 8);

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
      setShowReport(false);
      toast.success(data.alreadyGenerated ? "STR report already existed and was loaded." : "STR report generated successfully.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not generate report.");
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = () => {
    if (!report) return;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const bottomMargin = 16;
    const left = 12;
    const width = pageWidth - left * 2;
    let cursorY = 44;

    const sectionPalette = [
      { bg: [240, 249, 255], border: [186, 230, 253], heading: [12, 74, 110] },
      { bg: [255, 251, 235], border: [253, 230, 138], heading: [120, 53, 15] },
      { bg: [255, 241, 242], border: [254, 205, 211], heading: [136, 19, 55] },
      { bg: [238, 242, 255], border: [199, 210, 254], heading: [49, 46, 129] },
      { bg: [236, 253, 245], border: [167, 243, 208], heading: [6, 78, 59] },
      { bg: [248, 250, 252], border: [203, 213, 225], heading: [15, 23, 42] },
    ] as const;

    const drawPageBranding = () => {
      // Softer layered watermark so it blends with text without overpowering.
      doc.setFillColor(219, 234, 254);
      doc.circle(pageWidth / 2, pageHeight / 2, 28, "F");
      doc.setFillColor(147, 197, 253);
      doc.circle(pageWidth / 2, pageHeight / 2, 22, "F");

      // Accent orbit stroke for a more official emblem look.
      doc.setDrawColor(241, 245, 249);
      doc.setLineWidth(0.5);
      doc.line(pageWidth / 2 - 19, pageHeight / 2 + 5, pageWidth / 2 + 19, pageHeight / 2 - 5);

      // Keep center text visible but softer than before.
      doc.setTextColor(239, 246, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(27);
      doc.text("DCAF", pageWidth / 2, pageHeight / 2 + 3.5, { align: "center" });

      doc.setFillColor(239, 246, 255);
      doc.setDrawColor(191, 219, 254);
      doc.rect(left, 10, width, 24, "FD");

      doc.setFillColor(3, 105, 161);
      doc.circle(left + 10, 18, 6.5, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.text("DCAF", left + 5.8, 19.6);

      doc.setTextColor(3, 105, 161);
      doc.setFontSize(8.8);
      doc.text("OFFICIAL WORK NOTICE", left + 20, 15.5);

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(12.4);
      doc.text("Department of Compliance and Anti Money Laundering", left + 20, 21);

      doc.setTextColor(71, 85, 105);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text(`Case Ref: ${account.transactionId} | Account: ${account.accountId}`, left + 20, 26);

      doc.setDrawColor(148, 163, 184);
      doc.setLineWidth(0.4);
      doc.line(left, 37, left + width, 37);
    };

    const ensureSpace = (required: number) => {
      if (cursorY + required > pageHeight - bottomMargin) {
        doc.addPage();
        drawPageBranding();
        cursorY = 44;
      }
    };

    drawPageBranding();

    reportSections(report).forEach((section, index) => {
      const palette = sectionPalette[index % sectionPalette.length];
      const lines = sectionLines(section.content);
      const normalizedLines = lines.length > 0 ? lines : ["No additional details provided."];
      const contentWidth = width - 20;
      const wrappedByLine = normalizedLines.map((line) => doc.splitTextToSize(line, contentWidth) as string[]);

      const headingOffset = 7.5;
      const bodyStartOffset = 14;
      const bodyLineHeight = 5.2;
      const bottomPadding = 4.5;
      const sectionGap = 3;

      const drawSectionChunk = (chunk: string[][], title: string) => {
        const textRows = chunk.reduce((sum, wrapped) => sum + wrapped.length, 0);
        const sectionHeight = Math.max(24, bodyStartOffset + textRows * bodyLineHeight + bottomPadding);

        ensureSpace(sectionHeight + sectionGap);

        doc.setDrawColor(palette.border[0], palette.border[1], palette.border[2]);
        doc.setLineWidth(0.35);
        doc.roundedRect(left, cursorY, width, sectionHeight, 2, 2, "S");

        doc.setTextColor(palette.heading[0], palette.heading[1], palette.heading[2]);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text(title, left + 4, cursorY + headingOffset);

        doc.setTextColor(51, 65, 85);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);

        let lineY = cursorY + bodyStartOffset;
        chunk.forEach((wrapped) => {
          wrapped.forEach((wrappedLine, wrappedIndex) => {
            if (wrappedIndex === 0) {
              doc.setFillColor(100, 116, 139);
              doc.circle(left + 5, lineY - 1.4, 0.7, "F");
            }
            doc.text(wrappedLine, left + 7.5, lineY);
            lineY += bodyLineHeight;
          });
        });

        cursorY += sectionHeight + sectionGap;
      };

      let pointer = 0;
      let continuation = false;

      while (pointer < wrappedByLine.length) {
        const availableHeight = pageHeight - bottomMargin - cursorY - sectionGap;
        const maxRows = Math.max(1, Math.floor((availableHeight - bodyStartOffset - bottomPadding) / bodyLineHeight));

        if (maxRows <= 1 && availableHeight < 28) {
          doc.addPage();
          drawPageBranding();
          cursorY = 44;
          continue;
        }

        let rowsUsed = 0;
        const chunk: string[][] = [];

        while (pointer < wrappedByLine.length) {
          const candidate = wrappedByLine[pointer];
          const nextRows = rowsUsed + candidate.length;

          if (chunk.length > 0 && nextRows > maxRows) {
            break;
          }

          if (chunk.length === 0 && candidate.length > maxRows) {
            const fitCount = Math.max(1, maxRows);
            chunk.push(candidate.slice(0, fitCount));
            wrappedByLine[pointer] = candidate.slice(fitCount);
            rowsUsed += fitCount;
            break;
          }

          chunk.push(candidate);
          rowsUsed = nextRows;
          pointer += 1;
        }

        const title = continuation ? `${section.title} (cont.)` : section.title;
        drawSectionChunk(chunk, title);
        continuation = true;
      }
    });

    const pageCount = doc.getNumberOfPages();
    for (let page = 1; page <= pageCount; page++) {
      doc.setPage(page);
      doc.setTextColor(100, 116, 139);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text(`Page ${page} of ${pageCount}`, pageWidth - 28, pageHeight - 7);
      if (page > 1) {
        doc.text(`Case ${account.transactionId}`, left, pageHeight - 7);
      }
    }

    doc.save(`STR-${account.transactionId}.pdf`);
  };

  const notifyStakeholders = async () => {
    if (alreadyNotified) {
      toast.info("Notification already sent for this account.");
      return;
    }

    if (!report) {
      toast.warning("Generate STR report before sending notifications.");
      setIsOpen(true);
      return;
    }

    try {
      setNotifying(true);
      const response = await fetch("/api/str/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseType: "fraud", account, report }),
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(errorData.error ?? "Failed to notify stakeholders.");
      }

      setAlreadyNotified(true);
      toast.success("Urgent fraud alert sent and STR report stored for this transaction.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to send notification.");
    } finally {
      setNotifying(false);
    }
  };

  const sendActionRequest = async (actionType: "freeze" | "documents") => {
    try {
      setActionLoading(actionType);
      const response = await fetch("/api/str/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actionType, account }),
      });

      const payload = (await response.json().catch(() => ({}))) as { error?: string; message?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to process action request.");
      }

      toast.success(
        payload.message ??
          (actionType === "freeze"
            ? "Freeze request sent to sender and receiver banks."
            : "Document request sent to sender and receiver banks."),
      );
      setIsActionDialogOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to process action request.");
    } finally {
      setActionLoading(null);
    }
  };

  const loadStoredReport = async () => {
    try {
      setLoading(true);
      setIsOpen(true);
      const res = await fetch("/api/str/fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId: account.transactionId }),
      });
      if (!res.ok) throw new Error("Failed to load stored STR");
      const data = (await res.json()) as StrApiResponse;
      const storedReport = data.report;
      if (!storedReport) {
        throw new Error("Stored STR report missing");
      }
      const md = storedReport.reportMarkdown ?? "";
      setReport(parseStoredReportMarkdown(md));
      setStoredReportMeta({
        createdAt: storedReport.createdAt,
        actionTaken: storedReport.actionTaken,
        createdByEmail: storedReport.createdBy?.email ?? null,
        createdByName: storedReport.createdBy?.name ?? null,
        createdByUsername: storedReport.createdBy?.username ?? null,
      });
      setShowReport(true);
    } catch (err) {
      toast.error("Could not load stored STR report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
      {userRole === "BANK_USER" && (
        <Button
          size="sm"
          className="w-full justify-center"
          onClick={() => {
            setIsOpen(true);
            if (!report) {
              void generateReport();
            }
          }}
          disabled={loading || alreadyNotified}
        >
          Generate STR Report
        </Button>
      )}
      <Button
        size="sm"
        className="w-full justify-center"
        variant="outline"
        onClick={() => void notifyStakeholders()}
        disabled={notifying || alreadyNotified}
      >
        {notifying
          ? "Sending Fraud Alert..."
          : alreadyNotified
            ? "STR Report Exists"
            : "Send Urgent Fraud Alert"}
      </Button>
      {userRole === "ADMIN" && (
        <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="w-full justify-center" variant="destructive">
              Take Actions
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Transaction Action Center</DialogTitle>
              <DialogDescription>
                Review details and trigger actions for {account.transactionId}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 md:grid-cols-2">
                <p><strong>Account:</strong> {account.accountId}</p>
                <p><strong>Amount:</strong> ${account.amount.toLocaleString()}</p>
                <p><strong>Route:</strong> {account.country}</p>
                <p><strong>Risk Score:</strong> {account.riskScore.toFixed(2)}</p>
                <p className="md:col-span-2"><strong>Indicators:</strong> {account.riskIndicators.join(" | ")}</p>
                <p className="md:col-span-2"><strong>Trade Notes:</strong> {account.tradeDetails}</p>
              </div>

              {primaryMetrics.length > 0 && (
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                  <h4 className="text-sm font-semibold text-slate-800 mb-3">Structured Metrics</h4>
                  <div className="grid gap-2 md:grid-cols-2">
                    {primaryMetrics.map(([key, value]) => (
                      <div key={key} className="rounded-md border border-slate-100 bg-slate-50 px-3 py-2 text-sm">
                        <span className="font-medium text-slate-700">{key.replace(/_/g, " ")}:</span>{" "}
                        <span className="text-slate-900">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <Button
                  variant="destructive"
                  disabled={actionLoading !== null}
                  onClick={() => void sendActionRequest("freeze")}
                >
                  {actionLoading === "freeze" ? "Sending Freeze Request..." : "Freeze Account (Notify Banks)"}
                </Button>
                <Button
                  variant="outline"
                  disabled={actionLoading !== null}
                  onClick={() => void sendActionRequest("documents")}
                >
                  {actionLoading === "documents" ? "Requesting Documents..." : "Get More Records / Request Documents"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {!userRole || userRole !== "ADMIN" ? (
        alreadyNotified && (
          <Button size="sm" className="w-full justify-center" onClick={() => void loadStoredReport()}>
            View Transaction Details
          </Button>
        )
      ) : null}

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

            {report && !showReport && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-700">
                  STR report is ready to review for {account.transactionId}.
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Open a clean formatted view before downloading or regenerating.
                </p>
                <Button className="mt-3 w-full justify-center" onClick={() => setShowReport(true)}>
                  View Report
                </Button>
              </div>
            )}

            {report && showReport && (
              <div className="space-y-5 rounded-xl border border-slate-200 bg-white overflow-hidden">
                <div className="border-b border-sky-200 bg-gradient-to-r from-sky-50 via-white to-amber-50 px-5 py-5 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-sky-700 to-sky-900 text-xs font-black tracking-widest text-white shadow-md">
                      DCAF
                    </div>
                    <div className="space-y-2 flex-1">
                      <p className="text-xs font-bold uppercase tracking-widest text-sky-700">Transaction Detail View</p>
                      <h4 className="text-xl font-black text-slate-950 leading-tight">{account.transactionId}</h4>
                      <p className="text-xs font-medium text-slate-600">
                        Clean summary of the transaction, stored STR metadata, and compliance analysis.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 h-0.5 w-full bg-gradient-to-r from-sky-300 via-amber-200 to-transparent" />
                </div>

                <div className="grid gap-4 px-5 pt-5 md:grid-cols-2">
                  <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <h4 className="text-sm font-semibold text-slate-900">Transaction Summary</h4>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2 text-sm text-slate-700">
                      <div><span className="font-medium text-slate-500">Sender</span><div>{account.senderAccount}</div></div>
                      <div><span className="font-medium text-slate-500">Receiver</span><div>{account.receiverAccount}</div></div>
                      <div><span className="font-medium text-slate-500">Amount</span><div>${account.amount.toLocaleString()}</div></div>
                      <div><span className="font-medium text-slate-500">Risk Score</span><div>{account.riskScore.toFixed(2)}</div></div>
                      <div className="sm:col-span-2"><span className="font-medium text-slate-500">Route</span><div>{account.country}</div></div>
                      <div className="sm:col-span-2"><span className="font-medium text-slate-500">Commodity</span><div>{account.commodity ?? "N/A"}</div></div>
                    </div>
                  </section>

                  <section className="rounded-xl border border-slate-200 bg-white p-4">
                    <h4 className="text-sm font-semibold text-slate-900">STR Metadata</h4>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2 text-sm text-slate-700">
                      <div><span className="font-medium text-slate-500">Created At</span><div>{storedReportMeta?.createdAt ? new Date(storedReportMeta.createdAt).toLocaleString() : "Unknown"}</div></div>
                      <div><span className="font-medium text-slate-500">Action Taken</span><div>{storedReportMeta?.actionTaken ?? "Unknown"}</div></div>
                      <div><span className="font-medium text-slate-500">Created By</span><div>{storedReportMeta?.createdByName ?? storedReportMeta?.createdByUsername ?? storedReportMeta?.createdByEmail ?? "Unknown"}</div></div>
                      <div><span className="font-medium text-slate-500">STR Status</span><div>{account.hasStrReport ? "Stored and available" : "Not stored"}</div></div>
                    </div>
                  </section>
                </div>

                {Object.keys(account.strMetadata ?? {}).length > 0 && (
                  <div className="px-5">
                    <section className="rounded-xl border border-slate-200 bg-white p-4">
                      <h4 className="text-sm font-semibold text-slate-900">Audit Metadata</h4>
                      <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                        {Object.entries(account.strMetadata ?? {})
                          .filter(([key]) => key !== "reasons_for_flagging")
                          .map(([key, value]) => (
                            <div key={key} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm">
                              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{key.replace(/_/g, " ")}</div>
                              <div className="mt-1 text-slate-900">{String(value)}</div>
                            </div>
                          ))}
                      </div>
                    </section>
                  </div>
                )}

                <div className="px-5 pb-5 space-y-5">
                {reportSections(report).map((section, index) => {
                  const palette = [
                    "border-sky-100 bg-sky-50/60",
                    "border-amber-100 bg-amber-50/60",
                    "border-rose-100 bg-rose-50/50",
                    "border-indigo-100 bg-indigo-50/60",
                    "border-emerald-100 bg-emerald-50/60",
                    "border-slate-200 bg-slate-50/90",
                  ];
                  const heading = [
                    "text-sky-900",
                    "text-amber-900",
                    "text-rose-900",
                    "text-indigo-900",
                    "text-emerald-900",
                    "text-slate-900",
                  ];

                  const lines = sectionLines(section.content);

                  return (
                    <section key={section.title} className={`rounded-lg border p-3 ${palette[index % palette.length]}`}>
                      <h4 className={`font-bold ${heading[index % heading.length]}`}>{section.title}</h4>
                      <ul className="mt-2 space-y-2 text-justify text-sm leading-7 text-slate-700">
                        {lines.length > 0 ? lines.map((line, lineIndex) => (
                          <li key={`${section.title}-${lineIndex}`} className="flex gap-2">
                            <span className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500" />
                            <span>{line}</span>
                          </li>
                        )) : (
                          <li className="text-slate-500">No details provided.</li>
                        )}
                      </ul>
                    </section>
                  );
                })}

                  <Button className="w-full justify-center" variant="outline" onClick={() => setShowReport(false)}>
                    Hide Report
                  </Button>
                </div>
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

            {alreadyNotified && (
              <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                Notification already sent and STR report is stored for this transaction.
              </p>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
