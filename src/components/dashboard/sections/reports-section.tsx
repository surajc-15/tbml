"use client";

import { useEffect, useState } from "react";

type Report = {
  id: number;
  transactionId: string;
  reportMarkdown: string | null;
  createdAt: string;
  actionTaken: string;
  createdBy: {
    name: string | null;
    email: string;
    bankName: string | null;
  };
};

export function ReportsSection() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch("/api/reports");

        if (!response.ok) {
          throw new Error("Failed to fetch reports");
        }

        const data = await response.json();
        setReports(data.reports || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    void fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-slate-500">Loading reports...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          STR Reports
        </h1>

        <p className="mt-1 text-slate-500">
          Suspicious transaction reports submitted by bank users.
        </p>
      </div>

      {/* Empty state */}
      {reports.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-slate-500">No STR reports found.</p>
        </div>
      )}

      {/* Reports Grid */}
      <div className="grid gap-5">
        {reports.map((report) => (
          <div
            key={report.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-slate-900">
                  Transaction #{report.transactionId}
                </h2>

                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                  <span>
                    Created By:{" "}
                    <strong className="text-slate-700">
                      {report.createdBy.name || "Unknown"}
                    </strong>
                  </span>

                  <span>•</span>

                  <span>{report.createdBy.email}</span>

                  {report.createdBy.bankName && (
                    <>
                      <span>•</span>
                      <span>{report.createdBy.bankName}</span>
                    </>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="rounded-full bg-red-100 px-3 py-1 font-medium text-red-700">
                    {report.actionTaken.replaceAll("_", " ")}
                  </span>

                  <span className="text-slate-500">
                    {new Date(report.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <button
                  onClick={() => setSelectedReport(report)}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                >
                  View Report
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  STR Report
                </h2>

                <p className="text-sm text-slate-500">
                  Transaction #{selectedReport.transactionId}
                </p>
              </div>

              <button
                onClick={() => setSelectedReport(null)}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-100"
              >
                Close
              </button>
            </div>

            {/* Body */}
            <div className="max-h-[75vh] overflow-y-auto px-6 py-5">
              <div className="prose prose-slate max-w-none whitespace-pre-wrap">
                {selectedReport.reportMarkdown || "No report content found."}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}