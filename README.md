# PulseCheck — Attendance with grace

PulseCheck is a premium-grade, frontend-only prototype of a class attendance platform built with Next.js 14, Tailwind CSS, shadcn/ui, and a delightful mock data layer powered by MSW. It ships with professor and student journeys, rotating QR codes, CSV exports, and tasteful motion—no backend required.

## Getting started

```bash
pnpm install
pnpm prepare # generates the full MSW worker
pnpm dev
```

The mock service worker boots automatically in the browser to intercept `fetch` calls and route them to the in-memory data store. Data is seeded from `data/fixtures.ts` and persisted in `localStorage` under the `pulse_*` keys.

> If the worker is not generated yet, the app falls back to the in-memory API directly so you can still explore every screen. Running `pnpm prepare` upgrades the stub worker shipped in `/public` to the fully featured MSW implementation.

## Features

- Role-aware dashboards with professor & student shells
- Rotating QR attendance tokens with animated countdown ring
- Live session management, check-in simulation, and CSV export
- Join via code or QR scanner simulator (camera-inspired UI)
- Student history with print-ready exports
- Light/dark themes with next-themes, keyboard-friendly controls, and accessible focus states

## Tech stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui + Framer Motion
- React Hook Form + Zod for validation
- MSW for realistic async fetch mocks
- `qrcode.react` for QR generation

> This project is entirely client-side and safe to run without any backend services. Seed data resets whenever you clear your browser storage.
