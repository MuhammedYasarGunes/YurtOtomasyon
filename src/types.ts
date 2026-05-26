/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  DORM_ADMIN = "DORM_ADMIN",
  STAFF = "STAFF",
  STUDENT = "STUDENT"
}

export interface Tenant {
  id: string;
  name: string;
  location: string;
  monthlyFee: number;
  totalRooms: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  tenantId?: string; // Standard tenant separation
  createdAt: string;
}

export interface LifestyleForm {
  sleepSchedule: "early-bird" | "night-owl" | "irregular";
  cleanlinessLevel: number; // 1 to 5 (low to high)
  noiseTolerance: number; // 1 to 5 (low to high)
  smokingPreference: "non-smoker" | "smoker" | "no-preference";
  socialLevel: number; // 1 to 5
  gamingHabits: "none" | "occasional" | "frequent";
  studyHabits: "solo-quiet" | "group-study" | "irregular";
  introvertExtrovert: number; // 1 to 5 (1=introvert, 5=extrovert)
  conflictTolerance: number; // 1 to 5 (1=low/avoidant, 5=high/direct)
  preferredRoommateType: string;
}

export interface BehavioralVector {
  social_score: number; // 0 to 100
  discipline_score: number; // 0 to 100
  cleanliness_score: number; // 0 to 100
  noise_tolerance: number; // 0 to 100
  night_activity_score: number; // 0 to 100
}

export interface StudentProfile {
  studentId: string;
  lifestyleAnswers: LifestyleForm;
  vector?: BehavioralVector;
  tags?: string[];
  analyzedAt?: string;
}

export enum ApplicationStatus {
  SUBMITTED = "SUBMITTED",
  UNDER_REVIEW = "UNDER_REVIEW",
  AI_MATCHED = "AI_MATCHED",
  ASSIGNED = "ASSIGNED",
  REJECTED = "REJECTED"
}

export interface Application {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  preferredTenantId: string;
  lifestyleForm: LifestyleForm;
  status: ApplicationStatus;
  vector?: BehavioralVector;
  tags?: string[];
  suggestedRoomId?: string;
  compatibilityLog?: {
    compatibilityScore: number;
    conflictRisk: number;
    matchingNotes: string;
  };
  submittedAt: string;
}

export interface Room {
  id: string;
  tenantId: string;
  roomNumber: string;
  capacity: number;
  occupancy: number;
  gender: "Male" | "Female" | "Co-Ed";
  residentIds: string[];
  avgSocialScore?: number;
  avgDisciplineScore?: number;
  avgNoiseLevel?: number;
  profileTags?: string[];
}

export interface AssignmentLog {
  id: string;
  studentId: string;
  studentName: string;
  roomId: string;
  roomNumber: string;
  tenantId: string;
  compatibilityScore: number;
  conflictRisk: number;
  explanation: string;
  isOverridden: boolean;
  assignedBy: string; // "AI" or Admin User ID
  assignedAt: string;
}

export interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  tenantId: string;
  amount: number;
  dueDate: string;
  status: "PAID" | "UNPAID" | "OVERDUE";
  paymentDate?: string;
  transactionHash?: string;
  invoiceNumber: string;
}

export interface MaintenanceRequest {
  id: string;
  studentId: string;
  studentName: string;
  roomId: string;
  roomNumber: string;
  tenantId: string;
  title: string;
  description: string;
  category: "Plumbing" | "Electrical" | "HVAC" | "Furniture" | "Other";
  status: "SUBMITTED" | "IN_PROGRESS" | "COMPLETED";
  imageUrl?: string;
  urgency: "LOW" | "MEDIUM" | "HIGH";
  staffUpdate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EntryExitLog {
  id: string;
  studentId: string;
  studentName: string;
  tenantId: string;
  roomNumber: string;
  direction: "IN" | "OUT";
  timestamp: string;
  loggedBy: string; // QR Scanner, Staff Name
}

export interface Announcement {
  id: string;
  tenantId?: string; // Empty means global, otherwise specific to a dorm
  title: string;
  content: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  targetRole?: UserRole; // Target specific group
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}
