import { addMinutes, subMinutes } from "date-fns";
import { uid } from "@/lib/utils";
import type { Checkin, Class, Enrollment, Profile, Session } from "@/types/domain";

const now = new Date();

const professor: Profile = {
  id: "prof_1",
  name: "Dr. Aurora Lin",
  email: "aurora.lin@pulsecheck.edu",
  role: "professor",
  avatarColor: "from-indigo-500 to-sky-400",
};

const students: Profile[] = [
  "Ravi Kumar",
  "Sofia Martinez",
  "Emma Johansson",
  "Malik Harris",
  "Aiko Tanaka",
].map((name, index) => ({
  id: `stu_${index + 1}`,
  name,
  email: `${name.toLowerCase().replace(/\s/g, ".")}@pulsecheck.edu`,
  role: "student",
  avatarColor: [
    "from-sky-500 to-cyan-400",
    "from-emerald-500 to-lime-400",
    "from-purple-500 to-fuchsia-400",
    "from-orange-500 to-amber-400",
    "from-rose-500 to-pink-400",
  ][index % 5],
}));

export const profiles: Profile[] = [professor, ...students];

export const classes: Class[] = [
  {
    id: "class_1",
    ownerId: professor.id,
    name: "Human-Centered Design",
    section: "DES 301",
    term: "Spring 2024",
    timezone: "America/Los_Angeles",
    joinCode: "HCD-301",
    createdAt: now.toISOString(),
  },
  {
    id: "class_2",
    ownerId: professor.id,
    name: "Creative Coding Studio",
    section: "CS 245",
    term: "Spring 2024",
    timezone: "America/New_York",
    joinCode: "CCS-245",
    createdAt: now.toISOString(),
  },
];

export const enrollments: Enrollment[] = students.flatMap((student) =>
  classes.map((klass) => ({
    id: uid("enr"),
    classId: klass.id,
    userId: student.id,
    role: "student" as const,
  }))
);

enrollments.push({
  id: uid("enr"),
  classId: classes[0].id,
  userId: professor.id,
  role: "professor",
});

enrollments.push({
  id: uid("enr"),
  classId: classes[1].id,
  userId: professor.id,
  role: "professor",
});

const openSessionStart = subMinutes(now, 5);

export const sessions: Session[] = [
  {
    id: "ses_1",
    classId: classes[0].id,
    title: "Week 5 • Synthesis Lab",
    openAt: subMinutes(now, 80).toISOString(),
    closeAt: subMinutes(now, 50).toISOString(),
    rotatesEverySec: 30,
    requireGeo: false,
    tokenSeed: uid("seed"),
    status: "closed",
  },
  {
    id: "ses_2",
    classId: classes[0].id,
    title: "Week 6 • Critique Studio",
    openAt: openSessionStart.toISOString(),
    closeAt: addMinutes(openSessionStart, 30).toISOString(),
    rotatesEverySec: 20,
    requireGeo: false,
    tokenSeed: uid("seed"),
    status: "open",
  },
  {
    id: "ses_3",
    classId: classes[1].id,
    title: "Week 6 • Generative Systems",
    openAt: addMinutes(now, 60).toISOString(),
    closeAt: addMinutes(now, 120).toISOString(),
    rotatesEverySec: 15,
    requireGeo: false,
    tokenSeed: uid("seed"),
    status: "scheduled",
  },
];

export const checkins: Checkin[] = [
  {
    id: uid("chk"),
    sessionId: sessions[0].id,
    classId: classes[0].id,
    userId: students[0].id,
    method: "qr",
    status: "present",
    at: subMinutes(now, 70).toISOString(),
  },
  {
    id: uid("chk"),
    sessionId: sessions[0].id,
    classId: classes[0].id,
    userId: students[1].id,
    method: "code",
    status: "late",
    at: subMinutes(now, 60).toISOString(),
  },
  {
    id: uid("chk"),
    sessionId: sessions[1].id,
    classId: classes[0].id,
    userId: students[2].id,
    method: "qr",
    status: "present",
    at: subMinutes(now, 2).toISOString(),
  },
];

export const seed = {
  profiles,
  classes,
  enrollments,
  sessions,
  checkins,
};
