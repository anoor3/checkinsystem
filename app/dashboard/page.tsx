"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NavShell } from "@/components/layout/nav-shell";
import { useCurrentProfile } from "@/lib/auth";
import { listClassesByOwner, listClassesForStudent, listSessionsForClass } from "@/lib/api-client";
import type { Class, Session } from "@/types/domain";
import { AttendanceChart } from "@/components/dashboard/attendance-chart";
import { formatDateTime } from "@/lib/utils";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const { profile } = useCurrentProfile();
  const [classes, setClasses] = React.useState<Class[]>([]);
  const [upcoming, setUpcoming] = React.useState<Session[]>([]);

  React.useEffect(() => {
    if (!profile) {
      router.push("/signin");
      return;
    }
    const load = async () => {
      if (profile.role === "professor") {
        const data = await listClassesByOwner(profile.id);
        setClasses(data);
        const sessions = await Promise.all(data.map((klass) => listSessionsForClass(klass.id)));
        setUpcoming(sessions.flat().filter((session) => session.status !== "closed").slice(0, 3));
      } else {
        const data = await listClassesForStudent(profile.id);
        setClasses(data);
        setUpcoming([]);
      }
    };
    void load();
  }, [profile, router]);

  if (!profile) return null;

  const chartData = classes.slice(0, 5).map((klass, index) => ({
    label: klass.section || `Class ${index + 1}`,
    present: Math.floor(Math.random() * 18) + 12,
    late: Math.floor(Math.random() * 4),
  }));

  return (
    <NavShell profile={profile}>
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Hello {profile.name.split(" ")[0]} 👋</CardTitle>
            <CardDescription>
              Here’s today’s attendance pulse. {profile.role === "professor" ? "Open a live session to start collecting check-ins." : "Head to Join to check in."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AttendanceChart data={chartData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {profile.role === "professor" ? (
              <>
                <Button asChild>
                  <Link href="/classes/new">Create new class</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href={classes[0] ? `/classes/${classes[0].id}` : "/classes/new"}>View class overview</Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild>
                  <Link href="/join">Join via code</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/history">View my history</Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{profile.role === "professor" ? "My classes" : "Enrolled classes"}</CardTitle>
            <CardDescription>Tap a class to open its attendance hub.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {classes.map((klass) => (
              <motion.div
                key={klass.id}
                whileHover={{ y: -2 }}
                className="rounded-xl border bg-background/70 p-4"
              >
                <Link href={`/classes/${klass.id}`} className="block">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">{klass.name}</p>
                      <p className="text-xs text-muted-foreground">{klass.section} • {klass.term}</p>
                    </div>
                    <Badge>{klass.joinCode}</Badge>
                  </div>
                </Link>
              </motion.div>
            ))}
            {!classes.length && <p className="text-sm text-muted-foreground">No classes yet—create one to begin.</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming sessions</CardTitle>
            <CardDescription>Sessions scheduled or open in the next day.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {upcoming.map((session) => (
              <div key={session.id} className="rounded-xl border bg-background/70 p-4 text-sm">
                <p className="font-semibold">{session.title}</p>
                <p className="text-xs text-muted-foreground">{formatDateTime(new Date(session.openAt))}</p>
              </div>
            ))}
            {!upcoming.length && <p className="text-sm text-muted-foreground">No upcoming sessions—schedule one from a class page.</p>}
          </CardContent>
        </Card>
      </div>
    </NavShell>
  );
}
