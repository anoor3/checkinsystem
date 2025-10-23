"use client";

import * as React from "react";
import { motion } from "framer-motion";

interface AttendanceChartProps {
  data: { label: string; present: number; late: number }[];
}

export function AttendanceChart({ data }: AttendanceChartProps) {
  const max = Math.max(...data.map((item) => item.present + item.late), 1);

  return (
    <div className="rounded-2xl border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Weekly attendance pulse</h3>
          <p className="text-sm text-muted-foreground">Hover to inspect present vs late check-ins.</p>
        </div>
      </div>
      <div className="flex items-end gap-6 overflow-x-auto">
        {data.map((item) => {
          const presentHeight = (item.present / max) * 160;
          const lateHeight = (item.late / max) * 160;
          return (
            <div key={item.label} className="flex w-16 flex-col items-center gap-2">
              <div className="relative flex w-full flex-col justify-end">
                <motion.div
                  className="rounded-t-lg bg-primary/80"
                  style={{ height: presentHeight }}
                  initial={{ height: 0 }}
                  animate={{ height: presentHeight }}
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                />
                <motion.div
                  className="rounded-b-lg bg-amber-400/70"
                  style={{ height: lateHeight }}
                  initial={{ height: 0 }}
                  animate={{ height: lateHeight }}
                  transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.1 }}
                />
              </div>
              <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <span className="h-2 w-8 rounded-full bg-primary/80" /> Present
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-8 rounded-full bg-amber-400/70" /> Late
        </div>
      </div>
    </div>
  );
}
