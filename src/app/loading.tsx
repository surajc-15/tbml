import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="mx-auto flex w-full max-w-[1600px] gap-6">
        <Skeleton className="hidden h-[90vh] w-64 rounded-2xl lg:block" />
        <div className="flex-1 space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
          </div>
          <Skeleton className="h-96 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
          <Skeleton className="h-[28rem] rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
