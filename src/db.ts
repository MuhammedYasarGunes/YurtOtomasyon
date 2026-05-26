/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from "fs";
import path from "path";
import {
  Tenant,
  User,
  UserRole,
  StudentProfile,
  Application,
  ApplicationStatus,
  Room,
  AssignmentLog,
  Payment,
  MaintenanceRequest,
  EntryExitLog,
  Announcement,
  Notification,
  LifestyleForm
} from "./types.js";

const DB_FILE = path.join(process.cwd(), "yurtapp_db.json");

export interface DatabaseSchema {
  tenants: Tenant[];
  users: User[];
  studentProfiles: StudentProfile[];
  applications: Application[];
  rooms: Room[];
  assignmentLogs: AssignmentLog[];
  payments: Payment[];
  maintenanceRequests: MaintenanceRequest[];
  attendanceLogs: EntryExitLog[];
  announcements: Announcement[];
  notifications: Notification[];
}

// In-Memory Fallback structure
let dbState: DatabaseSchema = {
  tenants: [],
  users: [],
  studentProfiles: [],
  applications: [],
  rooms: [],
  assignmentLogs: [],
  payments: [],
  maintenanceRequests: [],
  attendanceLogs: [],
  announcements: [],
  notifications: []
};

// Initial Core Seed Data
const seedData: DatabaseSchema = {
  tenants: [
    {
      id: "tenant-oakridge",
      name: "Oakridge Manor Dormitory",
      location: "East Campus, University District",
      monthlyFee: 480,
      totalRooms: 12
    },
    {
      id: "tenant-nexus",
      name: "Nexus Cyber Tech Residence",
      location: "North Tech Zone, Innovation Hub",
      monthlyFee: 580,
      totalRooms: 15
    },
    {
      id: "tenant-meadowview",
      name: "Meadowview student Village",
      location: "West Green Meadows, Lakeside Campus",
      monthlyFee: 420,
      totalRooms: 10
    }
  ],
  users: [
    {
      id: "user-super",
      email: "super@yurtapp.com",
      name: "Ambrose Sterling",
      role: UserRole.SUPER_ADMIN,
      createdAt: "2026-01-10T08:00:00Z"
    },
    {
      id: "user-oakridge-admin",
      email: "oakridge_admin@yurtapp.com",
      name: "Harlan Cole",
      role: UserRole.DORM_ADMIN,
      tenantId: "tenant-oakridge",
      createdAt: "2026-01-15T09:15:00Z"
    },
    {
      id: "user-nexus-admin",
      email: "nexus_admin@yurtapp.com",
      name: "Keira Vance",
      role: UserRole.DORM_ADMIN,
      tenantId: "tenant-nexus",
      createdAt: "2026-02-01T10:00:00Z"
    },
    {
      id: "user-staff1",
      email: "staff_john@yurtapp.com",
      name: "John Carter",
      role: UserRole.STAFF,
      tenantId: "tenant-oakridge",
      createdAt: "2026-02-10T07:30:00Z"
    },
    {
      id: "user-student-alex",
      email: "student_alex@yurtapp.com",
      name: "Alex Reed",
      role: UserRole.STUDENT,
      tenantId: "tenant-oakridge",
      createdAt: "2026-03-01T11:00:00Z"
    },
    {
      id: "user-student-sarah",
      email: "student_sarah@yurtapp.com",
      name: "Sarah Lin",
      role: UserRole.STUDENT,
      tenantId: "tenant-nexus",
      createdAt: "2026-03-05T12:00:00Z"
    },
    {
      id: "user-student-liam",
      email: "student_liam@yurtapp.com",
      name: "Liam Carter",
      role: UserRole.STUDENT,
      createdAt: "2026-05-18T14:30:00Z"
    },
    {
      id: "user-student-chloe",
      email: "student_chloe@yurtapp.com",
      name: "Chloe Davis",
      role: UserRole.STUDENT,
      createdAt: "2026-05-19T10:15:00Z"
    }
  ],
  studentProfiles: [
    {
      studentId: "user-student-alex",
      lifestyleAnswers: {
        sleepSchedule: "early-bird",
        cleanlinessLevel: 4,
        noiseTolerance: 2,
        smokingPreference: "non-smoker",
        socialLevel: 2,
        gamingHabits: "none",
        studyHabits: "solo-quiet",
        introvertExtrovert: 2,
        conflictTolerance: 3,
        preferredRoommateType: "Quiet and disciplined academic peer."
      },
      vector: {
        social_score: 30,
        discipline_score: 85,
        cleanliness_score: 80,
        noise_tolerance: 30,
        night_activity_score: 15
      },
      tags: ["early-bird", "high-discipline", "quiet-study"],
      analyzedAt: "2026-03-01T11:30:00Z"
    },
    {
      studentId: "user-student-sarah",
      lifestyleAnswers: {
        sleepSchedule: "night-owl",
        cleanlinessLevel: 3,
        noiseTolerance: 5,
        smokingPreference: "non-smoker",
        socialLevel: 5,
        gamingHabits: "frequent",
        studyHabits: "group-study",
        introvertExtrovert: 5,
        conflictTolerance: 4,
        preferredRoommateType: "Outgoing and gaming-friendly roommate who stays up."
      },
      vector: {
        social_score: 90,
        discipline_score: 55,
        cleanliness_score: 60,
        noise_tolerance: 90,
        night_activity_score: 85
      },
      tags: ["night-owl", "gamer", "highly-social"],
      analyzedAt: "2026-03-05T12:30:00Z"
    }
  ],
  applications: [
    {
      id: "app-liam",
      studentId: "user-student-liam",
      studentName: "Liam Carter",
      studentEmail: "student_liam@yurtapp.com",
      preferredTenantId: "tenant-nexus",
      lifestyleForm: {
        sleepSchedule: "night-owl",
        cleanlinessLevel: 3,
        noiseTolerance: 4,
        smokingPreference: "non-smoker",
        socialLevel: 4,
        gamingHabits: "occasional",
        studyHabits: "group-study",
        introvertExtrovert: 4,
        conflictTolerance: 4,
        preferredRoommateType: "I prefer someone outgoing, gaming is cool, who stays up relatively late."
      },
      status: ApplicationStatus.AI_MATCHED,
      vector: {
        social_score: 80,
        discipline_score: 65,
        cleanliness_score: 60,
        noise_tolerance: 80,
        night_activity_score: 75
      },
      tags: ["night-owl", "highly-social", "moderate-discipline"],
      suggestedRoomId: "room-nexus-301",
      compatibilityLog: {
        compatibilityScore: 88,
        conflictRisk: 15,
        matchingNotes: "High compatibility based on owl schedules, high noise tolerance, and joint visual profiles matching resident Sarah Lin."
      },
      submittedAt: "2026-05-18T14:40:00Z"
    },
    {
      id: "app-chloe",
      studentId: "user-student-chloe",
      studentName: "Chloe Davis",
      studentEmail: "student_chloe@yurtapp.com",
      preferredTenantId: "tenant-oakridge",
      lifestyleForm: {
        sleepSchedule: "early-bird",
        cleanlinessLevel: 5,
        noiseTolerance: 1,
        smokingPreference: "non-smoker",
        socialLevel: 1,
        gamingHabits: "none",
        studyHabits: "solo-quiet",
        introvertExtrovert: 1,
        conflictTolerance: 2,
        preferredRoommateType: "Extremely quiet, tidy, and academically oriented roommate who values sleep."
      },
      status: ApplicationStatus.SUBMITTED,
      submittedAt: "2026-05-19T10:20:00Z"
    }
  ],
  rooms: [
    {
      id: "room-oakridge-101",
      tenantId: "tenant-oakridge",
      roomNumber: "101",
      capacity: 2,
      occupancy: 1,
      gender: "Male",
      residentIds: ["user-student-alex"],
      avgSocialScore: 30,
      avgDisciplineScore: 85,
      avgNoiseLevel: 30,
      profileTags: ["quiet-study", "high-discipline"]
    },
    {
      id: "room-oakridge-102",
      tenantId: "tenant-oakridge",
      roomNumber: "102",
      capacity: 2,
      occupancy: 0,
      gender: "Male",
      residentIds: [],
      profileTags: []
    },
    {
      id: "room-oakridge-103",
      tenantId: "tenant-oakridge",
      roomNumber: "103",
      capacity: 4,
      occupancy: 0,
      gender: "Female",
      residentIds: [],
      profileTags: []
    },
    {
      id: "room-nexus-301",
      tenantId: "tenant-nexus",
      roomNumber: "301",
      capacity: 2,
      occupancy: 1,
      gender: "Female",
      residentIds: ["user-student-sarah"],
      avgSocialScore: 90,
      avgDisciplineScore: 55,
      avgNoiseLevel: 75,
      profileTags: ["night-owl", "highly-social", "gamer"]
    },
    {
      id: "room-nexus-302",
      tenantId: "tenant-nexus",
      roomNumber: "302",
      capacity: 2,
      occupancy: 0,
      gender: "Male",
      residentIds: [],
      profileTags: []
    },
    {
      id: "room-meadowview-201",
      tenantId: "tenant-meadowview",
      roomNumber: "201",
      capacity: 2,
      occupancy: 0,
      gender: "Co-Ed",
      residentIds: [],
      profileTags: []
    }
  ],
  assignmentLogs: [
    {
      id: "log-alex",
      studentId: "user-student-alex",
      studentName: "Alex Reed",
      roomId: "room-oakridge-101",
      roomNumber: "101",
      tenantId: "tenant-oakridge",
      compatibilityScore: 95,
      conflictRisk: 5,
      explanation: "Matched into the academic quiet rooms dynamically for high discipline scores & parallel schedules.",
      isOverridden: false,
      assignedBy: "System (Self-Seeded)",
      assignedAt: "2026-03-01T11:45:00Z"
    },
    {
      id: "log-sarah",
      studentId: "user-student-sarah",
      studentName: "Sarah Lin",
      roomId: "room-nexus-301",
      roomNumber: "301",
      tenantId: "tenant-nexus",
      compatibilityScore: 92,
      conflictRisk: 8,
      explanation: "Late-night game preference and extroverted behaviors aligns perfectly down to the core gaming lifestyle cluster.",
      isOverridden: false,
      assignedBy: "System (Self-Seeded)",
      assignedAt: "2026-03-05T12:45:00Z"
    }
  ],
  payments: [
    {
      id: "pay-alex-may",
      studentId: "user-student-alex",
      studentName: "Alex Reed",
      tenantId: "tenant-oakridge",
      amount: 480,
      dueDate: "2026-05-01",
      status: "PAID",
      paymentDate: "2026-04-28T14:20:00Z",
      transactionHash: "0x8fa40294e823b1dc32",
      invoiceNumber: "INV-2026-OAK-104"
    },
    {
      id: "pay-sarah-may",
      studentId: "user-student-sarah",
      studentName: "Sarah Lin",
      tenantId: "tenant-nexus",
      amount: 580,
      dueDate: "2026-05-01",
      status: "UNPAID",
      invoiceNumber: "INV-2026-NEX-213"
    },
    {
      id: "pay-sarah-april",
      studentId: "user-student-sarah",
      studentName: "Sarah Lin",
      tenantId: "tenant-nexus",
      amount: 580,
      dueDate: "2026-04-01",
      status: "OVERDUE",
      invoiceNumber: "INV-2026-NEX-102"
    }
  ],
  maintenanceRequests: [
    {
      id: "maint-1",
      studentId: "user-student-alex",
      studentName: "Alex Reed",
      roomId: "room-oakridge-101",
      roomNumber: "101",
      tenantId: "tenant-oakridge",
      title: "Clogged bathroom sink",
      description: "Water draining incredibly slow, potentially deep blockage.",
      category: "Plumbing",
      status: "IN_PROGRESS",
      urgency: "MEDIUM",
      createdAt: "2026-05-18T09:00:00Z",
      updatedAt: "2026-05-19T11:00:00Z"
    },
    {
      id: "maint-2",
      studentId: "user-student-sarah",
      studentName: "Sarah Lin",
      roomId: "room-nexus-301",
      roomNumber: "301",
      tenantId: "tenant-nexus",
      title: "Broken wardrobe rack hinges",
      description: "Left wardrobe door is hanging awkwardly because hinges are missing a screw.",
      category: "Furniture",
      status: "SUBMITTED",
      urgency: "LOW",
      createdAt: "2026-05-18T16:00:00Z",
      updatedAt: "2026-05-18T16:00:00Z"
    }
  ],
  attendanceLogs: [
    {
      id: "att-1",
      studentId: "user-student-alex",
      studentName: "Alex Reed",
      tenantId: "tenant-oakridge",
      roomNumber: "101",
      direction: "OUT",
      timestamp: "2026-05-20T08:15:00Z",
      loggedBy: "Entrance Gate RFID"
    },
    {
      id: "att-2",
      studentId: "user-student-alex",
      studentName: "Alex Reed",
      tenantId: "tenant-oakridge",
      roomNumber: "101",
      direction: "IN",
      timestamp: "2026-05-20T11:45:00Z",
      loggedBy: "Entrance Gate RFID"
    },
    {
      id: "att-3",
      studentId: "user-student-sarah",
      studentName: "Sarah Lin",
      tenantId: "tenant-nexus",
      roomNumber: "301",
      direction: "OUT",
      timestamp: "2026-05-19T22:30:00Z",
      loggedBy: "Dynamic Terminal QR Scanner"
    }
  ],
  announcements: [
    {
      id: "ann-global-1",
      title: "Annual Fire Safety Audits & Inter-Dorm Drills",
      content: "All resident buildings will undergo fire warden drills next Tuesday starting from 2:00 PM. Please vacate promptly on sirens.",
      priority: "HIGH",
      createdAt: "2026-05-15T09:00:00Z"
    },
    {
      id: "ann-oakridge-1",
      tenantId: "tenant-oakridge",
      title: "Oakridge HVAC Filtration System Replacements",
      content: "East Wing maintenance teams will visit rooms on Wednesday for filter swaps. Secure valuable items.",
      priority: "MEDIUM",
      targetRole: UserRole.STUDENT,
      createdAt: "2026-05-18T10:00:00Z"
    }
  ],
  notifications: [
    {
      id: "notif-1",
      userId: "user-student-sarah",
      title: "Pending Dormitory Fees Overdue",
      message: "Your April invoice is now 49 days overdue. Surcharges of $25 may apply.",
      isRead: false,
      createdAt: "2026-05-10T09:00:00Z"
    }
  ]
};

