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
  LifestyleForm,
  ApplicationStatus
} from "../../types.js";

export interface IUserRepository {
  getAll(): User[];
  getById(id: string): User | undefined;
  getByEmail(email: string): User | undefined;
  create(user: User): User;
  update(user: User): User;
}

export interface ITenantRepository {
  getAll(): Tenant[];
  getById(id: string): Tenant | undefined;
}

export interface IRoomRepository {
  getAll(tenantId?: string): Room[];
  getById(id: string): Room | undefined;
  save(room: Room): Room;
}

export interface IApplicationRepository {
  getAll(tenantId?: string): Application[];
  getById(id: string): Application | undefined;
  getByStudentId(studentId: string): Application | undefined;
  save(application: Application): Application;
  deleteByStudentId(studentId: string): void;
}

export interface IPaymentRepository {
  getAll(tenantId?: string): Payment[];
  getById(id: string): Payment | undefined;
  save(payment: Payment): Payment;
}

export interface IMaintenanceRepository {
  getAll(tenantId?: string): MaintenanceRequest[];
  getById(id: string): MaintenanceRequest | undefined;
  save(request: MaintenanceRequest): MaintenanceRequest;
}

export interface IAttendanceRepository {
  getAll(tenantId?: string): EntryExitLog[];
  save(log: EntryExitLog): EntryExitLog;
}

export interface IAnnouncementRepository {
  getAll(tenantId?: string): Announcement[];
  save(announcement: Announcement): Announcement;
}

export interface INotificationRepository {
  getByUserId(userId: string): Notification[];
  save(notification: Notification): Notification;
  markAllAsRead(userId: string): void;
}
