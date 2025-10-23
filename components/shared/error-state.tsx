import { Button } from "@/components/ui/button";

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-6 text-center text-sm">
      <p className="mb-3 font-semibold text-destructive">{message}</p>
      {onRetry && (
        <Button variant="destructive" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
