"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type Props = {
  searchParam: string;
  pageParam: string;
  placeholder: string;
  defaultValue?: string;
};

export function SearchFilter({ searchParam, pageParam, placeholder, defaultValue }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) {
      params.set(searchParam, value);
    } else {
      params.delete(searchParam);
    }
    params.set(pageParam, "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative w-full max-w-sm">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <Input
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="pl-9"
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
