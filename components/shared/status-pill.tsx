import { Badge } from "@/components/ui/badge";

export function StatusPill({ status }: { status: "present" | "late" | "closed" }) {
  const variants = {
    present: { variant: "success" as const, label: "Present" },
    late: { variant: "warning" as const, label: "Late" },
    closed: { variant: "destructive" as const, label: "Closed" },
  };
  const { variant, label } = variants[status];
  return <Badge variant={variant}>{label}</Badge>;
}
