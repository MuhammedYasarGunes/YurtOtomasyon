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
  INotificationRepository
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
  Notification
} from "../../types.js";
import { readDB, writeDB, DatabaseSchema } from "../../db.js";

export class JSONUserRepository implements IUserRepository {
  getAll(): User[] {
    return readDB().users;
  }
  getById(id: string): User | undefined {
    return readDB().users.find((u) => u.id === id);
  }
  getByEmail(email: string): User | undefined {
    return readDB().users.find((u) => u.email.toLowerCase().trim() === email.toLowerCase().trim());
  }
  create(user: User): User {
    const db = readDB();
    db.users.push(user);
    writeDB(db);
    return user;
  }
  update(user: User): User {
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
  getAll(): Tenant[] {
    return readDB().tenants;
  }
  getById(id: string): Tenant | undefined {
    return readDB().tenants.find((t) => t.id === id);
  }
}

export class JSONRoomRepository implements IRoomRepository {
  getAll(tenantId?: string): Room[] {
    const db = readDB();
    return tenantId ? db.rooms.filter((r) => r.tenantId === tenantId) : db.rooms;
  }
  getById(id: string): Room | undefined {
    return readDB().rooms.find((r) => r.id === id);
  }
  save(room: Room): Room {
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
  getAll(tenantId?: string): Application[] {
    const db = readDB();
    return tenantId ? db.applications.filter((a) => a.preferredTenantId === tenantId) : db.applications;
  }
  getById(id: string): Application | undefined {
    return readDB().applications.find((a) => a.id === id);
  }
  getByStudentId(studentId: string): Application | undefined {
    return readDB().applications.find((a) => a.studentId === studentId);
  }
  save(application: Application): Application {
    const db = readDB();
    const idx = db.applications.findIndex((a) => a.id === application.id);
    if (idx !== -1) {
      db.applications[idx] = application;
    } else {
      db.applications.push(application);
    }
    writeDB(db);
    return application;
  }
  deleteByStudentId(studentId: string): void {
    const db = readDB();
    db.applications = db.applications.filter((a) => a.studentId !== studentId);
    writeDB(db);
  }
}

export class JSONPaymentRepository implements IPaymentRepository {
  getAll(tenantId?: string): Payment[] {
    const db = readDB();
    return tenantId ? db.payments.filter((p) => p.tenantId === tenantId) : db.payments;
  }
  getById(id: string): Payment | undefined {
    return readDB().payments.find((p) => p.id === id);
  }
  save(payment: Payment): Payment {
    const db = readDB();
    const idx = db.payments.findIndex((p) => p.id === payment.id);
    if (idx !== -1) {
      db.payments[idx] = payment;
    } else {
      db.payments.push(payment);
    }
    writeDB(db);
    return payment;
  }
}

export class JSONMaintenanceRepository implements IMaintenanceRepository {
  getAll(tenantId?: string): MaintenanceRequest[] {
    const db = readDB();
    return tenantId ? db.maintenanceRequests.filter((m) => m.tenantId === tenantId) : db.maintenanceRequests;
  }
  getById(id: string): MaintenanceRequest | undefined {
    return readDB().maintenanceRequests.find((m) => m.id === id);
  }
  save(request: MaintenanceRequest): MaintenanceRequest {
    const db = readDB();
    const idx = db.maintenanceRequests.findIndex((m) => m.id === request.id);
    if (idx !== -1) {
      db.maintenanceRequests[idx] = request;
    } else {
      db.maintenanceRequests.push(request);
    }
    writeDB(db);
    return request;
  }
}

export class JSONAttendanceRepository implements IAttendanceRepository {
  getAll(tenantId?: string): EntryExitLog[] {
    const db = readDB();
    return tenantId ? db.attendanceLogs.filter((a) => a.tenantId === tenantId) : db.attendanceLogs;
  }
  save(log: EntryExitLog): EntryExitLog {
    const db = readDB();
    db.attendanceLogs.unshift(log);
    writeDB(db);
    return log;
  }
}

export class JSONAnnouncementRepository implements IAnnouncementRepository {
  getAll(tenantId?: string): Announcement[] {
    const db = readDB();
    return tenantId ? db.announcements.filter((a) => !a.tenantId || a.tenantId === tenantId) : db.announcements;
  }
  save(announcement: Announcement): Announcement {
    const db = readDB();
    db.announcements.unshift(announcement);
    writeDB(db);
    return announcement;
  }
}

export class JSONNotificationRepository implements INotificationRepository {
  getByUserId(userId: string): Notification[] {
    return readDB().notifications.filter((n) => n.userId === userId);
  }
  save(notification: Notification): Notification {
    const db = readDB();
    db.notifications.unshift(notification);
    writeDB(db);
    return notification;
  }
  markAllAsRead(userId: string): void {
    const db = readDB();
    db.notifications.forEach((n) => {
      if (n.userId === userId) {
        n.isRead = true;
      }
    });
    writeDB(db);
  }
}
