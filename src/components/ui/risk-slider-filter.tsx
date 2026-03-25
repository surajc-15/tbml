"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  minValue?: number;
  min: number;
  max: number;
  step?: number;
  queryParam: string;
  label: string;
};

export function RiskSliderFilter({ minValue = 0, min, max, step = 1, queryParam, label }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onChange = (value: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(queryParam, String(value));
    params.set("fraudPage", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</label>
        <span className="text-xs font-semibold text-slate-700">{minValue}+</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={minValue}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-sky-600"
      />
    </div>
  );
}
