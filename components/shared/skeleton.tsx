import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} />;
}

export function CardSkeleton() {
  return (
    <div className="space-y-4 rounded-2xl border bg-card p-6">
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-3 w-1/2" />
      <div className="grid gap-2">
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
      </div>
    </div>
  );
}
