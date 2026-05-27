/**
 * DTOs for application-related use cases.
 */

import { ApplicationStatus, LifestyleForm } from '../../domain/types.js';

export interface SubmitApplicationDto {
  studentId: string;
  preferredTenantId: string;
  lifestyleForm: LifestyleForm;
}

export interface AssignRoomDto {
  appId: string;
  roomId: string;
  assignedByUserId: string;
}

export interface CreateMaintenanceDto {
  studentId: string;
  roomId: string;
  tenantId: string;
  studentName: string;
  roomNumber: string;
  title: string;
  description: string;
  category: string;
  urgency: string;
}

export interface PaymentActionDto {
  paymentId: string;
}

export interface NotificationDto {
  userId: string;
  title: string;
  message: string;
}
