/**
 * Input validation schemas for application endpoints.
 */

import { z } from 'zod';

export const submitApplicationSchema = z.object({
  studentId: z.string().uuid(),
  preferredTenantId: z.string().uuid(),
  lifestyleForm: z.object({
    sleepSchedule: z.enum(['early-bird', 'normal', 'night-owl']),
    cleanlinessLevel: z.number().min(1).max(5),
    noiseTolerance: z.number().min(1).max(5),
    smokingPreference: z.enum(['non-smoker', 'smoker', 'no-preference']),
    socialLevel: z.number().min(1).max(5),
    gamingHabits: z.enum(['none', 'occasional', 'frequent']),
    studyHabits: z.enum(['solo-quiet', 'group-study', 'flexible']),
    introvertExtrovert: z.number().min(1).max(5),
    conflictTolerance: z.number().min(1).max(5),
    preferredRoommateType: z.string().min(1).max(200),
  }),
});

export const assignRoomSchema = z.object({
  roomId: z.string().uuid(),
  assignedByUserId: z.string().uuid(),
});

export const createMaintenanceSchema = z.object({
  studentId: z.string().uuid(),
  roomId: z.string().uuid(),
  tenantId: z.string().uuid(),
  studentName: z.string().min(1),
  roomNumber: z.string().min(1),
  title: z.string().min(3).max(120),
  description: z.string().min(10).max(1000),
  category: z.string().min(3).max(80),
  urgency: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
});

export const paymentActionSchema = z.object({
  paymentId: z.string().uuid(),
});

export const announcementSchema = z.object({
  tenantId: z.string().uuid().optional(),
  title: z.string().min(3).max(120),
  content: z.string().min(10).max(1000),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  targetRole: z.string().optional(),
});
