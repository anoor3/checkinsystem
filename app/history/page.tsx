"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { NavShell } from "@/components/layout/nav-shell";
import { useCurrentProfile } from "@/lib/auth";
import { listCheckinsForUser, getClassById } from "@/lib/api-client";
import type { Checkin } from "@/types/domain";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/shared/data-table";
import { StatusPill } from "@/components/shared/status-pill";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

export default function HistoryPage() {
  const router = useRouter();
  const { profile } = useCurrentProfile();
  const [history, setHistory] = React.useState<Checkin[]>([]);
  const [classMap, setClassMap] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (!profile) {
      router.push("/signin");
      return;
    }
    const load = async () => {
      const entries = await listCheckinsForUser(profile.id);
      setHistory(entries);
      const map: Record<string, string> = {};
      await Promise.all(
        entries.map(async (entry) => {
          if (!map[entry.classId]) {
            const klass = await getClassById(entry.classId);
            if (klass) map[entry.classId] = klass.name;
          }
        })
      );
      setClassMap(map);
    };
    void load();
  }, [profile, router]);

  if (!profile) return null;

  const exportCsv = () => {
    const csv = ["class,status,at"].concat(
      history.map((row) => `${classMap[row.classId] ?? row.classId},${row.status},${row.at}`)
    );
    const blob = new Blob([csv.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${profile.name}-history.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast({ title: "History exported", description: "Your CSV download has started.", variant: "success" });
  };

  return (
    <NavShell profile={profile}>
      <Card>
        <CardHeader>
          <CardTitle>Attendance history</CardTitle>
          <CardDescription>Every check-in you’ve made, sorted by newest first.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <DataTable
            data={[...history].sort((a, b) => (a.at < b.at ? 1 : -1))}
            columns={[
              { key: "classId", header: "Class", render: (row) => classMap[row.classId] ?? row.classId },
              { key: "status", header: "Status", render: (row) => <StatusPill status={row.status} /> },
              { key: "at", header: "Timestamp", render: (row) => new Date(row.at).toLocaleString() },
            ]}
            emptyState={<p>No check-ins yet—scan a QR to appear here.</p>}
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button onClick={exportCsv}>Export CSV</Button>
            <Button variant="outline" onClick={() => window.print()} className="print:hidden">
              Print-friendly view
            </Button>
          </div>
        </CardContent>
      </Card>
    </NavShell>
  );
}
