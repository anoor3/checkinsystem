"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NavShell } from "@/components/layout/nav-shell";
import { FormText } from "@/components/forms/form-text";
import { FormSelect } from "@/components/forms/form-select";
import { useCurrentProfile } from "@/lib/auth";
import { createClass } from "@/lib/api-client";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

const schema = z.object({
  name: z.string().min(2, "Class name is required"),
  section: z.string().min(2, "Section is required"),
  term: z.string().min(2, "Term is required"),
  timezone: z.string(),
});

type FormValues = z.infer<typeof schema>;

const timezoneOptions = [
  { label: "Pacific (PT)", value: "America/Los_Angeles" },
  { label: "Mountain (MT)", value: "America/Denver" },
  { label: "Central (CT)", value: "America/Chicago" },
  { label: "Eastern (ET)", value: "America/New_York" },
];

export default function NewClassPage() {
  const router = useRouter();
  const { profile } = useCurrentProfile();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      section: "",
      term: "Spring 2024",
      timezone: "America/Los_Angeles",
    },
  });

  if (!profile) {
    router.push("/signin");
    return null;
  }

  const onSubmit = async (values: FormValues) => {
    const klass = await createClass({ ...values, ownerId: profile.id });
    toast({
      title: "Class created",
      description: `${klass.name} is ready for attendance!`,
      variant: "success",
    });
    router.push(`/classes/${klass.id}`);
  };

  return (
    <NavShell profile={profile}>
      <Card>
        <CardHeader>
          <CardTitle>Create a class</CardTitle>
          <CardDescription>Define the essentials so students can join in seconds.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-6 md:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
            <FormText control={form.control} name="name" label="Class title" placeholder="Creative Coding Studio" />
            <FormText control={form.control} name="section" label="Section" placeholder="CS 245" />
            <FormText control={form.control} name="term" label="Term" placeholder="Spring 2024" />
            <FormSelect control={form.control} name="timezone" label="Timezone" options={timezoneOptions} />
            <div className="md:col-span-2 flex items-center justify-between rounded-xl border bg-muted/50 p-4 text-sm">
              <div>
                <p className="font-semibold">Rotating QR is enabled</p>
                <p className="text-xs text-muted-foreground">Students get a fresh code every 20s during live sessions.</p>
              </div>
              <Badge variant="outline">Security default</Badge>
            </div>
            <div className="md:col-span-2 flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit">Create class</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </NavShell>
  );
}
