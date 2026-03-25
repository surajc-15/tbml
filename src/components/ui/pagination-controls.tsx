"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  pageParam: string;
  currentPage: number;
  totalPages: number;
};

export function PaginationControls({ pageParam, currentPage, totalPages }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const goTo = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(pageParam, String(page));
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-3">
      <p className="text-xs text-slate-500">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => goTo(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> Prev
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => goTo(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
        >
          Next <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
