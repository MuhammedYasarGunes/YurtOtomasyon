"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path2 = __toESM(require("path"), 1);
var import_fs2 = __toESM(require("fs"), 1);

// src/db.ts
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);
var DB_FILE = import_path.default.join(process.cwd(), "yurtapp_db.json");
var dbState = {
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
var seedData = {
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
      role: "SUPER_ADMIN" /* SUPER_ADMIN */,
      createdAt: "2026-01-10T08:00:00Z"
    },
    {
      id: "user-oakridge-admin",
      email: "oakridge_admin@yurtapp.com",
      name: "Harlan Cole",
      role: "DORM_ADMIN" /* DORM_ADMIN */,
      tenantId: "tenant-oakridge",
      createdAt: "2026-01-15T09:15:00Z"
    },
    {
      id: "user-nexus-admin",
      email: "nexus_admin@yurtapp.com",
      name: "Keira Vance",
      role: "DORM_ADMIN" /* DORM_ADMIN */,
      tenantId: "tenant-nexus",
      createdAt: "2026-02-01T10:00:00Z"
    },
    {
      id: "user-staff1",
      email: "staff_john@yurtapp.com",
      name: "John Carter",
      role: "STAFF" /* STAFF */,
      tenantId: "tenant-oakridge",
      createdAt: "2026-02-10T07:30:00Z"
    },
    {
      id: "user-student-alex",
      email: "student_alex@yurtapp.com",
      name: "Alex Reed",
      role: "STUDENT" /* STUDENT */,
      tenantId: "tenant-oakridge",
      createdAt: "2026-03-01T11:00:00Z"
    },
    {
      id: "user-student-sarah",
      email: "student_sarah@yurtapp.com",
      name: "Sarah Lin",
      role: "STUDENT" /* STUDENT */,
      tenantId: "tenant-nexus",
      createdAt: "2026-03-05T12:00:00Z"
    },
    {
      id: "user-student-liam",
      email: "student_liam@yurtapp.com",
      name: "Liam Carter",
      role: "STUDENT" /* STUDENT */,
      createdAt: "2026-05-18T14:30:00Z"
    },
    {
      id: "user-student-chloe",
      email: "student_chloe@yurtapp.com",
      name: "Chloe Davis",
      role: "STUDENT" /* STUDENT */,
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
      status: "AI_MATCHED" /* AI_MATCHED */,
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
      status: "SUBMITTED" /* SUBMITTED */,
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
      targetRole: "STUDENT" /* STUDENT */,
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
function readDB() {
  try {
    if (import_fs.default.existsSync(DB_FILE)) {
      const content = import_fs.default.readFileSync(DB_FILE, "utf-8");
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
function writeDB(state) {
  try {
    dbState = state;
    import_fs.default.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing database file:", err);
  }
}

// src/infrastructure/repositories/JSONRepositories.ts
var JSONUserRepository = class {
  async getAll() {
    return readDB().users;
  }
  async getById(id) {
    return readDB().users.find((u) => u.id === id);
  }
  async getByEmail(email) {
    return readDB().users.find((u) => u.email.toLowerCase().trim() === email.toLowerCase().trim());
  }
  async create(user) {
    const db = readDB();
    db.users.push(user);
    writeDB(db);
    return user;
  }
  async update(user) {
    const db = readDB();
    const idx = db.users.findIndex((u) => u.id === user.id);
    if (idx !== -1) {
      db.users[idx] = user;
      writeDB(db);
    }
    return user;
  }
};
var JSONTenantRepository = class {
  async getAll() {
    return readDB().tenants;
  }
  async getById(id) {
    return readDB().tenants.find((t) => t.id === id);
  }
};
var JSONRoomRepository = class {
  async getAll(tenantId) {
    const db = readDB();
    const rooms = tenantId ? db.rooms.filter((r) => r.tenantId === tenantId) : db.rooms;
    return rooms;
  }
  async getById(id) {
    return readDB().rooms.find((r) => r.id === id);
  }
  async save(room) {
    const db = readDB();
    const idx = db.rooms.findIndex((r) => r.id === room.id);
    if (idx !== -1) {
      db.rooms[idx] = room;
    } else {
      db.rooms.push(room);
    }
    writeDB(db);
    return room;
  }
};
var JSONApplicationRepository = class {
  async getAll(tenantId) {
    const db = readDB();
    const applications = tenantId ? db.applications.filter((a) => a.preferredTenantId === tenantId) : db.applications;
    return applications;
  }
  async getById(id) {
    return readDB().applications.find((a) => a.id === id);
  }
  async getByStudentId(studentId) {
    return readDB().applications.find((a) => a.studentId === studentId);
  }
  async save(application) {
    const db = readDB();
    const dbApplication = application;
    const idx = db.applications.findIndex((a) => a.id === application.id);
    if (idx !== -1) {
      db.applications[idx] = dbApplication;
    } else {
      db.applications.push(dbApplication);
    }
    writeDB(db);
    return application;
  }
  async deleteByStudentId(studentId) {
    const db = readDB();
    db.applications = db.applications.filter((a) => a.studentId !== studentId);
    writeDB(db);
  }
};
var JSONPaymentRepository = class {
  async getAll(tenantId) {
    const db = readDB();
    const payments = tenantId ? db.payments.filter((p) => p.tenantId === tenantId) : db.payments;
    return payments;
  }
  async getById(id) {
    return readDB().payments.find((p) => p.id === id);
  }
  async save(payment) {
    const db = readDB();
    const dbPayment = payment;
    const idx = db.payments.findIndex((p) => p.id === payment.id);
    if (idx !== -1) {
      db.payments[idx] = dbPayment;
    } else {
      db.payments.push(dbPayment);
    }
    writeDB(db);
    return payment;
  }
};
var JSONMaintenanceRepository = class {
  async getAll(tenantId) {
    const db = readDB();
    const requests = tenantId ? db.maintenanceRequests.filter((m) => m.tenantId === tenantId) : db.maintenanceRequests;
    return requests;
  }
  async getById(id) {
    return readDB().maintenanceRequests.find((m) => m.id === id);
  }
  async save(request) {
    const db = readDB();
    const dbRequest = request;
    const idx = db.maintenanceRequests.findIndex((m) => m.id === request.id);
    if (idx !== -1) {
      db.maintenanceRequests[idx] = dbRequest;
    } else {
      db.maintenanceRequests.push(dbRequest);
    }
    writeDB(db);
    return request;
  }
};
var JSONAttendanceRepository = class {
  async getAll(tenantId) {
    const db = readDB();
    const logs = tenantId ? db.attendanceLogs.filter((a) => a.tenantId === tenantId) : db.attendanceLogs;
    return logs;
  }
  async save(log) {
    const db = readDB();
    db.attendanceLogs.unshift(log);
    writeDB(db);
    return log;
  }
};
var JSONAnnouncementRepository = class {
  async getAll(tenantId) {
    const db = readDB();
    const announcements = tenantId ? db.announcements.filter((a) => !a.tenantId || a.tenantId === tenantId) : db.announcements;
    return announcements;
  }
  async save(announcement) {
    const db = readDB();
    db.announcements.unshift(announcement);
    writeDB(db);
    return announcement;
  }
};
var JSONNotificationRepository = class {
  async getByUserId(userId) {
    return readDB().notifications.filter((n) => n.userId === userId);
  }
  async save(notification) {
    const db = readDB();
    db.notifications.unshift(notification);
    writeDB(db);
    return notification;
  }
  async markAllAsRead(userId) {
    const db = readDB();
    db.notifications.forEach((n) => {
      if (n.userId === userId) {
        n.isRead = true;
      }
    });
    writeDB(db);
  }
};
var JSONStudentProfileRepository = class {
  async getByStudentId(studentId) {
    return readDB().studentProfiles.find((p) => p.studentId === studentId);
  }
  async save(profile) {
    const db = readDB();
    const dbProfile = profile;
    const idx = db.studentProfiles.findIndex((p) => p.studentId === profile.studentId);
    if (idx !== -1) {
      db.studentProfiles[idx] = dbProfile;
    } else {
      db.studentProfiles.push(dbProfile);
    }
    writeDB(db);
    return profile;
  }
  async getAll() {
    return readDB().studentProfiles;
  }
};
var JSONAssignmentLogRepository = class {
  async getAll() {
    return readDB().assignmentLogs;
  }
  async save(log) {
    const db = readDB();
    db.assignmentLogs.unshift(log);
    writeDB(db);
    return log;
  }
};

// src/application/usecases/DormInteractors.ts
var import_uuid = require("uuid");
function createTimestamp() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function buildInvoiceNumber(roomNumber) {
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  return `INV-${year}-${roomNumber}-${Math.floor(Math.random() * 900 + 100)}`;
}
function calculateRoomStats(residentProfiles) {
  const totals = {
    social: 0,
    discipline: 0,
    noise: 0
  };
  const tags = /* @__PURE__ */ new Set();
  residentProfiles.forEach((profile) => {
    if (profile.vector) {
      totals.social += profile.vector.social_score;
      totals.discipline += profile.vector.discipline_score;
      totals.noise += profile.vector.noise_tolerance;
    }
    profile.tags?.forEach((tag) => tags.add(tag));
  });
  const count = residentProfiles.length || 1;
  return {
    avgSocialScore: Math.round(totals.social / count),
    avgDisciplineScore: Math.round(totals.discipline / count),
    avgNoiseLevel: Math.round(totals.noise / count),
    profileTags: Array.from(tags)
  };
}
var SubmitApplicationUseCase = class {
  constructor(userRepo2, appRepo2) {
    this.userRepo = userRepo2;
    this.appRepo = appRepo2;
  }
  async execute(studentId, tenantId, form) {
    const student = await this.userRepo.getById(studentId);
    if (!student) {
      throw new Error("\xD6\u011Frenci bulunamad\u0131");
    }
    await this.appRepo.deleteByStudentId(studentId);
    const now = createTimestamp();
    const newApp = {
      id: (0, import_uuid.v4)(),
      studentId,
      studentName: student.name,
      studentEmail: student.email,
      preferredTenantId: tenantId,
      lifestyleForm: form,
      status: "SUBMITTED" /* SUBMITTED */,
      submittedAt: now,
      createdAt: now,
      updatedAt: now,
      tags: []
    };
    return this.appRepo.save(newApp);
  }
};
var AssignRoomUseCase = class {
  constructor(appRepo2, roomRepo2, userRepo2, paymentRepo2, notifRepo2, tenantRepo2, studentProfileRepo2, assignmentLogRepo2) {
    this.appRepo = appRepo2;
    this.roomRepo = roomRepo2;
    this.userRepo = userRepo2;
    this.paymentRepo = paymentRepo2;
    this.notifRepo = notifRepo2;
    this.tenantRepo = tenantRepo2;
    this.studentProfileRepo = studentProfileRepo2;
    this.assignmentLogRepo = assignmentLogRepo2;
  }
  async execute(appId, roomId, assignedByUserId) {
    const application = await this.appRepo.getById(appId);
    if (!application) {
      throw new Error("Ba\u015Fvuru bulunamad\u0131");
    }
    const room = await this.roomRepo.getById(roomId);
    if (!room) {
      throw new Error("Oda bulunamad\u0131");
    }
    if (room.occupancy >= room.capacity) {
      throw new Error("Se\xE7ilen oda tamamen dolu");
    }
    const student = await this.userRepo.getById(application.studentId);
    if (!student) {
      throw new Error("\xD6\u011Frenci bulunamad\u0131");
    }
    student.tenantId = room.tenantId;
    student.updatedAt = createTimestamp();
    await this.userRepo.update(student);
    if (!room.residentIds.includes(application.studentId)) {
      room.residentIds.push(application.studentId);
      room.occupancy = room.residentIds.length;
    }
    const residentProfiles = (await this.studentProfileRepo.getAll()).filter(
      (profile2) => room.residentIds.includes(profile2.studentId)
    );
    if (residentProfiles.length > 0) {
      const stats = calculateRoomStats(residentProfiles);
      room.avgSocialScore = stats.avgSocialScore;
      room.avgDisciplineScore = stats.avgDisciplineScore;
      room.avgNoiseLevel = stats.avgNoiseLevel;
      room.profileTags = stats.profileTags;
    }
    room.updatedAt = createTimestamp();
    await this.roomRepo.save(room);
    const profile = {
      studentId: application.studentId,
      lifestyleAnswers: application.lifestyleForm,
      vector: application.vector || void 0,
      tags: application.tags || [],
      analyzedAt: createTimestamp(),
      updatedAt: createTimestamp()
    };
    await this.studentProfileRepo.save(profile);
    application.status = "ASSIGNED" /* ASSIGNED */;
    application.suggestedRoomId = roomId;
    application.updatedAt = createTimestamp();
    await this.appRepo.save(application);
    const tenant = await this.tenantRepo.getById(room.tenantId);
    const amount = tenant ? tenant.monthlyFee : 500;
    const payment = {
      id: (0, import_uuid.v4)(),
      studentId: application.studentId,
      studentName: application.studentName,
      tenantId: room.tenantId,
      amount,
      dueDate: new Date((/* @__PURE__ */ new Date()).getFullYear(), (/* @__PURE__ */ new Date()).getMonth() + 1, 1).toISOString().split("T")[0],
      status: "UNPAID" /* UNPAID */,
      invoiceNumber: buildInvoiceNumber(room.roomNumber),
      createdAt: createTimestamp(),
      updatedAt: createTimestamp()
    };
    await this.paymentRepo.save(payment);
    const log = {
      id: (0, import_uuid.v4)(),
      studentId: application.studentId,
      studentName: application.studentName,
      roomId: room.id,
      roomNumber: room.roomNumber,
      tenantId: room.tenantId,
      compatibilityScore: application.compatibilityLog?.compatibilityScore ?? 85,
      conflictRisk: application.compatibilityLog?.conflictRisk ?? 15,
      explanation: application.compatibilityLog?.matchingNotes ?? "Y\xF6netici taraf\u0131ndan manuel yerle\u015Fim atand\u0131.",
      isOverridden: assignedByUserId !== "AI",
      assignedBy: assignedByUserId,
      assignedAt: createTimestamp()
    };
    await this.assignmentLogRepo.save(log);
    await this.notifRepo.save({
      id: (0, import_uuid.v4)(),
      userId: application.studentId,
      title: "Oda Ataman\u0131z Ger\xE7ekle\u015Fti",
      message: `Tebrikler! ${tenant?.name || "Yurdumuzda"} ${room.roomNumber} no'lu odaya yerle\u015Ftirildiniz. Keyifli konaklamalar dileriz!`,
      isRead: false,
      createdAt: createTimestamp(),
      updatedAt: createTimestamp()
    });
    return log;
  }
};
var EvictResidentUseCase = class {
  constructor(roomRepo2, userRepo2, appRepo2, studentProfileRepo2) {
    this.roomRepo = roomRepo2;
    this.userRepo = userRepo2;
    this.appRepo = appRepo2;
    this.studentProfileRepo = studentProfileRepo2;
  }
  async execute(studentId, roomId) {
    const room = await this.roomRepo.getById(roomId);
    if (!room) {
      return;
    }
    room.residentIds = room.residentIds.filter((id) => id !== studentId);
    room.occupancy = room.residentIds.length;
    const residentProfiles = (await this.studentProfileRepo.getAll()).filter(
      (profile) => room.residentIds.includes(profile.studentId)
    );
    if (residentProfiles.length > 0) {
      const stats = calculateRoomStats(residentProfiles);
      room.avgSocialScore = stats.avgSocialScore;
      room.avgDisciplineScore = stats.avgDisciplineScore;
      room.avgNoiseLevel = stats.avgNoiseLevel;
      room.profileTags = stats.profileTags;
    } else {
      room.avgSocialScore = void 0;
      room.avgDisciplineScore = void 0;
      room.avgNoiseLevel = void 0;
      room.profileTags = [];
    }
    room.updatedAt = createTimestamp();
    await this.roomRepo.save(room);
    const student = await this.userRepo.getById(studentId);
    if (student) {
      student.tenantId = void 0;
      student.updatedAt = createTimestamp();
      await this.userRepo.update(student);
    }
    await this.appRepo.deleteByStudentId(studentId);
  }
};
var PayInvoiceUseCase = class {
  constructor(paymentRepo2, notifRepo2) {
    this.paymentRepo = paymentRepo2;
    this.notifRepo = notifRepo2;
  }
  async execute(paymentId) {
    const payment = await this.paymentRepo.getById(paymentId);
    if (!payment) {
      throw new Error("Fatura kayd\u0131 bulunamad\u0131");
    }
    payment.status = "PAID" /* PAID */;
    payment.paymentDate = createTimestamp();
    payment.transactionHash = `0x${Math.random().toString(16).substring(2, 18)}`;
    payment.updatedAt = createTimestamp();
    const savedPayment = await this.paymentRepo.save(payment);
    await this.notifRepo.save({
      id: (0, import_uuid.v4)(),
      userId: payment.studentId,
      title: "\xD6deme Onayland\u0131",
      message: `${payment.invoiceNumber} numaral\u0131 yurt faturas\u0131 \xF6demeniz (${payment.amount}) ba\u015Far\u0131yla al\u0131nm\u0131\u015Ft\u0131r. Te\u015Fekk\xFCr ederiz.`,
      isRead: false,
      createdAt: createTimestamp(),
      updatedAt: createTimestamp()
    });
    return savedPayment;
  }
};
var CreateMaintenanceUseCase = class {
  constructor(userRepo2, roomRepo2, maintRepo2) {
    this.userRepo = userRepo2;
    this.roomRepo = roomRepo2;
    this.maintRepo = maintRepo2;
  }
  async execute(studentId, title, description, category, urgency) {
    const student = await this.userRepo.getById(studentId);
    if (!student) {
      throw new Error("\xD6\u011Frenci bulunamad\u0131");
    }
    const rooms = await this.roomRepo.getAll();
    const room = rooms.find((r) => r.residentIds.includes(studentId));
    if (!room) {
      throw new Error("Bu \xF6\u011Frenciye atanm\u0131\u015F bir oda bulunamad\u0131");
    }
    const now = createTimestamp();
    const request = {
      id: (0, import_uuid.v4)(),
      studentId,
      studentName: student.name,
      roomId: room.id,
      roomNumber: room.roomNumber,
      tenantId: student.tenantId || room.tenantId,
      title,
      description,
      category,
      status: "SUBMITTED" /* SUBMITTED */,
      urgency,
      createdAt: now,
      updatedAt: now
    };
    return this.maintRepo.save(request);
  }
};

// src/gemini.ts
var import_genai = require("@google/genai");
var apiKey = process.env.GEMINI_API_KEY || "AIzaSyDF-ORdB_NoBCSFMtBT_pOhQXuWq2uE5aE";
var ai = new import_genai.GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build"
    }
  }
});
async function analyzeStudentLifestyle(answers) {
  const prompt = `Analyze this college student's lifestyle questionnaire answers to formulate a precise numerical behavioral vector (0-100 score) and characteristic tags.
Student answers:
- Sleep Schedule: ${answers.sleepSchedule}
- Cleanliness Level (1-5): ${answers.cleanlinessLevel}
- Noise Tolerance (1-5): ${answers.noiseTolerance}
- Smoking Preference: ${answers.smokingPreference}
- Social Level (1-5): ${answers.socialLevel}
- Gaming Habits: ${answers.gamingHabits}
- Study Habits: ${answers.studyHabits}
- Introvert/Extrovert scale (1=Introvert, 5=Extrovert): ${answers.introvertExtrovert}
- Conflict Tolerance (1-5): ${answers.conflictTolerance}
- Roommate Preference description: "${answers.preferredRoommateType}"

Calculate scores for:
1. social_score: how interactive they are.
2. discipline_score: focus on rules, sleep structure, and studies.
3. cleanliness_score: converted cleanliness level from 1-5 scalar to 0-100.
4. noise_tolerance: noise tolerance mapped up to 100 max.
5. night_activity_score: how active they are during typical sleep hours based on gaming, bedtime owl schedules, block study modes.

Generate 3-4 characteristics tags (all lowercase, hyphenated e.g. "night-owl", "studious", "quiet-resident").`;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a professional industrial psychologist and housing compliance analyzer at a multi-dorm university residence SaaS. Provide precise numerical profiles.",
        responseMimeType: "application/json",
        responseSchema: {
          type: import_genai.Type.OBJECT,
          required: ["personality_vector", "tags"],
          properties: {
            personality_vector: {
              type: import_genai.Type.OBJECT,
              required: ["social_score", "discipline_score", "cleanliness_score", "noise_tolerance", "night_activity_score"],
              properties: {
                social_score: { type: import_genai.Type.INTEGER, description: "A score from 0 to 100 for student social behavior." },
                discipline_score: { type: import_genai.Type.INTEGER, description: "A score from 0 to 100 for student study and rules discipline." },
                cleanliness_score: { type: import_genai.Type.INTEGER, description: "A score from 0 to 100 for student cleanliness." },
                noise_tolerance: { type: import_genai.Type.INTEGER, description: "A score from 0 to 100 for student noise tolerance." },
                night_activity_score: { type: import_genai.Type.INTEGER, description: "A score from 0 to 100 for late night activity." }
              }
            },
            tags: {
              type: import_genai.Type.ARRAY,
              items: { type: import_genai.Type.STRING },
              description: "3 to 4 characteristic tags describing the student lifestyle profile."
            }
          }
        }
      }
    });
    const text = response.text || "";
    return JSON.parse(text);
  } catch (err) {
    console.error("Gemini lifestyle analysis failed. Using math fallback:", err);
    const cleanliness_score = Math.min(Math.max(answers.cleanlinessLevel * 20, 0), 100);
    const noise_tolerance = Math.min(Math.max(answers.noiseTolerance * 20, 0), 100);
    const social_score = Math.min(Math.max(answers.socialLevel * 20, 0), 100);
    const night_activity_score = answers.sleepSchedule === "night-owl" ? 85 : answers.sleepSchedule === "early-bird" ? 20 : 50;
    const discipline_score = answers.studyHabits === "solo-quiet" ? 80 : 50;
    const tags = [
      answers.sleepSchedule,
      answers.gamingHabits === "frequent" ? "gamer" : "casual-user",
      answers.cleanlinessLevel >= 4 ? "tidiness-oriented" : "relaxed-profile"
    ];
    return {
      personality_vector: {
        social_score,
        discipline_score,
        cleanliness_score,
        noise_tolerance,
        night_activity_score
      },
      tags
    };
  }
}
async function explainRoomCompatibility(applicant, room, residents) {
  const residentTexts = residents.map((r, i) => {
    return `Resident ${i + 1} lifestyle answers: ${JSON.stringify(r.lifestyleAnswers)}, tags: ${JSON.stringify(r.tags)}`;
  }).join("\n");
  const prompt = `Assess the roommate compatibility and potential conflicts between an applicant and existing residents of room ${room.roomNumber} (Capacity: ${room.capacity}).
Applicant Name: ${applicant.name}
Applicant lifestyle Answers: ${JSON.stringify(applicant.answers)}

Existing Residents in Room (${room.occupancy}/${room.capacity}):
${residents.length === 0 ? "This room is currently empty. Compare applicant expectations to general dorm structures." : residentTexts}

Analyze conflicts on:
1. Sleep schedule overlap (e.g. night-owl vs early-bird conflicts).
2. Cleanliness friction (tidy vs messy).
3. Socializing/noise vs peace expectations.
4. Smoking mismatch (this is a CRITICAL conflict; smoker and non-smoker should trigger heavily lower score and high risk).

Output a numeric compatibility score (0 to 100), a conflict risk percentage (0 to 100), and a concise, explainable matching review notes statement.`;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert student housing allocation advisor. Provide structured, fair, and high-quality reviews.",
        responseMimeType: "application/json",
        responseSchema: {
          type: import_genai.Type.OBJECT,
          required: ["compatibilityScore", "conflictRisk", "matchingNotes"],
          properties: {
            compatibilityScore: { type: import_genai.Type.INTEGER, description: "A calculated score from 0 (terrible) to 100 (excellent)." },
            conflictRisk: { type: import_genai.Type.INTEGER, description: "Estimated conflict friction probability from 0% to 100%." },
            matchingNotes: { type: import_genai.Type.STRING, description: "A detailed explanation of why they fit, highlight issues (e.g. sleep/noise) if any." }
          }
        }
      }
    });
    const text = response.text || "";
    return JSON.parse(text);
  } catch (err) {
    console.error("Gemini room compatibility calculation failed, backing up to rule-based analysis:", err);
    if (residents.length === 0) {
      return {
        compatibilityScore: 90,
        conflictRisk: 5,
        matchingNotes: "Allocated to empty room. Applicant expectations match general building rules perfectly."
      };
    }
    let totalScore = 0;
    let totalRisk = 0;
    for (const resident of residents) {
      let score = 100;
      let risk = 0;
      if (applicant.answers.sleepSchedule !== resident.lifestyleAnswers.sleepSchedule) {
        if (applicant.answers.sleepSchedule === "early-bird" && resident.lifestyleAnswers.sleepSchedule === "night-owl" || applicant.answers.sleepSchedule === "night-owl" && resident.lifestyleAnswers.sleepSchedule === "early-bird") {
          score -= 25;
          risk += 35;
        } else {
          score -= 10;
          risk += 15;
        }
      }
      const cleanDiff = Math.abs(applicant.answers.cleanlinessLevel - resident.lifestyleAnswers.cleanlinessLevel);
      score -= cleanDiff * 8;
      risk += cleanDiff * 12;
      if (applicant.answers.smokingPreference === "smoker" && resident.lifestyleAnswers.smokingPreference === "non-smoker" || applicant.answers.smokingPreference === "non-smoker" && resident.lifestyleAnswers.smokingPreference === "smoker") {
        score -= 40;
        risk += 60;
      }
      const socialDiff = Math.abs(applicant.answers.socialLevel - resident.lifestyleAnswers.socialLevel);
      score -= socialDiff * 5;
      risk += socialDiff * 8;
      totalScore += score;
      totalRisk += risk;
    }
    const avgScore = Math.max(0, Math.min(Math.round(totalScore / residents.length), 100));
    const avgRisk = Math.max(0, Math.min(Math.round(totalRisk / residents.length), 100));
    return {
      compatibilityScore: avgScore,
      conflictRisk: avgRisk,
      matchingNotes: `Evaluated programmatically with a score of ${avgScore}% compatibility and ${avgRisk}% conflict risk estimation based on lifestyle differentials.`
    };
  }
}

