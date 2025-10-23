"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { QrCode, Users } from "lucide-react";
import { NavShell } from "@/components/layout/nav-shell";
import { useCurrentProfile } from "@/lib/auth";
import { getClassById, listSessionsForClass, listEnrollmentsForClass, listProfiles } from "@/lib/api-client";
import type { Class, Session, Profile } from "@/types/domain";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/data-table";
import { StatusPill } from "@/components/shared/status-pill";
import { BadgeLegend } from "@/components/shared/badge-legend";
import { QRDisplay } from "@/components/shared/qr-display";
import { toast } from "@/components/ui/use-toast";

export default function ClassOverviewPage() {
  const router = useRouter();
  const params = useParams();
  const { profile } = useCurrentProfile();
  const [klass, setClass] = React.useState<Class | null>(null);
  const [sessions, setSessions] = React.useState<Session[]>([]);
  const [activeTab, setActiveTab] = React.useState<"overview" | "sessions" | "reports">("overview");
  const [roster, setRoster] = React.useState<any[]>([]);
  const classId = params?.id as string;

  React.useEffect(() => {
    if (!profile) {
      router.push("/signin");
      return;
    }
    const load = async () => {
      const klass = await getClassById(classId);
      if (!klass) return;
      setClass(klass);
      const sessions = await listSessionsForClass(classId);
      setSessions(sessions);
      const enrollments = await listEnrollmentsForClass(classId);
      const profiles = await listProfiles();
      const map = Object.fromEntries(profiles.map((profile: Profile) => [profile.id, profile.name]));
      const rosterRows = enrollments.map((enr) => ({
        id: enr.id,
        userId: map[enr.userId] ?? enr.userId,
        role: enr.role,
      }));
      setRoster(rosterRows);
    };
    void load();
  }, [classId, profile, router]);

  if (!profile || !klass) return null;

  const activeSession = sessions.find((session) => session.status === "open");

  const exportRoster = async () => {
    const csv = ["userId,role"].concat(roster.map((row) => `${row.userId},${row.role}`)).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${klass.section}-roster.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast({ title: "Export ready", description: "Roster CSV downloaded.", variant: "success" });
  };

  return (
    <NavShell profile={profile}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{klass.name}</h1>
          <p className="text-sm text-muted-foreground">
            {klass.section} • {klass.term} • {klass.timezone}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant={activeTab === "overview" ? "default" : "outline"} onClick={() => setActiveTab("overview")}>
            Overview
          </Button>
          <Button variant={activeTab === "sessions" ? "default" : "outline"} onClick={() => setActiveTab("sessions")}>
            Sessions
          </Button>
          <Button variant={activeTab === "reports" ? "default" : "outline"} onClick={() => setActiveTab("reports")}>
            Reports
          </Button>
        </div>
      </div>

      {activeTab === "overview" && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" /> Join code
              </CardTitle>
              <CardDescription>Share the join code or QR for instant check-ins.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Badge className="text-base">{klass.joinCode}</Badge>
              {activeSession ? (
                <QRDisplay session={activeSession} />
              ) : (
                <p className="text-sm text-muted-foreground">Open a session to display the rotating QR.</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" /> Roster
              </CardTitle>
              <CardDescription>Enrolled members and their roles.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <DataTable
                data={roster}
                columns={[
                  { key: "userId", header: "User ID", sortable: true },
                  { key: "role", header: "Role", render: (row) => <span className="capitalize">{row.role}</span> },
                ]}
                emptyState={<p>No enrollments yet.</p>}
              />
              <Button variant="outline" onClick={exportRoster}>
                Export roster CSV
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "sessions" && (
        <Card>
          <CardHeader>
            <CardTitle>Sessions</CardTitle>
            <CardDescription>Manage attendance windows and see recent check-ins.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <BadgeLegend />
            <DataTable
              data={sessions}
              columns={[
                { key: "title", header: "Title" },
                { key: "openAt", header: "Opens", render: (row) => new Date(row.openAt).toLocaleString() },
                {
                  key: "status",
                  header: "Status",
                  render: (row) =>
                    row.status === "scheduled" ? (
                      <Badge variant="outline">Scheduled</Badge>
                    ) : row.status === "open" ? (
                      <StatusPill status="present" />
                    ) : (
                      <StatusPill status="closed" />
                    ),
                },
              ]}
              emptyState={<p>No sessions yet.</p>}
            />
            <div className="rounded-xl border bg-muted/40 p-4 text-xs text-muted-foreground">
              Tip: keyboard shortcut <kbd className="rounded bg-muted px-1">N</kbd> starts the new session wizard (coming soon).
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "reports" && (
        <Card>
          <CardHeader>
            <CardTitle>Reports</CardTitle>
            <CardDescription>Export attendance snapshots for compliance or sharing.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={exportRoster}>Download roster CSV</Button>
            <Button variant="outline" onClick={() => window.print()}>
              Print attendance summary
            </Button>
            <p className="text-xs text-muted-foreground">
              For PDF exports, use your browser’s print dialog. We provide a print-friendly layout.
            </p>
          </CardContent>
        </Card>
      )}
    </NavShell>
  );
}
