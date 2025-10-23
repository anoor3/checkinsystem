"use client";

import { differenceInMinutes, isAfter, isBefore } from "date-fns";
import { seed } from "@/data/fixtures";
import { storage } from "@/lib/storage";
import { uid, sleep } from "@/lib/utils";
import type { Checkin, Class, Enrollment, Profile, Session, TokenPayload } from "@/types/domain";
import { getState, setState } from "@/lib/store";

const LATENCY = 200;

export type AuthContext = {
  profile: Profile;
};

function persist() {
  if (typeof window === "undefined") return;
  const state = getState();
  storage.set("classes", state.classes);
  storage.set("sessions", state.sessions);
  storage.set("enrollments", state.enrollments);
  storage.set("checkins", state.checkins);
}

function loadFromStorage() {
  if (typeof window === "undefined") return;
  const classes = storage.get<Class[]>("classes");
  const sessions = storage.get<Session[]>("sessions");
  const enrollments = storage.get<Enrollment[]>("enrollments");
  const checkins = storage.get<Checkin[]>("checkins");
  if (classes && sessions && enrollments && checkins) {
    setState({
      profiles: seed.profiles,
      classes,
      sessions,
      enrollments,
      checkins,
    });
  }
}

if (typeof window !== "undefined") {
  loadFromStorage();
}

export async function listProfiles(): Promise<Profile[]> {
  await sleep(LATENCY);
  return getState().profiles;
}

export async function listClassesByOwner(ownerId: string): Promise<Class[]> {
  await sleep(LATENCY);
  const state = getState();
  return state.classes.filter((klass) => klass.ownerId === ownerId);
}

export async function listClassesForStudent(userId: string): Promise<Class[]> {
  await sleep(LATENCY);
  const state = getState();
  const enrollmentIds = state.enrollments.filter((enr) => enr.userId === userId);
  const classIds = new Set(enrollmentIds.map((enr) => enr.classId));
  return state.classes.filter((klass) => classIds.has(klass.id));
}

export async function createClass(input: Omit<Class, "id" | "createdAt" | "joinCode"> & { name: string }): Promise<Class> {
  await sleep(LATENCY);
  const state = getState();
  const klass: Class = {
    ...input,
    id: uid("class"),
    createdAt: new Date().toISOString(),
    joinCode: input.section ? `${input.section}` : uid("JOIN").slice(0, 8).toUpperCase(),
  };
  const next = {
    ...state,
    classes: [...state.classes, klass],
  };
  setState(next);
  persist();
  return klass;
}

export async function listSessionsForClass(classId: string): Promise<Session[]> {
  await sleep(LATENCY);
  return getState().sessions.filter((session) => session.classId === classId);
}

export async function startSession(sessionId: string) {
  await sleep(LATENCY);
  const state = getState();
  const sessions = state.sessions.map((session) =>
    session.id === sessionId
      ? {
          ...session,
          status: "open" as const,
          openAt: new Date().toISOString(),
        }
      : session
  );
  setState({ ...state, sessions });
  persist();
}

export async function closeSession(sessionId: string) {
  await sleep(LATENCY);
  const state = getState();
  const sessions = state.sessions.map((session) =>
    session.id === sessionId
      ? {
          ...session,
          status: "closed" as const,
          closeAt: new Date().toISOString(),
        }
      : session
  );
  setState({ ...state, sessions });
  persist();
}

export async function rotateToken(sessionId: string): Promise<string> {
  await sleep(1000);
  const state = getState();
  const sessions = state.sessions.map((session) =>
    session.id === sessionId
      ? { ...session, tokenSeed: uid("seed") }
      : session
  );
  setState({ ...state, sessions });
  persist();
  return sessions.find((session) => session.id === sessionId)!.tokenSeed;
}

export function createToken(session: Session): string {
  const exp = Math.floor(Date.now() / 1000) + session.rotatesEverySec;
  const payload: TokenPayload = {
    sid: session.id,
    exp,
    nonce: uid("nonce"),
  };
  return btoa(JSON.stringify(payload));
}

export function decodeToken(token: string): TokenPayload | null {
  try {
    return JSON.parse(atob(token)) as TokenPayload;
  } catch (error) {
    return null;
  }
}

