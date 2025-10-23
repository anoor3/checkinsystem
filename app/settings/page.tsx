"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { NavShell } from "@/components/layout/nav-shell";
import { useCurrentProfile, signOut, setCurrentProfile } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormText } from "@/components/forms/form-text";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const schema = z.object({
  name: z.string().min(2),
});

type FormValues = z.infer<typeof schema>;

export default function SettingsPage() {
  const router = useRouter();
  const { profile, setProfile } = useCurrentProfile();
  const { resolvedTheme, setTheme } = useTheme();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: profile?.name ?? "" },
  });

  React.useEffect(() => {
    if (!profile) {
      router.push("/signin");
    } else {
      form.reset({ name: profile.name });
    }
  }, [profile, router, form]);

  if (!profile) return null;

  const onSubmit = (values: FormValues) => {
    const updated = { ...profile, name: values.name };
    setCurrentProfile(updated);
    setProfile(updated);
    toast({ title: "Profile updated", description: "Your display name has been refreshed." });
  };

  return (
    <NavShell profile={profile}>
      <Card>
        <CardHeader>
          <CardTitle>Profile settings</CardTitle>
          <CardDescription>Fine-tune your preferences for this demo experience.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormText control={form.control} name="name" label="Display name" />
            <Button type="submit">Save changes</Button>
          </form>
          <div className="flex items-center justify-between rounded-xl border bg-muted/40 p-4">
            <div>
              <p className="text-sm font-semibold">Dark mode</p>
              <p className="text-xs text-muted-foreground">Toggle between system or manual theme.</p>
            </div>
            <Switch checked={resolvedTheme === "dark"} onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} />
          </div>
          <Button variant="outline" onClick={signOut}>
            Sign out
          </Button>
        </CardContent>
      </Card>
    </NavShell>
  );
}
