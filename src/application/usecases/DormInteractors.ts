import {
  IUserRepository,
  ITenantRepository,
  IRoomRepository,
  IApplicationRepository,
  IPaymentRepository,
  IMaintenanceRepository,
  IAttendanceRepository,
  IAnnouncementRepository,
  INotificationRepository
} from "../../domain/repositories/interfaces.js";
import {
  User,
  Room,
  Application,
  Payment,
  MaintenanceRequest,
  EntryExitLog,
  Announcement,
  Notification,
  LifestyleForm,
  ApplicationStatus,
  StudentProfile,
  AssignmentLog
} from "../../types.js";
import { readDB, writeDB } from "../../db.js";

export class SubmitApplicationUseCase {
  constructor(
    private userRepo: IUserRepository,
    private appRepo: IApplicationRepository
  ) {}

  execute(studentId: string, tenantId: string, form: LifestyleForm): Application {
    const student = this.userRepo.getById(studentId);
    if (!student) throw new Error("Öğrenci bulunamadı");

    // Eski başvuruları temizle yeni temiz sayfa aç
    this.appRepo.deleteByStudentId(studentId);

    const newApp: Application = {
      id: "app-" + Math.random().toString(36).substring(2, 11),
      studentId,
      studentName: student.name,
      studentEmail: student.email,
      preferredTenantId: tenantId,
      lifestyleForm: form,
      status: ApplicationStatus.SUBMITTED,
      submittedAt: new Date().toISOString()
    };

    return this.appRepo.save(newApp);
  }
}

export class AssignRoomUseCase {
  constructor(
    private appRepo: IApplicationRepository,
    private roomRepo: IRoomRepository,
    private userRepo: IUserRepository,
    private paymentRepo: IPaymentRepository,
    private notifRepo: INotificationRepository,
    private tenantRepo: ITenantRepository
  ) {}

