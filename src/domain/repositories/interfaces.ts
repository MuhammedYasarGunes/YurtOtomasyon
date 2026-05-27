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
} from '../types.js';

export interface IUserRepository {
  getAll(): Promise<User[]>;
  getById(id: string): Promise<User | undefined>;
  getByEmail(email: string): Promise<User | undefined>;
  create(user: User): Promise<User>;
  update(user: User): Promise<User>;
}

export interface ITenantRepository {
  getAll(): Promise<Tenant[]>;
  getById(id: string): Promise<Tenant | undefined>;
}

export interface IRoomRepository {
  getAll(tenantId?: string): Promise<Room[]>;
  getById(id: string): Promise<Room | undefined>;
  save(room: Room): Promise<Room>;
}

export interface IApplicationRepository {
  getAll(tenantId?: string): Promise<Application[]>;
  getById(id: string): Promise<Application | undefined>;
  getByStudentId(studentId: string): Promise<Application | undefined>;
  save(application: Application): Promise<Application>;
  deleteByStudentId(studentId: string): Promise<void>;
}

export interface IAssignmentLogRepository {
  getAll(): Promise<AssignmentLog[]>;
  save(log: AssignmentLog): Promise<AssignmentLog>;
}

export interface IPaymentRepository {
  getAll(tenantId?: string): Promise<Payment[]>;
  getById(id: string): Promise<Payment | undefined>;
  save(payment: Payment): Promise<Payment>;
}

export interface IMaintenanceRepository {
  getAll(tenantId?: string): Promise<MaintenanceRequest[]>;
  getById(id: string): Promise<MaintenanceRequest | undefined>;
  save(request: MaintenanceRequest): Promise<MaintenanceRequest>;
}

export interface IAttendanceRepository {
  getAll(tenantId?: string): Promise<EntryExitLog[]>;
  save(log: EntryExitLog): Promise<EntryExitLog>;
}

export interface IAnnouncementRepository {
  getAll(): Promise<Announcement[]>;
  save(announcement: Announcement): Promise<Announcement>;
}

export interface INotificationRepository {
  getByUserId(userId: string): Promise<Notification[]>;
  save(notification: Notification): Promise<Notification>;
  markAllAsRead(userId: string): Promise<void>;
}

export interface IStudentProfileRepository {
  getByStudentId(studentId: string): Promise<StudentProfile | undefined>;
  save(profile: StudentProfile): Promise<StudentProfile>;
  getAll(): Promise<StudentProfile[]>;
}
