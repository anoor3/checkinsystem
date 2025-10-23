import { http, HttpResponse } from "msw";
import {
  listClassesByOwner,
  listClassesForStudent,
  createClass,
  listSessionsForClass,
  startSession,
  closeSession,
  listCheckins,
  manualAdjustCheckin,
  joinClass,
  markCheckinFromToken,
  getSession,
  rotateToken,
  listCheckinsForUser,
  getClassById,
  listProfiles,
  listEnrollmentsForClass,
} from "@/lib/api";

export const handlers = [
  http.get("/api/profiles", async () => {
    const data = await listProfiles();
    return HttpResponse.json(data);
  }),
  http.get("/api/classes", async ({ request }) => {
    const url = new URL(request.url);
    const ownerId = url.searchParams.get("ownerId");
    const studentId = url.searchParams.get("studentId");
    if (ownerId) {
      const data = await listClassesByOwner(ownerId);
      return HttpResponse.json(data);
    }
    if (studentId) {
      const data = await listClassesForStudent(studentId);
      return HttpResponse.json(data);
    }
    return HttpResponse.json([]);
  }),
  http.post("/api/classes", async ({ request }) => {
    const body = await request.json();
    const data = await createClass(body);
    return HttpResponse.json(data);
  }),
  http.get("/api/classes/:id", async ({ params }) => {
    const data = await getClassById(params.id as string);
    return HttpResponse.json(data);
  }),
  http.get("/api/sessions", async ({ request }) => {
    const url = new URL(request.url);
    const classId = url.searchParams.get("classId");
    if (!classId) return HttpResponse.json([]);
    const data = await listSessionsForClass(classId);
    return HttpResponse.json(data);
  }),
  http.post("/api/sessions/:id/open", async ({ params }) => {
    await startSession(params.id as string);
    return HttpResponse.json({ ok: true });
  }),
  http.post("/api/sessions/:id/close", async ({ params }) => {
    await closeSession(params.id as string);
    return HttpResponse.json({ ok: true });
  }),
  http.post("/api/sessions/:id/rotate", async ({ params }) => {
    const token = await rotateToken(params.id as string);
    return HttpResponse.json({ token });
  }),
  http.get("/api/sessions/:id", async ({ params }) => {
    const data = await getSession(params.id as string);
    return HttpResponse.json(data);
  }),
  http.get("/api/checkins", async ({ request }) => {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get("sessionId");
    const userId = url.searchParams.get("userId");
    if (sessionId) {
      const data = await listCheckins(sessionId);
      return HttpResponse.json(data);
    }
    if (userId) {
      const data = await listCheckinsForUser(userId);
      return HttpResponse.json(data);
    }
    return HttpResponse.json([]);
  }),
  http.post("/api/checkins/manual", async ({ request }) => {
    const body = await request.json();
    const data = await manualAdjustCheckin(body.sessionId, body.userId, body.status);
    return HttpResponse.json(data);
  }),
  http.post("/api/join", async ({ request }) => {
    const body = await request.json();
    const data = await joinClass(body.joinCode, body.userId);
    return HttpResponse.json(data);
  }),
  http.get("/api/enrollments", async ({ request }) => {
    const url = new URL(request.url);
    const classId = url.searchParams.get("classId");
    if (!classId) return HttpResponse.json([]);
    const data = listEnrollmentsForClass(classId);
    return HttpResponse.json(data);
  }),
  http.post("/api/checkins/token", async ({ request }) => {
    const body = await request.json();
    const data = await markCheckinFromToken(body.token, body.userId, body.method);
    return HttpResponse.json(data);
  }),
];
