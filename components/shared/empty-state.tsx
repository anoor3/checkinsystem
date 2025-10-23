import { Button } from "@/components/ui/button";
import Image from "next/image";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="grid gap-4 rounded-2xl border border-dashed bg-muted/30 p-12 text-center">
      <div className="mx-auto h-20 w-20">
        <Image src="/placeholder-class.svg" alt="Empty" width={120} height={80} className="mx-auto opacity-70" />
      </div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {action && (
        <div>
          <Button onClick={action.onClick}>{action.label}</Button>
        </div>
      )}
    </div>
  );
}
