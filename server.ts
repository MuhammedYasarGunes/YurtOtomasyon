import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Clean Architecture Domain & Infrastructure layers
import {
  JSONUserRepository,
  JSONTenantRepository,
  JSONRoomRepository,
  JSONApplicationRepository,
  JSONPaymentRepository,
  JSONMaintenanceRepository,
  JSONAttendanceRepository,
  JSONAnnouncementRepository,
  JSONNotificationRepository,
  JSONStudentProfileRepository,
  JSONAssignmentLogRepository
} from "./src/infrastructure/repositories/JSONRepositories.js";

// Clean Architecture Application Usecases/Interactors
import {
  SubmitApplicationUseCase,
  AssignRoomUseCase,
  EvictResidentUseCase,
  PayInvoiceUseCase,
  CreateMaintenanceUseCase
} from "./src/application/usecases/DormInteractors.js";

import { analyzeStudentLifestyle, explainRoomCompatibility } from "./src/gemini.js";
import { ApplicationStatus, UserRole, Notification, EntryExitLog, Announcement } from "./src/domain/types.js";
import { readDB, writeDB } from "./src/db.js";
import https from 'https'; // Bunu ekleyin

const app = express();

app.use(express.json());

const PORT = 3000;

// Dependency Injection Setup
const userRepo = new JSONUserRepository();
const tenantRepo = new JSONTenantRepository();
const roomRepo = new JSONRoomRepository();
const appRepo = new JSONApplicationRepository();
const paymentRepo = new JSONPaymentRepository();
const maintRepo = new JSONMaintenanceRepository();
const attendanceRepo = new JSONAttendanceRepository();
const announcementRepo = new JSONAnnouncementRepository();
const notifRepo = new JSONNotificationRepository();
const studentProfileRepo = new JSONStudentProfileRepository();
const assignmentLogRepo = new JSONAssignmentLogRepository();

const submitAppUseCase = new SubmitApplicationUseCase(userRepo, appRepo);
const assignRoomUseCase = new AssignRoomUseCase(
  appRepo,
  roomRepo,
  userRepo,
  paymentRepo,
  notifRepo,
  tenantRepo,
  studentProfileRepo,
  assignmentLogRepo
);
const evictUseCase = new EvictResidentUseCase(roomRepo, userRepo, appRepo, studentProfileRepo);
const payInvoiceUseCase = new PayInvoiceUseCase(paymentRepo, notifRepo);
const createMaintUseCase = new CreateMaintenanceUseCase(userRepo, roomRepo, maintRepo);

