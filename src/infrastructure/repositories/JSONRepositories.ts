import fs from "fs";
import path from "path";
import {
  IUserRepository,
  ITenantRepository,
  IRoomRepository,
  IApplicationRepository,
  IPaymentRepository,
  IMaintenanceRepository,
  IAttendanceRepository,
  IAnnouncementRepository,
  INotificationRepository,
  IStudentProfileRepository,
  IAssignmentLogRepository
} from "../../domain/repositories/interfaces.js";
import {
  User,
  Tenant,
  Room,
  Application,
  Payment,
  MaintenanceRequest,
  EntryExitLog,
  Announcement,
  Notification,
  StudentProfile,
  AssignmentLog,
} from "../../domain/types.js";
import type {
  Application as DBApplication,
  Payment as DBPayment,
  MaintenanceRequest as DBMaintenanceRequest,
  Announcement as DBAnnouncement,
  StudentProfile as DBStudentProfile,
} from "../../types.js";
import { readDB, writeDB, DatabaseSchema } from "../../db.js";

export class JSONUserRepository implements IUserRepository {
  async getAll(): Promise<User[]> {
    return readDB().users as unknown as User[];
  }
  async getById(id: string): Promise<User | undefined> {
    return readDB().users.find((u) => u.id === id) as unknown as User | undefined;
  }
  async getByEmail(email: string): Promise<User | undefined> {
    return readDB().users.find((u) => u.email.toLowerCase().trim() === email.toLowerCase().trim()) as unknown as User | undefined;
  }
  async create(user: User): Promise<User> {
    const db = readDB();
    db.users.push(user);
    writeDB(db);
    return user;
  }
  async update(user: User): Promise<User> {
    const db = readDB();
    const idx = db.users.findIndex((u) => u.id === user.id);
    if (idx !== -1) {
      db.users[idx] = user;
      writeDB(db);
    }
    return user;
  }
}

export class JSONTenantRepository implements ITenantRepository {
  async getAll(): Promise<Tenant[]> {
    return readDB().tenants as unknown as Tenant[];
  }
  async getById(id: string): Promise<Tenant | undefined> {
    return readDB().tenants.find((t) => t.id === id) as unknown as Tenant | undefined;
  }
}

