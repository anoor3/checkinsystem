"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, Clock, Lock } from "lucide-react";
import confetti from "canvas-confetti";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCurrentProfile } from "@/lib/auth";
import { markCheckinFromToken } from "@/lib/api-client";
import type { Checkin } from "@/types/domain";
import Link from "next/link";

export default function TokenPage() {
  const params = useParams();
  const router = useRouter();
  const { profile } = useCurrentProfile();
  const [result, setResult] = React.useState<Checkin | null>(null);
  const [status, setStatus] = React.useState<"idle" | "loading" | "done">("idle");

  React.useEffect(() => {
    if (!profile) {
      router.push("/signin");
      return;
    }
    const token = params?.token as string;
    if (!token) return;
    setStatus("loading");
    markCheckinFromToken(token, profile.id, "qr").then((checkin) => {
      if (checkin) {
        setResult(checkin);
        if (checkin.status === "present") {
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        }
      }
      setStatus("done");
    });
  }, [params, profile, router]);

  if (!profile) return null;

  const iconMap = {
    present: <CheckCircle2 className="h-12 w-12 text-emerald-500" />,
    late: <Clock className="h-12 w-12 text-amber-500" />,
    closed: <Lock className="h-12 w-12 text-destructive" />,
  } as const;

  return (
    <div className="mx-auto grid min-h-screen max-w-md place-items-center px-6 py-16">
      <Card className="w-full border-none bg-card/80 shadow-soft">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Attendance check-in</CardTitle>
          <CardDescription>Powered entirely on the client—no network required.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          {status !== "done" && <p className="text-sm text-muted-foreground">Validating your token…</p>}
          {result && (
            <div className="space-y-4">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted/40">
                {iconMap[result.status]}
              </div>
              <div>
                <p className="text-lg font-semibold capitalize">{result.status}</p>
                <p className="text-sm text-muted-foreground">
                  Checked in at {new Date(result.at).toLocaleTimeString()} using QR mode.
                </p>
              </div>
            </div>
          )}
          <div className="flex flex-col gap-3">
            <Button asChild>
              <Link href="/history">View my history</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard">Back to dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