// server.ts
var import_https = __toESM(require("https"), 1);
var app = (0, import_express.default)();
app.use(import_express.default.json());
var userRepo = new JSONUserRepository();
var tenantRepo = new JSONTenantRepository();
var roomRepo = new JSONRoomRepository();
var appRepo = new JSONApplicationRepository();
var paymentRepo = new JSONPaymentRepository();
var maintRepo = new JSONMaintenanceRepository();
var attendanceRepo = new JSONAttendanceRepository();
var announcementRepo = new JSONAnnouncementRepository();
var notifRepo = new JSONNotificationRepository();
var studentProfileRepo = new JSONStudentProfileRepository();
var assignmentLogRepo = new JSONAssignmentLogRepository();
var submitAppUseCase = new SubmitApplicationUseCase(userRepo, appRepo);
var assignRoomUseCase = new AssignRoomUseCase(
  appRepo,
  roomRepo,
  userRepo,
  paymentRepo,
  notifRepo,
  tenantRepo,
  studentProfileRepo,
  assignmentLogRepo
);
var evictUseCase = new EvictResidentUseCase(roomRepo, userRepo, appRepo, studentProfileRepo);
var payInvoiceUseCase = new PayInvoiceUseCase(paymentRepo, notifRepo);
var createMaintUseCase = new CreateMaintenanceUseCase(userRepo, roomRepo, maintRepo);
async function createInAppNotification(userId, title, message) {
  const newNotif = {
    id: "notif-" + Math.random().toString(36).substring(2, 11),
    userId,
    title,
    message,
    isRead: false,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  return notifRepo.save(newNotif);
}
app.get("/api/state", async (req, res) => {
  try {
    return res.json({
      users: await userRepo.getAll(),
      tenants: await tenantRepo.getAll(),
      rooms: await roomRepo.getAll(),
      applications: await appRepo.getAll(),
      payments: await paymentRepo.getAll(),
      maintenance: await maintRepo.getAll(),
      attendance: await attendanceRepo.getAll(),
      announcements: await announcementRepo.getAll()
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "E-posta adresi gereklidir" });
    }
    const foundUser = await userRepo.getByEmail(email);
    if (!foundUser) {
      const newStudent = {
        id: "user-" + Math.random().toString(36).substring(2, 11),
        email: email.toLowerCase().trim(),
        name: email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        role: "STUDENT" /* STUDENT */,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      await userRepo.create(newStudent);
      return res.json({ user: newStudent, message: "Sisteme \xD6\u011Frenci olarak otomatik kayd\u0131n\u0131z yap\u0131ld\u0131!" });
    }
    return res.json({ user: foundUser });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
app.post("/api/auth/register-custom", async (req, res) => {
  try {
    const { email, name, role, tenantId } = req.body;
    if (!email || !name || !role) {
      return res.status(400).json({ error: "E-posta, ad soyad ve rol gereklidir." });
    }
    const newUser = {
      id: "user-" + Math.random().toString(36).substring(2, 11),
      email: email.toLowerCase().trim(),
      name,
      role,
      tenantId: tenantId || void 0,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    await userRepo.create(newUser);
    return res.json({ user: newUser });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
app.get("/api/tenants", async (req, res) => {
  return res.json(await tenantRepo.getAll());
});
app.get("/api/rooms", async (req, res) => {
  const { tenantId } = req.query;
  return res.json(await roomRepo.getAll(tenantId));
});
app.get("/api/applications", async (req, res) => {
  const { tenantId } = req.query;
  return res.json(await appRepo.getAll(tenantId));
});
app.post("/api/applications/submit", async (req, res) => {
  try {
    const { studentId, preferredTenantId, lifestyleForm } = req.body;
    if (!studentId || !preferredTenantId || !lifestyleForm) {
      return res.status(400).json({ error: "Eksik parametreler" });
    }
    const appRecord = await submitAppUseCase.execute(studentId, preferredTenantId, lifestyleForm);
    return res.json(appRecord);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
app.post("/api/applications/:id/analyze", async (req, res) => {
  try {
    const appId = req.params.id;
    const { tenantId } = req.body;
    const application = await appRepo.getById(appId);
    if (!application) {
      return res.status(404).json({ error: "Ba\u015Fvuru kayd\u0131 bulunamad\u0131" });
    }
    const analysis = await analyzeStudentLifestyle(application.lifestyleForm);
    const targetTenant = tenantId || application.preferredTenantId;
    const candidateRooms = (await roomRepo.getAll(targetTenant)).filter((r) => r.occupancy < r.capacity);
    let ultimateMatch = null;
    if (candidateRooms.length > 0) {
      let absoluteBestScore = -1;
      const storedProfiles = await studentProfileRepo.getAll();
      for (const room of candidateRooms) {
        const residents = storedProfiles.filter((profile) => room.residentIds.includes(profile.studentId));
        const evaluation = await explainRoomCompatibility(
          {
            name: application.studentName,
            answers: application.lifestyleForm,
            vector: analysis.personality_vector
          },
          room,
          residents
        );
        if (evaluation.compatibilityScore > absoluteBestScore) {
          absoluteBestScore = evaluation.compatibilityScore;
          ultimateMatch = {
            roomId: room.id,
            roomNumber: room.roomNumber,
            compatibilityScore: evaluation.compatibilityScore,
            conflictRisk: evaluation.conflictRisk,
            matchingNotes: evaluation.matchingNotes,
            vector: analysis.personality_vector,
            tags: analysis.tags
          };
        }
      }
    }
    if (!ultimateMatch && candidateRooms.length > 0) {
      const defaultRoom = candidateRooms[0];
      ultimateMatch = {
        roomId: defaultRoom.id,
        roomNumber: defaultRoom.roomNumber,
        compatibilityScore: 85,
        conflictRisk: 10,
        matchingNotes: "\xD6n tan\u0131ml\u0131 odaya e\u015Fle\u015Fme parametrelerine uygun \u015Fekilde yerle\u015Fim yap\u0131ld\u0131.",
        vector: analysis.personality_vector,
        tags: analysis.tags
      };
    } else if (!ultimateMatch) {
      ultimateMatch = {
        roomId: "",
        roomNumber: "UYGUN ODA YOK",
        compatibilityScore: 0,
        conflictRisk: 100,
        matchingNotes: "Yurtta tamamen doluluk var! Uygun yer bulunamad\u0131. Y\xF6netici m\xFCdahalesi gereklidir.",
        vector: analysis.personality_vector,
        tags: analysis.tags
      };
    }
    application.status = "AI_MATCHED" /* AI_MATCHED */;
    application.suggestedRoomId = ultimateMatch.roomId;
    application.compatibilityLog = {
      compatibilityScore: ultimateMatch.compatibilityScore,
      conflictRisk: ultimateMatch.conflictRisk,
      matchingNotes: ultimateMatch.matchingNotes
    };
    if (ultimateMatch.vector) {
      application.vector = ultimateMatch.vector;
    }
    if (ultimateMatch.tags) {
      application.tags = ultimateMatch.tags;
    }
    await appRepo.save(application);
    return res.json(application);
  } catch (err) {
    console.error("AI Allocation error: ", err);
    return res.status(500).json({ error: err.message });
  }
});
app.post("/api/applications/:id/assign", async (req, res) => {
  try {
    const appId = req.params.id;
    const { roomId, assignedBy } = req.body;
    if (!roomId) {
      return res.status(400).json({ error: "roomId gereklidir" });
    }
    const log = await assignRoomUseCase.execute(appId, roomId, assignedBy || "DORM_ADMIN");
    return res.json({ success: true, log });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
app.post("/api/rooms/:roomId/evict", async (req, res) => {
  try {
    const { roomId } = req.params;
    const { studentId } = req.body;
    if (!studentId) {
      return res.status(400).json({ error: "studentId bo\u015F olamaz" });
    }
    await evictUseCase.execute(studentId, roomId);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
app.get("/api/payments", async (req, res) => {
  const { tenantId, studentId } = req.query;
  let list = await paymentRepo.getAll(tenantId);
  if (studentId) {
    list = list.filter((p) => p.studentId === studentId);
  }
  res.json(list);
});
app.post("/api/payments/:id/pay", async (req, res) => {
  try {
    const payId = req.params.id;
    const updated = await payInvoiceUseCase.execute(payId);
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
app.get("/api/maintenance", async (req, res) => {
  const { tenantId, studentId } = req.query;
  let list = await maintRepo.getAll(tenantId);
  if (studentId) {
    list = list.filter((m) => m.studentId === studentId);
  }
  res.json(list);
});
app.post("/api/maintenance/create", async (req, res) => {
  try {
    const { studentId, title, description, category, urgency } = req.body;
    if (!studentId || !title || !description || !category || !urgency) {
      return res.status(400).json({ error: "Eksik parametreler girdiniz." });
    }
    const newReq = await createMaintUseCase.execute(studentId, title, description, category, urgency);
    return res.json(newReq);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
app.post("/api/maintenance/:id/update", async (req, res) => {
  try {
    const reqId = req.params.id;
    const { status, staffUpdate } = req.body;
    const reqInstance = await maintRepo.getById(reqId);
    if (!reqInstance) throw new Error("Ar\u0131za kayd\u0131 bulunamad\u0131");
    reqInstance.status = status;
    if (staffUpdate) {
      reqInstance.staffUpdate = staffUpdate;
    }
    reqInstance.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    await maintRepo.save(reqInstance);
    await createInAppNotification(
      reqInstance.studentId,
      `Talebiniz G\xFCncellendi: ${reqInstance.title}`,
      `Ar\u0131za talebinizin son durumu: ${status}. G\xF6revli notu: ${staffUpdate || "Yok"}`
    );
    return res.json(reqInstance);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
app.get("/api/attendance", async (req, res) => {
  const { tenantId, studentId } = req.query;
  let list = await attendanceRepo.getAll(tenantId);
  if (studentId) {
    list = list.filter((l) => l.studentId === studentId);
  }
  res.json(list);
});
app.post("/api/attendance/log", async (req, res) => {
  try {
    const { studentId, direction, loggedBy } = req.body;
    if (!studentId || !direction) {
      return res.status(400).json({ error: "Eksik parametre girdiniz." });
    }
    const student = await userRepo.getById(studentId);
    if (!student) throw new Error("\xD6\u011Frenci bulunamad\u0131");
    const db = readDB();
    const room = db.rooms.find((r) => r.residentIds.includes(studentId));
    const roomNo = room ? room.roomNumber : "YOK";
    const newLog = {
      id: "att-" + Math.random().toString(36).substring(2, 11),
      studentId,
      studentName: student.name,
      tenantId: student.tenantId || "YOK",
      roomNumber: roomNo,
      direction,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      loggedBy: loggedBy || "QR RFID Taray\u0131c\u0131 Terminal",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    await attendanceRepo.save(newLog);
    return res.json(newLog);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
app.get("/api/announcements", async (req, res) => {
  const { tenantId } = req.query;
  return res.json(await announcementRepo.getAll(tenantId));
});
app.post("/api/announcements/create", async (req, res) => {
  try {
    const { tenantId, title, content, priority, targetRole } = req.body;
    if (!title || !content || !priority) {
      return res.status(400).json({ error: "Eksik duyuru detaylar\u0131." });
    }
    const newAnn = {
      id: "ann-" + Math.random().toString(36).substring(2, 11),
      tenantId: tenantId || void 0,
      title,
      content,
      priority,
      targetRole: targetRole || void 0,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    await announcementRepo.save(newAnn);
    return res.json(newAnn);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
app.get("/api/notifications/:userId", async (req, res) => {
  return res.json(await notifRepo.getByUserId(req.params.userId));
});
app.post("/api/notifications/:userId/mark-read", async (req, res) => {
  try {
    await notifRepo.markAllAsRead(req.params.userId);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
app.get("/api/dashboard/stats", async (req, res) => {
  try {
    const { tenantId } = req.query;
    const db = readDB();
    let targetRooms = await roomRepo.getAll();
    let targetPayments = await paymentRepo.getAll();
    let targetMaint = await maintRepo.getAll();
    let targetApps = await appRepo.getAll();
    if (tenantId) {
      targetRooms = await roomRepo.getAll(tenantId);
      targetPayments = await paymentRepo.getAll(tenantId);
      targetMaint = await maintRepo.getAll(tenantId);
      targetApps = await appRepo.getAll(tenantId);
    }
    const totalBeds = targetRooms.reduce((sum, r) => sum + r.capacity, 0);
    const occupiedBeds = targetRooms.reduce((sum, r) => sum + r.occupancy, 0);
    const availableBeds = totalBeds - occupiedBeds;
    const occupancyRate = totalBeds > 0 ? Math.round(occupiedBeds / totalBeds * 100) : 0;
    const unpaidPayments = targetPayments.filter((p) => p.status === "UNPAID" || p.status === "OVERDUE");
    const unpaidDebtSum = unpaidPayments.reduce((sum, p) => sum + p.amount, 0);
    const activeMaint = targetMaint.filter((m) => m.status !== "COMPLETED").length;
    const submittedAppsCount = targetApps.filter((a) => a.status === "SUBMITTED" /* SUBMITTED */).length;
    const matchedAppsCount = targetApps.filter((a) => a.status === "AI_MATCHED" /* AI_MATCHED */).length;
    const assignedAppsCount = targetApps.filter((a) => a.status === "ASSIGNED" /* ASSIGNED */).length;
    let targetLogs = db.assignmentLogs;
    if (tenantId) {
      targetLogs = db.assignmentLogs.filter((l) => l.tenantId === tenantId);
    }
    const avgScore = targetLogs.length > 0 ? Math.round(targetLogs.reduce((sum, l) => sum + l.compatibilityScore, 0) / targetLogs.length) : 88;
    return res.json({
      dormName: tenantId ? (await tenantRepo.getById(tenantId))?.name || "Yurt" : "T\xFCm Yurtlar",
      occupancyRate,
      totalBeds,
      occupiedBeds,
      availableBeds,
      unpaidDebtSum,
      unpaidCount: unpaidPayments.length,
      activeMaintenanceRequests: activeMaint,
      appStats: {
        submitted: submittedAppsCount,
        matched: matchedAppsCount,
        assigned: assignedAppsCount,
        total: targetApps.length
      },
      aiAssignmentSuccessScore: avgScore
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
var startServer = async () => {
  const isProduction = process.env.NODE_ENV === "production" || import_fs2.default.existsSync(import_path2.default.join(process.cwd(), "dist"));
  if (!isProduction) {
    console.log("Starting backend with active Vite-development middleware...");
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path2.default.join(process.cwd(), "dist");
    console.log("\u{1F4C2} Sunucu statik dosyalar\u0131 \u015Furada ar\u0131yor:", distPath);
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      if (req.originalUrl.includes(".")) {
        console.error(`\u{1F6A8} HATA: Taray\u0131c\u0131 "${req.originalUrl}" dosyas\u0131n\u0131 istedi ama ${distPath} i\xE7inde bulunamad\u0131!`);
        return res.status(404).send("Dosya bulunamad\u0131");
      }
      return res.sendFile(import_path2.default.join(distPath, "index.html"));
    });
  }
  const sslOptions = {
    // En dış klasördeki dümdüz 'key.pem' ve 'cert.pem' dosyalarına bak diyoruz
    key: import_fs2.default.readFileSync(import_path2.default.resolve(process.cwd(), "key.pem")),
    cert: import_fs2.default.readFileSync(import_path2.default.resolve(process.cwd(), "cert.pem"))
  };
  import_https.default.createServer(sslOptions, app).listen(3e3, () => {
    console.log("\u{1F680} G\xFCvenli HTTPS Sunucusu Port: 3000 \xFCzerinde dinliyor");
  });
};
startServer().catch((err) => {
  console.error("Express failed to spin up gracefully:", err);
});
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
//# sourceMappingURL=server.cjs.map
