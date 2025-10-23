"use client";

import * as React from "react";
import { format } from "date-fns";

interface SessionTimerProps {
  openAt: string;
  closeAt: string;
}

export function SessionTimer({ openAt, closeAt }: SessionTimerProps) {
  const [now, setNow] = React.useState(() => new Date());

  React.useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const end = new Date(closeAt);
  const start = new Date(openAt);
  const totalSeconds = Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return (
    <div className="rounded-xl border bg-muted/50 px-4 py-3 text-sm font-medium">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div>
            Ends at <span className="font-semibold">{format(end, "MMM d, h:mm a")}</span>
          </div>
          <p className="text-xs text-muted-foreground">Opened {format(start, "h:mm a")}</p>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">
          {minutes}:{seconds.toString().padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
