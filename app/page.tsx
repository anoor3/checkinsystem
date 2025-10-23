import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Shield, TimerReset } from "lucide-react";

const highlights = [
  {
    title: "Rotating QR attendance",
    description: "Secure, time-bound check-ins that refresh automatically.",
    icon: TimerReset,
  },
  {
    title: "Live roster intelligence",
    description: "Catch late arrivals instantly and adjust records in-line.",
    icon: CheckCircle2,
  },
  {
    title: "Privacy-first insights",
    description: "In-memory data sandboxed to your browser with export-ready reports.",
    icon: Shield,
  },
];

export default function MarketingPage() {
  return (
    <div className="gradient-bg">
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-24 pt-20 md:grid-cols-2">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-sm text-primary">
            Built for premium academic teams
          </span>
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Attendance that feels effortless, even in complex studios.
          </h1>
          <p className="text-lg text-muted-foreground">
            PulseCheck streamlines how professors welcome students, track presence, and celebrate participation—all without a backend.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="gap-2">
              <Link href="/signin?role=professor">
                Try as Professor <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link href="/signin?role=student">
                Explore Student Portal <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {highlights.map((item) => (
              <div key={item.title} className="rounded-2xl border bg-card/70 p-4">
                <item.icon className="mb-3 h-6 w-6 text-primary" />
                <h3 className="text-sm font-semibold">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-card relative overflow-hidden rounded-3xl border p-6 shadow-soft">
          <div className="rounded-2xl border bg-background/60 p-4">
            <Image src="/placeholder-class.svg" alt="PulseCheck dashboard" width={500} height={320} className="w-full" />
          </div>
          <div className="absolute -left-10 bottom-12 hidden rotate-6 rounded-2xl border bg-background/80 p-4 shadow-lg sm:block">
            <p className="text-xs font-medium uppercase tracking-wide text-primary">Live check-ins</p>
            <p className="text-sm font-semibold">“Sofia M. checked in • 2 mins ago”</p>
          </div>
        </div>
      </section>
    </div>
  );
}
