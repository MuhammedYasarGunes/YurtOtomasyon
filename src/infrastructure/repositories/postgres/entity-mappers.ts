/**
 * Entity mapping helpers for Postgres <-> Domain transformation.
 */

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
  ApplicationStatus,
  RoomGender,
  PaymentStatus,
  MaintenanceStatus,
  MaintenanceUrgency,
} from '../../../domain/types.js';
import { UserEntity } from '../../../infrastructure/database/entities/user.entity.js';
import { TenantEntity } from '../../../infrastructure/database/entities/tenant.entity.js';
import { RoomEntity } from '../../../infrastructure/database/entities/room.entity.js';
import { ApplicationEntity } from '../../../infrastructure/database/entities/application.entity.js';
import { PaymentEntity } from '../../../infrastructure/database/entities/payment.entity.js';
import { MaintenanceRequestEntity } from '../../../infrastructure/database/entities/maintenance-request.entity.js';
import { AttendanceLogEntity } from '../../../infrastructure/database/entities/attendance-log.entity.js';
import { AnnouncementEntity } from '../../../infrastructure/database/entities/announcement.entity.js';
import { NotificationEntity } from '../../../infrastructure/database/entities/notification.entity.js';
import { StudentProfileEntity } from '../../../infrastructure/database/entities/student-profile.entity.js';

export function mapUserEntityToDomain(entity: UserEntity): User {
  return {
    id: entity.id,
    email: entity.email,
    name: entity.name,
    role: entity.role,
    tenantId: entity.tenantId || undefined,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}

export function mapTenantEntityToDomain(entity: TenantEntity): Tenant {
  return {
    id: entity.id,
    name: entity.name,
    location: entity.location,
    monthlyFee: Number(entity.monthlyFee),
    totalRooms: entity.totalRooms,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}

export function mapRoomEntityToDomain(entity: RoomEntity): Room {
  return {
    id: entity.id,
    tenantId: entity.tenantId,
    roomNumber: entity.roomNumber,
    capacity: entity.capacity,
    occupancy: entity.occupancy,
    gender: entity.gender,
    residentIds: entity.residentIds || [],
    avgSocialScore: entity.avgSocialScore !== null ? Number(entity.avgSocialScore) : undefined,
    avgDisciplineScore: entity.avgDisciplineScore !== null ? Number(entity.avgDisciplineScore) : undefined,
    avgNoiseLevel: entity.avgNoiseLevel !== null ? Number(entity.avgNoiseLevel) : undefined,
    profileTags: entity.profileTags || [],
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}

export function mapApplicationEntityToDomain(entity: ApplicationEntity): Application {
  return {
    id: entity.id,
    studentId: entity.studentId,
    studentName: entity.studentName,
    studentEmail: entity.studentEmail,
    preferredTenantId: entity.preferredTenantId,
    status: entity.status,
    lifestyleForm: entity.lifestyleForm,
    suggestedRoomId: entity.suggestedRoomId || undefined,
    compatibilityLog: entity.compatibilityLog || undefined,
    vector: entity.vector || undefined,
    tags: entity.tags || [],
    submittedAt: entity.submittedAt.toISOString(),
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}

export function mapPaymentEntityToDomain(entity: PaymentEntity): Payment {
  return {
    id: entity.id,
    studentId: entity.studentId,
    studentName: entity.studentName,
    tenantId: entity.tenantId,
    amount: Number(entity.amount),
    dueDate: entity.dueDate.toISOString().split('T')[0],
    status: entity.status,
    paymentDate: entity.paymentDate ? entity.paymentDate.toISOString() : undefined,
    transactionHash: entity.transactionHash || undefined,
    invoiceNumber: entity.invoiceNumber,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}

export function mapMaintenanceRequestEntityToDomain(entity: MaintenanceRequestEntity): MaintenanceRequest {
  return {
    id: entity.id,
    studentId: entity.studentId,
    studentName: entity.studentName,
    roomId: entity.roomId,
    roomNumber: entity.roomNumber,
    tenantId: entity.tenantId,
    title: entity.title,
    description: entity.description,
    category: entity.category,
    status: entity.status,
    urgency: entity.urgency,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}

export function mapAttendanceLogEntityToDomain(entity: AttendanceLogEntity): EntryExitLog {
  return {
    id: entity.id,
    studentId: entity.studentId,
    studentName: entity.studentName,
    tenantId: entity.tenantId,
    roomNumber: entity.roomNumber,
    direction: entity.direction,
    timestamp: entity.timestamp.toISOString(),
    loggedBy: entity.loggedBy,
    createdAt: entity.createdAt.toISOString(),
  };
}

export function mapAnnouncementEntityToDomain(entity: AnnouncementEntity): Announcement {
  return {
    id: entity.id,
    tenantId: entity.tenantId || undefined,
    title: entity.title,
    content: entity.content,
    priority: entity.priority as Announcement['priority'],
    targetRole: entity.targetRole as Announcement['targetRole'] | undefined,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}

export function mapNotificationEntityToDomain(entity: NotificationEntity): Notification {
  return {
    id: entity.id,
    userId: entity.userId,
    title: entity.title,
    message: entity.message,
    isRead: entity.isRead,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}

export function mapStudentProfileEntityToDomain(entity: StudentProfileEntity): StudentProfile {
  return {
    studentId: entity.studentId,
    lifestyleAnswers: entity.lifestyleAnswers,
    vector: entity.vector || undefined,
    tags: entity.tags || [],
    analyzedAt: entity.analyzedAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}
