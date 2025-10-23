"use client";

import * as React from "react";
import QRCode from "qrcode.react";
import { motion, useAnimationControls } from "framer-motion";
import { createToken } from "@/lib/api";
import type { Session } from "@/types/domain";

interface QRDisplayProps {
  session: Session;
  size?: number;
}

export function QRDisplay({ session, size = 220 }: QRDisplayProps) {
  const [token, setToken] = React.useState(() => createToken(session));
  const controls = useAnimationControls();

  React.useEffect(() => {
    const interval = setInterval(() => {
      const nextToken = createToken(session);
      setToken(nextToken);
      void controls.start({ strokeDashoffset: 0, transition: { duration: session.rotatesEverySec, ease: "linear" } });
    }, session.rotatesEverySec * 1000);
    return () => clearInterval(interval);
  }, [session, controls]);

  React.useEffect(() => {
    void controls.start({ strokeDasharray: 100, strokeDashoffset: 0 });
  }, [controls]);

  return (
    <div className="relative inline-flex flex-col items-center gap-3">
      <div className="relative rounded-2xl border bg-card p-4 shadow-soft">
        <QRCode value={`${typeof window !== "undefined" ? window.location.origin : ""}/a/${token}`} size={size} level="H" />
        <motion.svg
          width={size + 24}
          height={size + 24}
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          initial={{ rotate: -90 }}
        >
          <motion.circle
            cx={(size + 24) / 2}
            cy={(size + 24) / 2}
            r={(size + 24) / 2 - 8}
            stroke="hsl(var(--primary))"
            strokeWidth="4"
            fill="transparent"
            strokeDasharray="100"
            animate={controls}
          />
        </motion.svg>
      </div>
      <p className="text-xs text-muted-foreground">
        Rotates every <span className="font-medium text-foreground">{session.rotatesEverySec}s</span> for extra security.
      </p>
    </div>
  );
}
