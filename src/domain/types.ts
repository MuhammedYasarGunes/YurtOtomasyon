/**
 * Domain types and value objects
 * These are framework-independent business definitions.
 */

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  DORM_ADMIN = 'DORM_ADMIN',
  STAFF = 'STAFF',
  STUDENT = 'STUDENT',
}

export interface Tenant {
  id: string;
  name: string;
  location: string;
  monthlyFee: number;
  totalRooms: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  tenantId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LifestyleForm {
  sleepSchedule: 'early-bird' | 'normal' | 'night-owl';
  cleanlinessLevel: number;
  noiseTolerance: number;
  smokingPreference: 'non-smoker' | 'smoker' | 'no-preference';
  socialLevel: number;
  gamingHabits: 'none' | 'occasional' | 'frequent';
  studyHabits: 'solo-quiet' | 'group-study' | 'flexible';
  introvertExtrovert: number;
  conflictTolerance: number;
  preferredRoommateType: string;
}

export interface BehavioralVector {
  social_score: number;
  discipline_score: number;
  cleanliness_score: number;
  noise_tolerance: number;
  night_activity_score: number;
}

export interface StudentProfile {
  studentId: string;
  lifestyleAnswers: LifestyleForm;
  vector?: BehavioralVector;
  tags?: string[];
  analyzedAt: string;
  updatedAt: string;
}

export enum ApplicationStatus {
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  AI_MATCHED = 'AI_MATCHED',
  ASSIGNED = 'ASSIGNED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

export interface CompatibilityLog {
  compatibilityScore: number;
  conflictRisk: number;
  matchingNotes: string;
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
  compatibilityLog?: CompatibilityLog;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
}

export enum RoomGender {
  MALE = 'Male',
  FEMALE = 'Female',
  COED = 'Co-Ed',
}

export interface Room {
  id: string;
  tenantId: string;
  roomNumber: string;
  capacity: number;
  occupancy: number;
  gender: RoomGender;
  residentIds: string[];
  avgSocialScore?: number;
  avgDisciplineScore?: number;
  avgNoiseLevel?: number;
  profileTags?: string[];
  createdAt: string;
  updatedAt: string;
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
  assignedBy: string;
  assignedAt: string;
}

export enum PaymentStatus {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  REFUNDED = 'REFUNDED',
}

export interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  tenantId: string;
  amount: number;
  dueDate: string;
  status: PaymentStatus;
  paymentDate?: string;
  transactionHash?: string;
  invoiceNumber: string;
  createdAt: string;
  updatedAt: string;
}

export enum MaintenanceStatus {
  SUBMITTED = 'SUBMITTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum MaintenanceUrgency {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
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
  category: string;
  status: MaintenanceStatus;
  urgency: MaintenanceUrgency;
  staffUpdate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EntryExitLog {
  id: string;
  studentId: string;
  studentName: string;
  tenantId: string;
  roomId?: string;
  roomNumber: string;
  direction: 'IN' | 'OUT';
  timestamp: string;
  loggedBy: string;
  createdAt?: string;
}

export type AnnouncementPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Announcement {
  id: string;
  tenantId?: string;
  title: string;
  content: string;
  priority: AnnouncementPriority;
  targetRole?: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}
