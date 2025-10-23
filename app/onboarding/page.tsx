"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormText } from "@/components/forms/form-text";
import { FormSelect } from "@/components/forms/form-select";
import { setCurrentProfile } from "@/lib/auth";
import { uid } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  role: z.enum(["professor", "student"]),
});

type FormValues = z.infer<typeof formSchema>;

const roleOptions = [
  { label: "Professor", value: "professor" },
  { label: "Student", value: "student" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const params = useSearchParams();
  const defaultRole = (params.get("role") as "professor" | "student") ?? "professor";
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", role: defaultRole },
  });

  const onSubmit = (values: FormValues) => {
    const profile = {
      id: uid("demo"),
      name: values.name,
      email: `${values.name.toLowerCase().replace(/\s+/g, ".")}@pulsecheck.edu`,
      role: values.role,
      avatarColor: values.role === "professor" ? "from-indigo-500 to-sky-500" : "from-emerald-500 to-teal-400",
    } as const;
    setCurrentProfile(profile);
    router.push(values.role === "professor" ? "/dashboard" : "/join");
  };

  return (
    <div className="mx-auto grid min-h-screen max-w-xl place-items-center px-6 py-16">
      <Card className="w-full border-none bg-card/80 shadow-soft">
        <CardHeader>
          <CardTitle className="text-2xl">Tailor your experience</CardTitle>
          <CardDescription>PulseCheck adapts based on your role—choose below and we’ll set things up instantly.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormText control={form.control} name="name" label="Display name" placeholder="Dr. Jordan Blake" />
            <FormSelect control={form.control} name="role" label="Role" options={roleOptions} />
            <Button type="submit" className="w-full">
              Continue
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