// IO Safe Reads & Writes
export function readDB(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, "utf-8");
      dbState = JSON.parse(content);
      return dbState;
    } else {
      writeDB(seedData);
      return seedData;
    }
  } catch (err) {
    console.error("Error reading database file, returning memory state:", err);
    return dbState;
  }
}

export function writeDB(state: DatabaseSchema): void {
  try {
    dbState = state;
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing database file:", err);
  }
}

// Service Methods / Repositories for YurtApp State Mutators

export const Services = {
  getTenants() {
    const db = readDB();
    return db.tenants;
  },

  getTenant(id: string) {
    const db = readDB();
    return db.tenants.find((t) => t.id === id);
  },

  getRooms(tenantId?: string) {
    const db = readDB();
    if (tenantId) {
      return db.rooms.filter((r) => r.tenantId === tenantId);
    }
    return db.rooms;
  },

  getUsers() {
    return readDB().users;
  },

  getStudentProfiles() {
    return readDB().studentProfiles;
  },

  getApplications(tenantId?: string) {
    const db = readDB();
    if (tenantId) {
      return db.applications.filter((a) => a.preferredTenantId === tenantId);
    }
    return db.applications;
  },

  getPayments(tenantId?: string) {
    const db = readDB();
    if (tenantId) {
      return db.payments.filter((p) => p.tenantId === tenantId);
    }
    return db.payments;
  },

  getMaintenanceRequests(tenantId?: string) {
    const db = readDB();
    if (tenantId) {
      return db.maintenanceRequests.filter((m) => m.tenantId === tenantId);
    }
    return db.maintenanceRequests;
  },

  getAttendanceLogs(tenantId?: string) {
    const db = readDB();
    if (tenantId) {
      return db.attendanceLogs.filter((l) => l.tenantId === tenantId);
    }
    return db.attendanceLogs;
  },

  getAnnouncements(tenantId?: string) {
    const db = readDB();
    if (tenantId) {
      return db.announcements.filter((a) => !a.tenantId || a.tenantId === tenantId);
    }
    return db.announcements;
  },

  getNotifications(userId: string) {
    const db = readDB();
    return db.notifications.filter((n) => n.userId === userId);
  },

  createNotification(userId: string, title: string, message: string) {
    const db = readDB();
    const newNotif: Notification = {
      id: "notif-" + Math.random().toString(36).substr(2, 9),
      userId,
      title,
      message,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    db.notifications.unshift(newNotif);
    writeDB(db);
    return newNotif;
  },

  // State actions
  submitApplication(studentId: string, tenantId: string, form: LifestyleForm) {
    const db = readDB();
    const student = db.users.find((u) => u.id === studentId);
    if (!student) throw new Error("Student user not found");

    // Remove duplicates if any
    db.applications = db.applications.filter((a) => a.studentId !== studentId);

    const newApp: Application = {
      id: "app-" + Math.random().toString(36).substr(2, 9),
      studentId,
      studentName: student.name,
      studentEmail: student.email,
      preferredTenantId: tenantId,
      lifestyleForm: form,
      status: ApplicationStatus.SUBMITTED,
      submittedAt: new Date().toISOString()
    };
    db.applications.push(newApp);
    writeDB(db);
    return newApp;
  },

  updateApplicationStatus(appId: string, status: ApplicationStatus, suggestion?: any) {
    const db = readDB();
    const appIndex = db.applications.findIndex((a) => a.id === appId);
    if (appIndex === -1) throw new Error("Application not found");

    db.applications[appIndex].status = status;
    if (suggestion) {
      db.applications[appIndex].suggestedRoomId = suggestion.roomId;
      db.applications[appIndex].compatibilityLog = {
        compatibilityScore: suggestion.compatibilityScore,
        conflictRisk: suggestion.conflictRisk,
        matchingNotes: suggestion.matchingNotes
      };
      if (suggestion.vector) {
        db.applications[appIndex].vector = suggestion.vector;
      }
      if (suggestion.tags) {
        db.applications[appIndex].tags = suggestion.tags;
      }
    }
    writeDB(db);
    return db.applications[appIndex];
  },

  assignRoomToStudent(appId: string, roomId: string, assignedByUserId: string) {
    const db = readDB();
    const app = db.applications.find((a) => a.id === appId);
    if (!app) throw new Error("Application not found");

    const room = db.rooms.find((r) => r.id === roomId);
    if (!room) throw new Error("Target room not found");

    if (room.occupancy >= room.capacity) {
      throw new Error("Target room is currently at maximum capacity");
    }

    // Connect user to the tenant and room
    const userIndex = db.users.findIndex((u) => u.id === app.studentId);
    if (userIndex !== -1) {
      db.users[userIndex].tenantId = room.tenantId;
    }

    // Insert resident into room
    if (!room.residentIds.includes(app.studentId)) {
      room.residentIds.push(app.studentId);
      room.occupancy = room.residentIds.length;
    }

    // Recalculate Room stats
    this.recalculateRoomStatsMock(room, db);

    // Save student profile
    const existingProfileIdx = db.studentProfiles.findIndex((p) => p.studentId === app.studentId);
    const newProfile: StudentProfile = {
      studentId: app.studentId,
      lifestyleAnswers: app.lifestyleForm,
      vector: app.vector,
      tags: app.tags,
      analyzedAt: new Date().toISOString()
    };
    if (existingProfileIdx !== -1) {
      db.studentProfiles[existingProfileIdx] = newProfile;
    } else {
      db.studentProfiles.push(newProfile);
    }

    // Update application status to ASSIGNED
    app.status = ApplicationStatus.ASSIGNED;
    app.suggestedRoomId = roomId;

    // Create Payment record
    const tenant = db.tenants.find((t) => t.id === room.tenantId);
    const cost = tenant ? tenant.monthlyFee : 500;
    const newPayment: Payment = {
      id: "pay-" + Math.random().toString(36).substr(2, 9),
      studentId: app.studentId,
      studentName: app.studentName,
      tenantId: room.tenantId,
      amount: cost,
      dueDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString().split("T")[0],
      status: "UNPAID",
      invoiceNumber: "INV-" + new Date().getFullYear() + "-" + room.roomNumber + "-" + Math.floor(Math.random() * 900 + 100)
    };
    db.payments.unshift(newPayment);

    // Write assignment log
    const compatibility = app.compatibilityLog?.compatibilityScore || 85;
    const conflict = app.compatibilityLog?.conflictRisk || 15;
    const notes = app.compatibilityLog?.matchingNotes || "Manual placement override.";

    const log: AssignmentLog = {
      id: "log-" + Math.random().toString(36).substr(2, 9),
      studentId: app.studentId,
      studentName: app.studentName,
      roomId: room.id,
      roomNumber: room.roomNumber,
      tenantId: room.tenantId,
      compatibilityScore: compatibility,
      conflictRisk: conflict,
      explanation: notes,
      isOverridden: assignedByUserId !== "AI",
      assignedBy: assignedByUserId,
      assignedAt: new Date().toISOString()
    };
    db.assignmentLogs.unshift(log);

    // Create notifications
    this.createNotification(
      app.studentId,
      "Room Assignment Finalized",
      `Welcome to YurtApp! You have been assigned room ${room.roomNumber} inside ${tenant?.name || "the dormitory"}.`
    );

    writeDB(db);
    return log;
  },

  recalculateRoomStatsMock(room: Room, db: DatabaseSchema) {
    const residentProfiles = db.studentProfiles.filter((p) => room.residentIds.includes(p.studentId));
    if (residentProfiles.length > 0) {
      let totalSocial = 0;
      let totalDiscipline = 0;
      let totalNoise = 0;
      let allTags = new Set<string>();

      residentProfiles.forEach((p) => {
        if (p.vector) {
          totalSocial += p.vector.social_score;
          totalDiscipline += p.vector.discipline_score;
          totalNoise += p.vector.noise_tolerance;
        }
        p.tags?.forEach((t) => allTags.add(t));
      });

      room.avgSocialScore = Math.round(totalSocial / residentProfiles.length);
      room.avgDisciplineScore = Math.round(totalDiscipline / residentProfiles.length);
      room.avgNoiseLevel = Math.round(totalNoise / residentProfiles.length);
      room.profileTags = Array.from(allTags);
    } else {
      room.avgSocialScore = undefined;
      room.avgDisciplineScore = undefined;
      room.avgNoiseLevel = undefined;
      room.profileTags = [];
    }
  },

  // Manual admin room overrides or resets
  evictResident(studentId: string, roomId: string) {
    const db = readDB();
    const room = db.rooms.find((r) => r.id === roomId);
    if (!room) return;

    room.residentIds = room.residentIds.filter((id) => id !== studentId);
    room.occupancy = room.residentIds.length;
    this.recalculateRoomStatsMock(room, db);

    const userIdx = db.users.findIndex((u) => u.id === studentId);
    if (userIdx !== -1) {
      db.users[userIdx].tenantId = undefined; // De-assigned
    }

    // Delete corresponding Application to allow applying again
    db.applications = db.applications.filter((a) => a.studentId !== studentId);

    writeDB(db);
  },

  createMaintenance(studentId: string, title: string, description: string, category: any, urgency: any) {
    const db = readDB();
    const student = db.users.find((u) => u.id === studentId);
    if (!student) throw new Error("Student not found");

    const room = db.rooms.find((r) => r.residentIds.includes(studentId));
    if (!room) throw new Error("Resident room association not found");

    const newReq: MaintenanceRequest = {
      id: "maint-" + Math.random().toString(36).substr(2, 9),
      studentId,
      studentName: student.name,
      roomId: room.id,
      roomNumber: room.roomNumber,
      tenantId: student.tenantId || room.tenantId,
      title,
      description,
      category,
      status: "SUBMITTED",
      urgency,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.maintenanceRequests.unshift(newReq);
    writeDB(db);
    return newReq;
  },

  updateMaintenance(reqId: string, status: any, staffUpdate?: string) {
    const db = readDB();
    const req = db.maintenanceRequests.find((m) => m.id === reqId);
    if (!req) throw new Error("Maintenance request not found");

    req.status = status;
    if (staffUpdate) {
      req.staffUpdate = staffUpdate;
    }
    req.updatedAt = new Date().toISOString();

    this.createNotification(
      req.studentId,
      `Maintenance Update: ${req.title}`,
      `Your maintenance ticket has been updated to: ${status}. Staff remarks: ${staffUpdate || "None"}`
    );

    writeDB(db);
    return req;
  },

  createAnnouncement(tenantId: string | undefined, title: string, content: string, priority: any, role?: UserRole) {
    const db = readDB();
    const newAnn: Announcement = {
      id: "ann-" + Math.random().toString(36).substr(2, 9),
      tenantId,
      title,
      content,
      priority,
      targetRole: role,
      createdAt: new Date().toISOString()
    };
    db.announcements.unshift(newAnn);
    writeDB(db);
    return newAnn;
  },

  payInvoice(payId: string) {
    const db = readDB();
    const payment = db.payments.find((p) => p.id === payId);
    if (!payment) throw new Error("Invoice record not found");

    payment.status = "PAID";
    payment.paymentDate = new Date().toISOString();
    payment.transactionHash = "0x" + Math.random().toString(16).substr(2, 16);

    this.createNotification(
      payment.studentId,
      "Payment Confirmed",
      `Your rent invoice ${payment.invoiceNumber} ($${payment.amount}) has been successfully paid.`
    );

    writeDB(db);
    return payment;
  },

  logAttendance(studentId: string, direction: "IN" | "OUT", loggedBy: string) {
    const db = readDB();
    const student = db.users.find((u) => u.id === studentId);
    if (!student) throw new Error("Student not found");

    const room = db.rooms.find((r) => r.residentIds.includes(studentId));
    const roomNo = room ? room.roomNumber : "N/A";

    const newLog: EntryExitLog = {
      id: "att-" + Math.random().toString(36).substr(2, 9),
      studentId,
      studentName: student.name,
      tenantId: student.tenantId || "N/A",
      roomNumber: roomNo,
      direction,
      timestamp: new Date().toISOString(),
      loggedBy
    };
    db.attendanceLogs.unshift(newLog);
    writeDB(db);
    return newLog;
  }
};
