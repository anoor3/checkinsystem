"use client";

import * as React from "react";
import { Camera, ScanLine, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface QRScannerSimulatorProps {
  className?: string;
}

export function QRScannerSimulator({ className }: QRScannerSimulatorProps) {
  const [token, setToken] = React.useState("");
  const router = useRouter();

  const handleSimulate = () => {
    if (!token) return;
    router.push(`/a/${token}`);
  };

  return (
    <div className={cn("space-y-4 rounded-2xl border bg-card p-6 shadow-soft", className)}>
      <div className="relative h-52 rounded-xl border border-dashed bg-muted/50">
        <div className="absolute inset-4 rounded-xl border-2 border-primary/60">
          <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 border-t-2 border-primary/50">
            <ScanLine className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 text-primary" />
          </div>
        </div>
        <Sparkles className="absolute bottom-4 right-4 h-5 w-5 animate-pulsefade text-primary" />
        <Camera className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Paste attendance token</label>
        <Input value={token} onChange={(event) => setToken(event.target.value)} placeholder="e.g. eyJzaWQiOiJzZXNfMi..." />
        <div className="flex gap-2">
          <Button className="flex-1" onClick={handleSimulate}>
            Simulate scan
          </Button>
          <Button variant="ghost" onClick={() => router.push(`/a/${btoa(JSON.stringify({ sid: "ses_2", exp: Math.floor(Date.now()/1000)+60, nonce: "demo" }))}`)}>
            Use demo
          </Button>
        </div>
      </div>
    </div>
  );
}
