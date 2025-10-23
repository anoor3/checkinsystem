import { Badge } from "@/components/ui/badge";

export function BadgeLegend() {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
      <span className="font-medium text-foreground">Legend:</span>
      <Badge variant="success">Present</Badge>
      <Badge variant="warning">Late</Badge>
      <Badge variant="destructive">Closed</Badge>
    </div>
  );
}