export async function listCheckins(sessionId: string): Promise<Checkin[]> {
  await sleep(LATENCY);
  return getState().checkins.filter((checkin) => checkin.sessionId === sessionId);
}

export async function listCheckinsForUser(userId: string): Promise<Checkin[]> {
  await sleep(LATENCY);
  return getState().checkins.filter((checkin) => checkin.userId === userId);
}

export async function manualAdjustCheckin(sessionId: string, userId: string, status: Checkin["status"]): Promise<Checkin> {
  await sleep(LATENCY);
  const state = getState();
  const existing = state.checkins.find((checkin) => checkin.sessionId === sessionId && checkin.userId === userId);
  const nextCheckin: Checkin = existing
    ? { ...existing, status, at: new Date().toISOString() }
    : {
        id: uid("chk"),
        sessionId,
        classId: state.sessions.find((session) => session.id === sessionId)!.classId,
        userId,
        method: "manual",
        status,
        at: new Date().toISOString(),
      };
  const checkins = existing
    ? state.checkins.map((checkin) => (checkin.id === existing.id ? nextCheckin : checkin))
    : [...state.checkins, nextCheckin];
  setState({ ...state, checkins });
  persist();
  return nextCheckin;
}

export async function joinClass(joinCode: string, userId: string): Promise<Class | null> {
  await sleep(LATENCY);
  const state = getState();
  const klass = state.classes.find((c) => c.joinCode.toLowerCase() === joinCode.toLowerCase());
  if (!klass) return null;
  const enrollment = state.enrollments.find((enr) => enr.classId === klass.id && enr.userId === userId);
  if (!enrollment) {
    state.enrollments.push({ id: uid("enr"), classId: klass.id, userId, role: "student" });
    setState({ ...state, enrollments: state.enrollments });
    persist();
  }
  return klass;
}

export async function markCheckinFromToken(token: string, userId: string, method: Checkin["method"]): Promise<Checkin | null> {
  await sleep(LATENCY);
  const payload = decodeToken(token);
  if (!payload) return null;
  const state = getState();
  const session = state.sessions.find((s) => s.id === payload.sid);
  if (!session) return null;
  const now = new Date();
  if (payload.exp * 1000 < now.getTime()) {
    return {
      id: uid("chk"),
      sessionId: session.id,
      classId: session.classId,
      userId,
      method,
      status: "closed",
      at: now.toISOString(),
    };
  }
  if (session.status !== "open") return null;
  const openAt = new Date(session.openAt);
  const status = differenceInMinutes(now, openAt) > 5 ? "late" : "present";
  const existing = state.checkins.find((checkin) => checkin.sessionId === session.id && checkin.userId === userId);
  if (existing) {
    const updated = { ...existing, status, at: now.toISOString(), method };
    const checkins = state.checkins.map((checkin) => (checkin.id === existing.id ? updated : checkin));
    setState({ ...state, checkins });
    persist();
    return updated;
  }
  const checkin: Checkin = {
    id: uid("chk"),
    sessionId: session.id,
    classId: session.classId,
    userId,
    method,
    status,
    at: now.toISOString(),
  };
  setState({ ...state, checkins: [...state.checkins, checkin] });
  persist();
  return checkin;
}

export async function getSession(sessionId: string): Promise<Session | undefined> {
  await sleep(LATENCY);
  return getState().sessions.find((session) => session.id === sessionId);
}

export async function getClassById(classId: string): Promise<Class | undefined> {
  await sleep(LATENCY);
  return getState().classes.find((klass) => klass.id === classId);
}

export async function getProfile(userId: string): Promise<Profile | undefined> {
  await sleep(LATENCY);
  return getState().profiles.find((profile) => profile.id === userId);
}

export function getJoinableSessionsForUser(userId: string) {
  const state = getState();
  const enrollment = state.enrollments.filter((enr) => enr.userId === userId);
  const classIds = new Set(enrollment.map((enr) => enr.classId));
  return state.sessions.filter((session) => classIds.has(session.classId));
}

export function isSessionOpen(session: Session) {
  const now = new Date();
  const openAt = new Date(session.openAt);
  const closeAt = new Date(session.closeAt);
  return session.status === "open" && isAfter(now, openAt) && isBefore(now, closeAt);
}

export function listEnrollmentsForClass(classId: string) {
  const state = getState();
  return state.enrollments.filter((enr) => enr.classId === classId);
}