export class JSONRoomRepository implements IRoomRepository {
  async getAll(tenantId?: string): Promise<Room[]> {
    const db = readDB();
    const rooms = tenantId ? db.rooms.filter((r) => r.tenantId === tenantId) : db.rooms;
    return rooms as unknown as Room[];
  }
  async getById(id: string): Promise<Room | undefined> {
    return readDB().rooms.find((r) => r.id === id) as unknown as Room | undefined;
  }
  async save(room: Room): Promise<Room> {
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
}

export class JSONApplicationRepository implements IApplicationRepository {
  async getAll(tenantId?: string): Promise<Application[]> {
    const db = readDB();
    const applications = tenantId ? db.applications.filter((a) => a.preferredTenantId === tenantId) : db.applications;
    return applications as unknown as Application[];
  }
  async getById(id: string): Promise<Application | undefined> {
    return readDB().applications.find((a) => a.id === id) as unknown as Application | undefined;
  }
  async getByStudentId(studentId: string): Promise<Application | undefined> {
    return readDB().applications.find((a) => a.studentId === studentId) as unknown as Application | undefined;
  }
  async save(application: Application): Promise<Application> {
    const db = readDB();
    const dbApplication = application as unknown as DBApplication;
    const idx = db.applications.findIndex((a) => a.id === application.id);
    if (idx !== -1) {
      db.applications[idx] = dbApplication;
    } else {
      db.applications.push(dbApplication);
    }
    writeDB(db);
    return application;
  }
  async deleteByStudentId(studentId: string): Promise<void> {
    const db = readDB();
    db.applications = db.applications.filter((a) => a.studentId !== studentId);
    writeDB(db);
  }
}

export class JSONPaymentRepository implements IPaymentRepository {
  async getAll(tenantId?: string): Promise<Payment[]> {
    const db = readDB();
    const payments = tenantId ? db.payments.filter((p) => p.tenantId === tenantId) : db.payments;
    return payments as unknown as Payment[];
  }
  async getById(id: string): Promise<Payment | undefined> {
    return readDB().payments.find((p) => p.id === id) as unknown as Payment | undefined;
  }
  async save(payment: Payment): Promise<Payment> {
    const db = readDB();
    const dbPayment = payment as unknown as DBPayment;
    const idx = db.payments.findIndex((p) => p.id === payment.id);
    if (idx !== -1) {
      db.payments[idx] = dbPayment;
    } else {
      db.payments.push(dbPayment);
    }
    writeDB(db);
    return payment;
  }
}

export class JSONMaintenanceRepository implements IMaintenanceRepository {
  async getAll(tenantId?: string): Promise<MaintenanceRequest[]> {
    const db = readDB();
    const requests = tenantId ? db.maintenanceRequests.filter((m) => m.tenantId === tenantId) : db.maintenanceRequests;
    return requests as unknown as MaintenanceRequest[];
  }
  async getById(id: string): Promise<MaintenanceRequest | undefined> {
    return readDB().maintenanceRequests.find((m) => m.id === id) as unknown as MaintenanceRequest | undefined;
  }
  async save(request: MaintenanceRequest): Promise<MaintenanceRequest> {
    const db = readDB();
    const dbRequest = request as unknown as DBMaintenanceRequest;
    const idx = db.maintenanceRequests.findIndex((m) => m.id === request.id);
    if (idx !== -1) {
      db.maintenanceRequests[idx] = dbRequest;
    } else {
      db.maintenanceRequests.push(dbRequest);
    }
    writeDB(db);
    return request;
  }
}

export class JSONAttendanceRepository implements IAttendanceRepository {
  async getAll(tenantId?: string): Promise<EntryExitLog[]> {
    const db = readDB();
    const logs = tenantId ? db.attendanceLogs.filter((a) => a.tenantId === tenantId) : db.attendanceLogs;
    return logs as unknown as EntryExitLog[];
  }
  async save(log: EntryExitLog): Promise<EntryExitLog> {
    const db = readDB();
    db.attendanceLogs.unshift(log);
    writeDB(db);
    return log;
  }
}

export class JSONAnnouncementRepository implements IAnnouncementRepository {
  async getAll(tenantId?: string): Promise<Announcement[]> {
    const db = readDB();
    const announcements = tenantId ? db.announcements.filter((a) => !a.tenantId || a.tenantId === tenantId) : db.announcements;
    return announcements as unknown as Announcement[];
  }
  async save(announcement: Announcement): Promise<Announcement> {
    const db = readDB();
    db.announcements.unshift(announcement as unknown as DBAnnouncement);
    writeDB(db);
    return announcement;
  }
}

export class JSONNotificationRepository implements INotificationRepository {
  async getByUserId(userId: string): Promise<Notification[]> {
    return readDB().notifications.filter((n) => n.userId === userId) as unknown as Notification[];
  }
  async save(notification: Notification): Promise<Notification> {
    const db = readDB();
    db.notifications.unshift(notification);
    writeDB(db);
    return notification;
  }
  async markAllAsRead(userId: string): Promise<void> {
    const db = readDB();
    db.notifications.forEach((n) => {
      if (n.userId === userId) {
        n.isRead = true;
      }
    });
    writeDB(db);
  }
}

export class JSONStudentProfileRepository implements IStudentProfileRepository {
  async getByStudentId(studentId: string): Promise<StudentProfile | undefined> {
    return readDB().studentProfiles.find((p) => p.studentId === studentId) as unknown as StudentProfile | undefined;
  }

  async save(profile: StudentProfile): Promise<StudentProfile> {
    const db = readDB();
    const dbProfile = profile as unknown as DBStudentProfile;
    const idx = db.studentProfiles.findIndex((p) => p.studentId === profile.studentId);
    if (idx !== -1) {
      db.studentProfiles[idx] = dbProfile;
    } else {
      db.studentProfiles.push(dbProfile);
    }
    writeDB(db);
    return profile;
  }

  async getAll(): Promise<StudentProfile[]> {
    return readDB().studentProfiles as unknown as StudentProfile[];
  }
}

export class JSONAssignmentLogRepository implements IAssignmentLogRepository {
  async getAll(): Promise<AssignmentLog[]> {
    return readDB().assignmentLogs as unknown as AssignmentLog[];
  }

  async save(log: AssignmentLog): Promise<AssignmentLog> {
    const db = readDB();
    db.assignmentLogs.unshift(log);
    writeDB(db);
    return log;
  }
}
