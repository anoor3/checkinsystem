export type Role = "professor" | "student";

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarColor: string;
}

export interface Class {
  id: string;
  ownerId: string;
  name: string;
  section: string;
  term: string;
  timezone: string;
  joinCode: string;
  createdAt: string;
}

export interface Enrollment {
  id: string;
  classId: string;
  userId: string;
  role: Role;
}

export interface Session {
  id: string;
  classId: string;
  title: string;
  openAt: string;
  closeAt: string;
  rotatesEverySec: number;
  requireGeo: boolean;
  tokenSeed: string;
  status: "scheduled" | "open" | "closed";
}

export interface Checkin {
  id: string;
  sessionId: string;
  classId: string;
  userId: string;
  method: "code" | "qr" | "manual";
  status: "present" | "late" | "closed";
  at: string;
}

export interface TokenPayload {
  sid: string;
  exp: number;
  nonce: string;
}
