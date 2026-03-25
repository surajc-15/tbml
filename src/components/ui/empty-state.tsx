import { Inbox } from "lucide-react";

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
        <Inbox className="h-6 w-6 text-slate-400" />
      </div>
      <h4 className="text-base font-semibold text-slate-700">{title}</h4>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}
