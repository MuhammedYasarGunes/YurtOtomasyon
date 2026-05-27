/**
 * Application constants
 * Centralized configuration values
 */

// User roles
export const USER_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  DORM_ADMIN: 'DORM_ADMIN',
  STAFF: 'STAFF',
  STUDENT: 'STUDENT',
} as const;

// Application status
export const APPLICATION_STATUS = {
  SUBMITTED: 'SUBMITTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  ASSIGNED: 'ASSIGNED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
} as const;

// Payment status
export const PAYMENT_STATUS = {
  UNPAID: 'UNPAID',
  PAID: 'PAID',
  OVERDUE: 'OVERDUE',
  REFUNDED: 'REFUNDED',
} as const;

// Maintenance request status
export const MAINTENANCE_STATUS = {
  SUBMITTED: 'SUBMITTED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

// Maintenance urgency
export const MAINTENANCE_URGENCY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
} as const;

// Room gender types
export const ROOM_GENDER = {
  MALE: 'Male',
  FEMALE: 'Female',
  COED: 'Co-Ed',
} as const;

// Announcement priority
export const ANNOUNCEMENT_PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
} as const;

// Sleep schedule
export const SLEEP_SCHEDULE = {
  EARLY_BIRD: 'early-bird',
  NORMAL: 'normal',
  NIGHT_OWL: 'night-owl',
} as const;

// Smoking preference
export const SMOKING_PREFERENCE = {
  SMOKER: 'smoker',
  NON_SMOKER: 'non-smoker',
} as const;

// Gaming habits
export const GAMING_HABITS = {
  NONE: 'none',
  OCCASIONAL: 'occasional',
  FREQUENT: 'frequent',
} as const;

// Study habits
export const STUDY_HABITS = {
  SOLO_QUIET: 'solo-quiet',
  GROUP_STUDY: 'group-study',
  FLEXIBLE: 'flexible',
} as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// Error codes
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  CONFLICT: 'CONFLICT',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  BAD_REQUEST: 'BAD_REQUEST',
} as const;

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Regex patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  PHONE: /^\+?[\d\s\-()]{10,}$/,
  STRONG_PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
} as const;

// Numeric limits
export const NUMERIC_LIMITS = {
  MAX_ROOM_CAPACITY: 4,
  MIN_ROOM_CAPACITY: 1,
  MAX_CLEANLINESS_SCORE: 5,
  MAX_SOCIAL_SCORE: 100,
  MIN_COMPATIBILITY_SCORE: 0,
  MAX_COMPATIBILITY_SCORE: 100,
  MAX_CONFLICT_RISK_PERCENTAGE: 100,
} as const;

// Time related
export const TIME_UNITS = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
} as const;
