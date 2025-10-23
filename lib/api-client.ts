"use client";

import type { Checkin, Class, Session, Profile, Enrollment } from "@/types/domain";
import * as memoryApi from "@/lib/api";

async function jsonFetch<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  try {
    const response = await fetch(input, {
      headers: { "Content-Type": "application/json" },
      ...init,
    });
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    return (await response.json()) as T;
  } catch (error) {
    return fallbackRequest<T>(input, init);
  }
}

async function fallbackRequest<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const url = typeof input === "string" ? input : input.toString();
  const { method = "GET" } = init ?? {};
  const params = new URL(url, "http://localhost");

  if (url.startsWith("/api/profiles")) {
    return (await memoryApi.listProfiles()) as T;
  }
  if (url.startsWith("/api/classes") && method === "GET") {
    const ownerId = params.searchParams.get("ownerId");
    const studentId = params.searchParams.get("studentId");
    if (ownerId) return (await memoryApi.listClassesByOwner(ownerId)) as T;
    if (studentId) return (await memoryApi.listClassesForStudent(studentId)) as T;
  }
  if (url === "/api/classes" && method === "POST") {
    return (await memoryApi.createClass(JSON.parse(init?.body as string))) as T;
  }
  if (/\/api\/classes\/.+/.test(url) && method === "GET") {
    const id = url.split("/api/classes/")[1];
    return (await memoryApi.getClassById(id)) as T;
  }
  if (url.startsWith("/api/sessions") && method === "GET") {
    if (/\/api\/sessions\/.+/.test(url)) {
      const id = url.split("/api/sessions/")[1];
      return (await memoryApi.getSession(id)) as T;
    }
    const classId = params.searchParams.get("classId");
    if (classId) return (await memoryApi.listSessionsForClass(classId)) as T;
  }
  if (url.endsWith("/open") && method === "POST") {
    const id = url.split("/api/sessions/")[1].replace("/open", "");
    await memoryApi.startSession(id);
    return { ok: true } as T;
  }
  if (url.endsWith("/close") && method === "POST") {
    const id = url.split("/api/sessions/")[1].replace("/close", "");
    await memoryApi.closeSession(id);
    return { ok: true } as T;
  }
  if (url.endsWith("/rotate") && method === "POST") {
    const id = url.split("/api/sessions/")[1].replace("/rotate", "");
    const token = await memoryApi.rotateToken(id);
    return { token } as T;
  }
  if (url.startsWith("/api/checkins") && method === "GET") {
    const sessionId = params.searchParams.get("sessionId");
    const userId = params.searchParams.get("userId");
    if (sessionId) return (await memoryApi.listCheckins(sessionId)) as T;
    if (userId) return (await memoryApi.listCheckinsForUser(userId)) as T;
  }
  if (url === "/api/checkins/manual" && method === "POST") {
    const body = JSON.parse(init?.body as string);
    return (await memoryApi.manualAdjustCheckin(body.sessionId, body.userId, body.status)) as T;
  }
  if (url === "/api/join" && method === "POST") {
    const body = JSON.parse(init?.body as string);
    return (await memoryApi.joinClass(body.joinCode, body.userId)) as T;
  }
  if (url === "/api/checkins/token" && method === "POST") {
    const body = JSON.parse(init?.body as string);
    return (await memoryApi.markCheckinFromToken(body.token, body.userId, body.method)) as T;
  }
  if (url.startsWith("/api/enrollments") && method === "GET") {
    const classId = params.searchParams.get("classId");
    if (classId) return memoryApi.listEnrollmentsForClass(classId) as T;
  }
  throw errorForFallback(url);
}

function errorForFallback(url: string) {
  return new Error(`No fallback handler implemented for ${url}`);
}

export function listProfiles() {
  return jsonFetch<Profile[]>("/api/profiles");
}

export function listClassesByOwner(ownerId: string) {
  return jsonFetch<Class[]>(`/api/classes?ownerId=${ownerId}`);
}

export function listClassesForStudent(userId: string) {
  return jsonFetch<Class[]>(`/api/classes?studentId=${userId}`);
}

export function createClass(body: any) {
  return jsonFetch<Class>("/api/classes", { method: "POST", body: JSON.stringify(body) });
}

export function getClassById(id: string) {
  return jsonFetch<Class | null>(`/api/classes/${id}`);
}

export function listSessionsForClass(classId: string) {
  return jsonFetch<Session[]>(`/api/sessions?classId=${classId}`);
}

export function startSession(id: string) {
  return jsonFetch<{ ok: boolean }>(`/api/sessions/${id}/open`, { method: "POST" });
}

export function closeSession(id: string) {
  return jsonFetch<{ ok: boolean }>(`/api/sessions/${id}/close`, { method: "POST" });
}

export function rotateToken(id: string) {
  return jsonFetch<{ token: string }>(`/api/sessions/${id}/rotate`, { method: "POST" });
}

export function getSession(id: string) {
  return jsonFetch<Session | null>(`/api/sessions/${id}`);
}

export function listCheckins(sessionId: string) {
  return jsonFetch<Checkin[]>(`/api/checkins?sessionId=${sessionId}`);
}

export function listCheckinsForUser(userId: string) {
  return jsonFetch<Checkin[]>(`/api/checkins?userId=${userId}`);
}

export function joinClass(joinCode: string, userId: string) {
  return jsonFetch<Class | null>("/api/join", { method: "POST", body: JSON.stringify({ joinCode, userId }) });
}

export function manualAdjustCheckin(body: { sessionId: string; userId: string; status: Checkin["status"] }) {
  return jsonFetch<Checkin>("/api/checkins/manual", { method: "POST", body: JSON.stringify(body) });
}

export function markCheckinFromToken(token: string, userId: string, method: Checkin["method"]) {
  return jsonFetch<Checkin | null>("/api/checkins/token", { method: "POST", body: JSON.stringify({ token, userId, method }) });
}

export function listEnrollmentsForClass(classId: string) {
  return jsonFetch<Enrollment[]>(`/api/enrollments?classId=${classId}`);
}