// Helper to quickly dispatch dynamic notifications via clean architecture repo
async function createInAppNotification(userId: string, title: string, message: string) {
  const newNotif: Notification = {
    id: "notif-" + Math.random().toString(36).substring(2, 11),
    userId,
    title,
    message,
    isRead: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  return notifRepo.save(newNotif);
}

// --- API Endpoints mapping onto Clean Architecture ---

// Retrieve the active database schema
app.get("/api/state", async (req: Request, res: Response) => {
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
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Authentication Simulator (RBAC) with clean repositories
app.post("/api/auth/login", async (req: Request, res: Response) => {
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
        name: email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
        role: UserRole.STUDENT,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await userRepo.create(newStudent);
      return res.json({ user: newStudent, message: "Sisteme Öğrenci olarak otomatik kaydınız yapıldı!" });
    }

    return res.json({ user: foundUser });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Custom user registrations
app.post("/api/auth/register-custom", async (req: Request, res: Response) => {
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
      tenantId: tenantId || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await userRepo.create(newUser);
    return res.json({ user: newUser });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Tenants API
app.get("/api/tenants", async (req: Request, res: Response) => {
  return res.json(await tenantRepo.getAll());
});

// Rooms Management
app.get("/api/rooms", async (req: Request, res: Response) => {
  const { tenantId } = req.query;
  return res.json(await roomRepo.getAll(tenantId as string));
});

// Applications Retrieval
app.get("/api/applications", async (req: Request, res: Response) => {
  const { tenantId } = req.query;
  return res.json(await appRepo.getAll(tenantId as string));
});

// Apply to a Dorm via clean interactor
app.post("/api/applications/submit", async (req: Request, res: Response) => {
  try {
    const { studentId, preferredTenantId, lifestyleForm } = req.body;
    if (!studentId || !preferredTenantId || !lifestyleForm) {
      return res.status(400).json({ error: "Eksik parametreler" });
    }

    const appRecord = await submitAppUseCase.execute(studentId, preferredTenantId, lifestyleForm);
    return res.json(appRecord);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Gemini AI Matching Analysis Trigger with clean decoupled DB interactions
app.post("/api/applications/:id/analyze", async (req: Request, res: Response) => {
  try {
    const appId = req.params.id;
    const { tenantId } = req.body;

    const application = await appRepo.getById(appId);
    if (!application) {
      return res.status(404).json({ error: "Başvuru kaydı bulunamadı" });
    }

    const analysis = await analyzeStudentLifestyle(application.lifestyleForm);
    const targetTenant = tenantId || application.preferredTenantId;
    const candidateRooms = (await roomRepo.getAll(targetTenant)).filter((r) => r.occupancy < r.capacity);

    let ultimateMatch: any = null;

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
        matchingNotes: "Ön tanımlı odaya eşleşme parametrelerine uygun şekilde yerleşim yapıldı.",
        vector: analysis.personality_vector,
        tags: analysis.tags
      };
    } else if (!ultimateMatch) {
      ultimateMatch = {
        roomId: "",
        roomNumber: "UYGUN ODA YOK",
        compatibilityScore: 0,
        conflictRisk: 100,
        matchingNotes: "Yurtta tamamen doluluk var! Uygun yer bulunamadı. Yönetici müdahalesi gereklidir.",
        vector: analysis.personality_vector,
        tags: analysis.tags
      };
    }

    application.status = ApplicationStatus.AI_MATCHED;
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
  } catch (err: any) {
    console.error("AI Allocation error: ", err);
    return res.status(500).json({ error: err.message });
  }
});

// Finalize Room Assignment
app.post("/api/applications/:id/assign", async (req: Request, res: Response) => {
  try {
    const appId = req.params.id;
    const { roomId, assignedBy } = req.body;
    if (!roomId) {
      return res.status(400).json({ error: "roomId gereklidir" });
    }

    const log = await assignRoomUseCase.execute(appId, roomId, assignedBy || "DORM_ADMIN");
    return res.json({ success: true, log });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Evict Student Resident
app.post("/api/rooms/:roomId/evict", async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    const { studentId } = req.body;
    if (!studentId) {
      return res.status(400).json({ error: "studentId boş olamaz" });
    }

    await evictUseCase.execute(studentId, roomId);
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Payments API
app.get("/api/payments", async (req: Request, res: Response) => {
  const { tenantId, studentId } = req.query;
  let list = await paymentRepo.getAll(tenantId as string);
  if (studentId) {
    list = list.filter((p) => p.studentId === studentId);
  }
  res.json(list);
});

app.post("/api/payments/:id/pay", async (req: Request, res: Response) => {
  try {
    const payId = req.params.id;
    const updated = await payInvoiceUseCase.execute(payId);
    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Maintenance Tickets
app.get("/api/maintenance", async (req: Request, res: Response) => {
  const { tenantId, studentId } = req.query;
  let list = await maintRepo.getAll(tenantId as string);
  if (studentId) {
    list = list.filter((m) => m.studentId === studentId);
  }
  res.json(list);
});

app.post("/api/maintenance/create", async (req: Request, res: Response) => {
  try {
    const { studentId, title, description, category, urgency } = req.body;
    if (!studentId || !title || !description || !category || !urgency) {
      return res.status(400).json({ error: "Eksik parametreler girdiniz." });
    }

    const newReq = await createMaintUseCase.execute(studentId, title, description, category, urgency);
    return res.json(newReq);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.post("/api/maintenance/:id/update", async (req: Request, res: Response) => {
  try {
    const reqId = req.params.id;
    const { status, staffUpdate } = req.body;
    const reqInstance = await maintRepo.getById(reqId);
    if (!reqInstance) throw new Error("Arıza kaydı bulunamadı");

    reqInstance.status = status;
    if (staffUpdate) {
      reqInstance.staffUpdate = staffUpdate;
    }
    reqInstance.updatedAt = new Date().toISOString();
    await maintRepo.save(reqInstance);

    await createInAppNotification(
      reqInstance.studentId,
      `Talebiniz Güncellendi: ${reqInstance.title}`,
      `Arıza talebinizin son durumu: ${status}. Görevli notu: ${staffUpdate || "Yok"}`
    );

    return res.json(reqInstance);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Entry/Exit Logs
app.get("/api/attendance", async (req: Request, res: Response) => {
  const { tenantId, studentId } = req.query;
  let list = await attendanceRepo.getAll(tenantId as string);
  if (studentId) {
    list = list.filter((l) => l.studentId === studentId);
  }
  res.json(list);
});

app.post("/api/attendance/log", async (req: Request, res: Response) => {
  try {
    const { studentId, direction, loggedBy } = req.body;
    if (!studentId || !direction) {
      return res.status(400).json({ error: "Eksik parametre girdiniz." });
    }

    const student = await userRepo.getById(studentId);
    if (!student) throw new Error("Öğrenci bulunamadı");

    const db = readDB();
    const room = db.rooms.find((r) => r.residentIds.includes(studentId));
    const roomNo = room ? room.roomNumber : "YOK";

    const newLog: EntryExitLog = {
      id: "att-" + Math.random().toString(36).substring(2, 11),
      studentId,
      studentName: student.name,
      tenantId: student.tenantId || "YOK",
      roomNumber: roomNo,
      direction,
      timestamp: new Date().toISOString(),
      loggedBy: loggedBy || "QR RFID Tarayıcı Terminal",
      createdAt: new Date().toISOString()
    };

    await attendanceRepo.save(newLog);
    return res.json(newLog);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Announcements
app.get("/api/announcements", async (req: Request, res: Response) => {
  const { tenantId } = req.query;
  return res.json(await announcementRepo.getAll(tenantId as string));
});

app.post("/api/announcements/create", async (req: Request, res: Response) => {
  try {
    const { tenantId, title, content, priority, targetRole } = req.body;
    if (!title || !content || !priority) {
      return res.status(400).json({ error: "Eksik duyuru detayları." });
    }

    const newAnn: Announcement = {
      id: "ann-" + Math.random().toString(36).substring(2, 11),
      tenantId: tenantId || undefined,
      title,
      content,
      priority,
      targetRole: targetRole || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await announcementRepo.save(newAnn);
    return res.json(newAnn);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Notifications
app.get("/api/notifications/:userId", async (req: Request, res: Response) => {
  return res.json(await notifRepo.getByUserId(req.params.userId));
});

app.post("/api/notifications/:userId/mark-read", async (req: Request, res: Response) => {
  try {
    await notifRepo.markAllAsRead(req.params.userId);
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Dashboard Analytics Aggregator in Repo Patterns
app.get("/api/dashboard/stats", async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.query;
    const db = readDB();

    let targetRooms = await roomRepo.getAll();
    let targetPayments = await paymentRepo.getAll();
    let targetMaint = await maintRepo.getAll();
    let targetApps = await appRepo.getAll();

    if (tenantId) {
      targetRooms = await roomRepo.getAll(tenantId as string);
      targetPayments = await paymentRepo.getAll(tenantId as string);
      targetMaint = await maintRepo.getAll(tenantId as string);
      targetApps = await appRepo.getAll(tenantId as string);
    }

    const totalBeds = targetRooms.reduce((sum, r) => sum + r.capacity, 0);
    const occupiedBeds = targetRooms.reduce((sum, r) => sum + r.occupancy, 0);
    const availableBeds = totalBeds - occupiedBeds;
    const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

    const unpaidPayments = targetPayments.filter((p) => p.status === "UNPAID" || p.status === "OVERDUE");
    const unpaidDebtSum = unpaidPayments.reduce((sum, p) => sum + p.amount, 0);

    const activeMaint = targetMaint.filter((m) => m.status !== "COMPLETED").length;

    const submittedAppsCount = targetApps.filter((a) => a.status === ApplicationStatus.SUBMITTED).length;
    const matchedAppsCount = targetApps.filter((a) => a.status === ApplicationStatus.AI_MATCHED).length;
    const assignedAppsCount = targetApps.filter((a) => a.status === ApplicationStatus.ASSIGNED).length;

    let targetLogs = db.assignmentLogs;
    if (tenantId) {
      targetLogs = db.assignmentLogs.filter((l: any) => l.tenantId === tenantId);
    }
    const avgScore = targetLogs.length > 0
      ? Math.round(targetLogs.reduce((sum, l) => sum + l.compatibilityScore, 0) / targetLogs.length)
      : 88;

    return res.json({
      dormName: tenantId ? ((await tenantRepo.getById(tenantId as string))?.name || "Yurt") : "Tüm Yurtlar",
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
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Configure client-side SPA bundle hosting (Vite programmatic integration)
const startServer = async () => {
  const isProduction = process.env.NODE_ENV === "production" || fs.existsSync(path.join(process.cwd(), "dist"));

  if (!isProduction) {
    console.log("Starting backend with active Vite-development middleware...");
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
    } else {
    // 1. Sunucunun tam olarak hangi klasöre baktığını konsola yazdıralım
    const distPath = path.join(process.cwd(), "dist");
    console.log("📂 Sunucu statik dosyaları şurada arıyor:", distPath);

    app.use(express.static(distPath));

    app.get("*", (req, res) => {
      // 2. EĞER tarayıcı bir dosya (.js, .css, .png vb.) istiyor ve buraya düşüyorsa
      // demek ki express.static dosyayı bulamamış! HTML göndermeyi DURDUR.
      if (req.originalUrl.includes('.')) {
        console.error(`🚨 HATA: Tarayıcı "${req.originalUrl}" dosyasını istedi ama ${distPath} içinde bulunamadı!`);
        return res.status(404).send('Dosya bulunamadı');
      }
      
      // 3. Sadece normal sayfa geçişleri için HTML gönder
      return res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const sslOptions = {
  // En dış klasördeki dümdüz 'key.pem' ve 'cert.pem' dosyalarına bak diyoruz
  key: fs.readFileSync(path.resolve(process.cwd(), 'key.pem')),
  cert: fs.readFileSync(path.resolve(process.cwd(), 'cert.pem'))
};

https.createServer(sslOptions, app).listen(3000, () => {
  console.log('🚀 Güvenli HTTPS Sunucusu Port: 3000 üzerinde dinliyor');
});
};

startServer().catch((err) => {
  console.error("Express failed to spin up gracefully:", err);
});
