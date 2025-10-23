"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignUpPage() {
  return (
    <div className="mx-auto grid min-h-screen max-w-3xl place-items-center px-6 py-16">
      <Card className="w-full border-none bg-card/80 shadow-soft">
        <CardHeader>
          <CardTitle className="text-2xl">Create your PulseCheck persona</CardTitle>
          <CardDescription>We’ll guide you through a two-step onboarding—no email required.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Because this prototype runs entirely on the client, simply choose a role to experience the tailored flows. You can
            switch anytime.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="flex-1">
              <Link href="/onboarding?role=professor">Start as Professor</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="flex-1">
              <Link href="/onboarding?role=student">Start as Student</Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Already exploring? <Link className="font-medium text-primary" href="/signin">Sign in</Link> with a demo profile.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
