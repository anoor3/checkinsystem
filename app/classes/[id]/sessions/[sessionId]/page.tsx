"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { PlayCircle, Square } from "lucide-react";
import { NavShell } from "@/components/layout/nav-shell";
import { useCurrentProfile } from "@/lib/auth";
import { getSession, getClassById, listCheckins, startSession, closeSession, markCheckinFromToken, rotateToken } from "@/lib/api-client";
import { createToken } from "@/lib/api";
import type { Checkin, Session } from "@/types/domain";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QRDisplay } from "@/components/shared/qr-display";
import { SessionTimer } from "@/components/shared/session-timer";
import { StatusPill } from "@/components/shared/status-pill";
import { BadgeLegend } from "@/components/shared/badge-legend";
import { DataTable } from "@/components/shared/data-table";
import { toast } from "@/components/ui/use-toast";

export default function SessionPage() {
  const params = useParams();
  const router = useRouter();
  const { profile } = useCurrentProfile();
  const [session, setSession] = React.useState<Session | null>(null);
  const [checkins, setCheckins] = React.useState<Checkin[]>([]);
  const [className, setClassName] = React.useState<string>("");
  const sessionId = params?.sessionId as string;
  const classId = params?.id as string;

  React.useEffect(() => {
    if (!profile) {
      router.push("/signin");
      return;
    }
    const load = async () => {
      const session = await getSession(sessionId);
      const klass = await getClassById(classId);
      if (session) setSession(session);
      if (klass) setClassName(klass.name);
      const checkins = await listCheckins(sessionId);
      setCheckins(checkins);
    };
    void load();
    const interval = setInterval(async () => {
      const data = await listCheckins(sessionId);
      setCheckins(data);
    }, 4000);
    return () => clearInterval(interval);
  }, [profile, sessionId, classId, router]);

  if (!profile || !session) return null;

  const handleOpen = async () => {
    await startSession(sessionId);
    const updated = await getSession(sessionId);
    if (updated) setSession(updated);
    toast({ title: "Session open", description: "Students can now check in." });
  };

  const handleClose = async () => {
    await closeSession(sessionId);
    const updated = await getSession(sessionId);
    if (updated) setSession(updated);
    toast({ title: "Session closed", description: "Attendance window ended." });
  };

  const handleRotate = async () => {
    const tokenSeed = await rotateToken(sessionId);
    const updated = await getSession(sessionId);
    if (updated) setSession(updated);
    toast({ title: "QR refreshed", description: "A new token is live for the next interval." });
  };

  const simulateCheckin = async () => {
    const token = createToken(session);
    if (!profile) return;
    const checkin = await markCheckinFromToken(token, profile.id, "qr");
    if (checkin) {
      toast({ title: "Check-in recorded", description: `Status: ${checkin.status}` });
      const refreshed = await listCheckins(sessionId);
      setCheckins(refreshed);
    }
  };

  return (
    <NavShell profile={profile}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{session.title}</h1>
          <p className="text-sm text-muted-foreground">{className}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={simulateCheckin}>
            Simulate self check-in
          </Button>
          {session.status !== "open" ? (
            <Button onClick={handleOpen} className="gap-2">
              <PlayCircle className="h-4 w-4" /> Open session
            </Button>
          ) : (
            <Button variant="destructive" onClick={handleClose} className="gap-2">
              <Square className="h-4 w-4" /> Close session
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[1.1fr,0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Live QR</CardTitle>
            <CardDescription>Display on a projector or share remotely with your class.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <QRDisplay session={session} />
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleRotate}>
                Refresh token
              </Button>
            </div>
            <SessionTimer openAt={session.openAt} closeAt={session.closeAt} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Live check-ins</CardTitle>
            <CardDescription>
              Updated every few seconds. Adjustments can be made from the class roster.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <BadgeLegend />
            <DataTable
              data={checkins}
              columns={[
                { key: "userId", header: "Student" },
                { key: "status", header: "Status", render: (row) => <StatusPill status={row.status} /> },
                { key: "at", header: "Checked in", render: (row) => new Date(row.at).toLocaleTimeString() },
              ]}
              emptyState={<p>No check-ins yet.</p>}
            />
          </CardContent>
        </Card>
      </div>
    </NavShell>
  );
}
