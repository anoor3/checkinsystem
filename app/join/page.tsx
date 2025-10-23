"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormText } from "@/components/forms/form-text";
import { NavShell } from "@/components/layout/nav-shell";
import { QRScannerSimulator } from "@/components/shared/qr-scanner-simulator";
import { useCurrentProfile } from "@/lib/auth";
import { joinClass } from "@/lib/api-client";
import { toast } from "@/components/ui/use-toast";

const schema = z.object({
  joinCode: z.string().min(4, "Enter a valid join code"),
});

type FormValues = z.infer<typeof schema>;

export default function JoinPage() {
  const router = useRouter();
  const { profile } = useCurrentProfile();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { joinCode: "" },
  });

  React.useEffect(() => {
    if (!profile) {
      router.push("/signin");
    }
  }, [profile, router]);

  if (!profile) return null;

  const onSubmit = async (values: FormValues) => {
    const klass = await joinClass(values.joinCode, profile.id);
    if (!klass) {
      toast({ title: "Not found", description: "That join code doesn’t match a class yet.", variant: "destructive" });
      return;
    }
    toast({ title: "Joined", description: `Welcome to ${klass.name}!`, variant: "success" });
    router.push(`/classes/${klass.id}`);
  };

  return (
    <NavShell profile={profile}>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Join via code</CardTitle>
            <CardDescription>Paste the code shared by your professor to unlock attendance.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormText control={form.control} name="joinCode" label="Join code" placeholder="HCD-301" />
              <Button type="submit" className="w-full">
                Join class
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Scan a rotating QR</CardTitle>
            <CardDescription>Use the simulator to preview the touch-free check-in experience.</CardDescription>
          </CardHeader>
          <CardContent>
            <QRScannerSimulator />
          </CardContent>
        </Card>
      </div>
    </NavShell>
  );
}
