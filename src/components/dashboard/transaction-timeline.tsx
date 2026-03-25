import { CheckCircle2 } from "lucide-react";
import type { SimulationResult } from "@/types/aml";

export function TransactionTimeline({ result }: { result: SimulationResult }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <h4 className="text-sm font-semibold text-slate-700">Transaction Flow Timeline</h4>
      <ol className="mt-4 space-y-4">
        {result.steps.map((step) => (
          <li key={`${step.timestamp}-${step.title}`} className="relative pl-8">
            <span className="absolute left-0 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-sky-100 text-sky-700">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </span>
            <p className="text-sm font-medium text-slate-800">{step.title}</p>
            <p className="text-xs text-slate-500">{step.timestamp}</p>
            <p className="mt-1 text-sm text-slate-600">{step.detail}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