  execute(appId: string, roomId: string, assignedByUserId: string): AssignmentLog {
    const app = this.appRepo.getById(appId);
    if (!app) throw new Error("Başvuru bulunamadı");

    const room = this.roomRepo.getById(roomId);
    if (!room) throw new Error("Oda bulunamadı");

    if (room.occupancy >= room.capacity) {
      throw new Error("Seçilen oda tamamen dolu");
    }

    // Kullanıcıya oda ve yurdu ata
    const student = this.userRepo.getById(app.studentId);
    if (student) {
      student.tenantId = room.tenantId;
      this.userRepo.update(student);
    }

    // Odaya sakini ekle
    if (!room.residentIds.includes(app.studentId)) {
      room.residentIds.push(app.studentId);
      room.occupancy = room.residentIds.length;
    }

    // Room istatistiklerini hesapla
    const db = readDB();
    const residentProfiles = db.studentProfiles.filter((p) => room.residentIds.includes(p.studentId));
    if (residentProfiles.length > 0) {
      let totalSocial = 0;
      let totalDiscipline = 0;
      let totalNoise = 0;
      const allTags = new Set<string>();

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
    }

    this.roomRepo.save(room);

    // Öğrenci profilini kaydet
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
    writeDB(db);

    // Başvuru durumunu güncelle
    app.status = ApplicationStatus.ASSIGNED;
    app.suggestedRoomId = roomId;
    this.appRepo.save(app);

    // Fatura oluştur
    const tenant = this.tenantRepo.getById(room.tenantId);
    const cost = tenant ? tenant.monthlyFee : 500;
    const newPayment: Payment = {
      id: "pay-" + Math.random().toString(36).substring(2, 11),
      studentId: app.studentId,
      studentName: app.studentName,
      tenantId: room.tenantId,
      amount: cost,
      dueDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString().split("T")[0],
      status: "UNPAID",
      invoiceNumber: "INV-" + new Date().getFullYear() + "-" + room.roomNumber + "-" + Math.floor(Math.random() * 900 + 100)
    };
    this.paymentRepo.save(newPayment);

    // Atama günlüğü kaydı
    const compatibility = app.compatibilityLog?.compatibilityScore || 85;
    const conflict = app.compatibilityLog?.conflictRisk || 15;
    const notes = app.compatibilityLog?.matchingNotes || "Yönetici tarafından manuel yerleşim atandı.";

    const log: AssignmentLog = {
      id: "log-" + Math.random().toString(36).substring(2, 11),
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

    // Log kaydet
    const activeDb = readDB();
    activeDb.assignmentLogs.unshift(log);
    writeDB(activeDb);

    // Bildirim yolla
    const newNotif: Notification = {
      id: "notif-" + Math.random().toString(36).substring(2, 11),
      userId: app.studentId,
      title: "Oda Atamanız Gerçekleşti",
      message: `Tebrikler! ${tenant?.name || "Yurdumuzda"} ${room.roomNumber} no'lu odaya yerleştirildiniz. Keyifli konaklamalar dileriz!`,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    this.notifRepo.save(newNotif);

    return log;
  }
}

export class EvictResidentUseCase {
  constructor(
    private roomRepo: IRoomRepository,
    private userRepo: IUserRepository,
    private appRepo: IApplicationRepository
  ) {}

  execute(studentId: string, roomId: string): void {
    const room = this.roomRepo.getById(roomId);
    if (!room) return;

    room.residentIds = room.residentIds.filter((id) => id !== studentId);
    room.occupancy = room.residentIds.length;

    // Room istatistiklerini yeniden hesapla
    const db = readDB();
    const residentProfiles = db.studentProfiles.filter((p) => room.residentIds.includes(p.studentId));
    if (residentProfiles.length > 0) {
      let totalSocial = 0;
      let totalDiscipline = 0;
      let totalNoise = 0;
      const allTags = new Set<string>();

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

    this.roomRepo.save(room);

    const student = this.userRepo.getById(studentId);
    if (student) {
      student.tenantId = undefined;
      this.userRepo.update(student);
    }

    // Yeniden başvuru yapabilmesi için eski başvuruyu sil
    this.appRepo.deleteByStudentId(studentId);
  }
}

export class PayInvoiceUseCase {
  constructor(
    private paymentRepo: IPaymentRepository,
    private notifRepo: INotificationRepository
  ) {}

  execute(payId: string): Payment {
    const payment = this.paymentRepo.getById(payId);
    if (!payment) throw new Error("Fatura kaydı bulunamadı");

    payment.status = "PAID";
    payment.paymentDate = new Date().toISOString();
    payment.transactionHash = "0x" + Math.random().toString(16).substring(2, 18);

    this.paymentRepo.save(payment);

    const newNotif: Notification = {
      id: "notif-" + Math.random().toString(36).substring(2, 11),
      userId: payment.studentId,
      title: "Ödeme Onaylandı",
      message: `${payment.invoiceNumber} numaralı yurt faturası ödemeniz ($${payment.amount}) başarıyla alınmıştır. Teşekkür ederiz.`,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    this.notifRepo.save(newNotif);

    return payment;
  }
}

export class CreateMaintenanceUseCase {
  constructor(
    private userRepo: IUserRepository,
    private roomRepo: IRoomRepository,
    private maintRepo: IMaintenanceRepository
  ) {}

  execute(
    studentId: string,
    title: string,
    description: string,
    category: "Plumbing" | "Electrical" | "HVAC" | "Furniture" | "Other",
    urgency: "LOW" | "MEDIUM" | "HIGH"
  ): MaintenanceRequest {
    const student = this.userRepo.getById(studentId);
    if (!student) throw new Error("Öğrenci bulunamadı");

    const db = readDB();
    const room = db.rooms.find((r) => r.residentIds.includes(studentId));
    if (!room) throw new Error("Bu öğrenciye atanmış bir oda bulunamadı");

    const newReq: MaintenanceRequest = {
      id: "maint-" + Math.random().toString(36).substring(2, 11),
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

    return this.maintRepo.save(newReq);
  }
}
