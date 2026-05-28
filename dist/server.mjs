var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};

// server.ts
import express from "express";
import path from "path";
import fs from "fs";
import { v4 as uuidv42 } from "uuid";

// src/infrastructure/database/entities/user.entity.ts
import {
  Entity as Entity9,
  PrimaryColumn as PrimaryColumn9,
  Column as Column9,
  CreateDateColumn as CreateDateColumn9,
  UpdateDateColumn as UpdateDateColumn8,
  Index as Index9,
  OneToMany as OneToMany3
} from "typeorm";

// src/infrastructure/database/entities/application.entity.ts
import {
  Entity as Entity7,
  PrimaryColumn as PrimaryColumn7,
  Column as Column7,
  CreateDateColumn as CreateDateColumn7,
  UpdateDateColumn as UpdateDateColumn6,
  ManyToOne as ManyToOne6,
  JoinColumn as JoinColumn6,
  Index as Index7
} from "typeorm";

// src/infrastructure/database/entities/tenant.entity.ts
import {
  Entity as Entity6,
  PrimaryColumn as PrimaryColumn6,
  Column as Column6,
  CreateDateColumn as CreateDateColumn6,
  UpdateDateColumn as UpdateDateColumn5,
  OneToMany as OneToMany2,
  Index as Index6
} from "typeorm";

// src/infrastructure/database/entities/room.entity.ts
import {
  Entity as Entity3,
  PrimaryColumn as PrimaryColumn3,
  Column as Column3,
  CreateDateColumn as CreateDateColumn3,
  UpdateDateColumn as UpdateDateColumn2,
  ManyToOne as ManyToOne3,
  OneToMany,
  Index as Index3,
  JoinColumn as JoinColumn3
} from "typeorm";

// src/infrastructure/database/entities/maintenance-request.entity.ts
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index
} from "typeorm";
var MaintenanceStatus = /* @__PURE__ */ ((MaintenanceStatus3) => {
  MaintenanceStatus3["SUBMITTED"] = "SUBMITTED";
  MaintenanceStatus3["IN_PROGRESS"] = "IN_PROGRESS";
  MaintenanceStatus3["COMPLETED"] = "COMPLETED";
  MaintenanceStatus3["CANCELLED"] = "CANCELLED";
  return MaintenanceStatus3;
})(MaintenanceStatus || {});
var MaintenanceUrgency = /* @__PURE__ */ ((MaintenanceUrgency3) => {
  MaintenanceUrgency3["LOW"] = "LOW";
  MaintenanceUrgency3["MEDIUM"] = "MEDIUM";
  MaintenanceUrgency3["HIGH"] = "HIGH";
  MaintenanceUrgency3["CRITICAL"] = "CRITICAL";
  return MaintenanceUrgency3;
})(MaintenanceUrgency || {});
var MaintenanceRequestEntity = class {
};
__decorateClass([
  PrimaryColumn("uuid")
], MaintenanceRequestEntity.prototype, "id", 2);
__decorateClass([
  Column("uuid")
], MaintenanceRequestEntity.prototype, "studentId", 2);
__decorateClass([
  Column("uuid")
], MaintenanceRequestEntity.prototype, "roomId", 2);
__decorateClass([
  Column("uuid")
], MaintenanceRequestEntity.prototype, "tenantId", 2);
__decorateClass([
  Column({ type: "varchar" })
], MaintenanceRequestEntity.prototype, "studentName", 2);
__decorateClass([
  Column({ type: "varchar" })
], MaintenanceRequestEntity.prototype, "roomNumber", 2);
__decorateClass([
  Column({ type: "varchar" })
], MaintenanceRequestEntity.prototype, "title", 2);
__decorateClass([
  Column({ type: "text" })
], MaintenanceRequestEntity.prototype, "description", 2);
__decorateClass([
  Column({ type: "varchar" })
], MaintenanceRequestEntity.prototype, "category", 2);
__decorateClass([
  Column({ type: "enum", enum: MaintenanceStatus })
], MaintenanceRequestEntity.prototype, "status", 2);
__decorateClass([
  Column({ type: "enum", enum: MaintenanceUrgency })
], MaintenanceRequestEntity.prototype, "urgency", 2);
__decorateClass([
  CreateDateColumn()
], MaintenanceRequestEntity.prototype, "createdAt", 2);
__decorateClass([
  UpdateDateColumn()
], MaintenanceRequestEntity.prototype, "updatedAt", 2);
__decorateClass([
  ManyToOne(() => UserEntity, (user) => user.maintenanceRequests, {
    onDelete: "CASCADE"
  }),
  JoinColumn({ name: "studentId" })
], MaintenanceRequestEntity.prototype, "student", 2);
__decorateClass([
  ManyToOne(() => TenantEntity, (tenant) => tenant.maintenanceRequests, {
    onDelete: "CASCADE"
  }),
  JoinColumn({ name: "tenantId" })
], MaintenanceRequestEntity.prototype, "tenant", 2);
__decorateClass([
  ManyToOne(() => RoomEntity, (room) => room.maintenanceRequests, {
    onDelete: "CASCADE"
  }),
  JoinColumn({ name: "roomId" })
], MaintenanceRequestEntity.prototype, "room", 2);
MaintenanceRequestEntity = __decorateClass([
  Entity("maintenance_requests"),
  Index(["studentId"]),
  Index(["roomId"]),
  Index(["tenantId"]),
  Index(["status"])
], MaintenanceRequestEntity);

// src/infrastructure/database/entities/attendance-log.entity.ts
import {
  Entity as Entity2,
  PrimaryColumn as PrimaryColumn2,
  Column as Column2,
  CreateDateColumn as CreateDateColumn2,
  ManyToOne as ManyToOne2,
  JoinColumn as JoinColumn2,
  Index as Index2
} from "typeorm";
var AttendanceLogEntity = class {
};
__decorateClass([
  PrimaryColumn2("uuid")
], AttendanceLogEntity.prototype, "id", 2);
__decorateClass([
  Column2("uuid")
], AttendanceLogEntity.prototype, "studentId", 2);
__decorateClass([
  Column2({ type: "varchar" })
], AttendanceLogEntity.prototype, "studentName", 2);
__decorateClass([
  Column2("uuid")
], AttendanceLogEntity.prototype, "tenantId", 2);
__decorateClass([
  Column2("uuid", { nullable: true })
], AttendanceLogEntity.prototype, "roomId", 2);
__decorateClass([
  Column2({ type: "varchar" })
], AttendanceLogEntity.prototype, "roomNumber", 2);
__decorateClass([
  Column2({ type: "varchar" })
], AttendanceLogEntity.prototype, "direction", 2);
__decorateClass([
  Column2({ type: "timestamp with time zone" })
], AttendanceLogEntity.prototype, "timestamp", 2);
__decorateClass([
  Column2({ type: "varchar" })
], AttendanceLogEntity.prototype, "loggedBy", 2);
__decorateClass([
  CreateDateColumn2()
], AttendanceLogEntity.prototype, "createdAt", 2);
__decorateClass([
  ManyToOne2(() => UserEntity, (user) => user.id, {
    onDelete: "CASCADE"
  }),
  JoinColumn2({ name: "studentId" })
], AttendanceLogEntity.prototype, "student", 2);
__decorateClass([
  ManyToOne2(() => TenantEntity, (tenant) => tenant.id, {
    onDelete: "CASCADE"
  }),
  JoinColumn2({ name: "tenantId" })
], AttendanceLogEntity.prototype, "tenant", 2);
__decorateClass([
  ManyToOne2(() => RoomEntity, (room) => room.attendanceLogs, {
    onDelete: "CASCADE"
  }),
  JoinColumn2({ name: "roomId" })
], AttendanceLogEntity.prototype, "room", 2);
AttendanceLogEntity = __decorateClass([
  Entity2("attendance_logs"),
  Index2(["studentId"]),
  Index2(["tenantId"]),
  Index2(["roomId"])
], AttendanceLogEntity);

// src/infrastructure/database/entities/room.entity.ts
var RoomGender = /* @__PURE__ */ ((RoomGender2) => {
  RoomGender2["MALE"] = "Male";
  RoomGender2["FEMALE"] = "Female";
  RoomGender2["COED"] = "Co-Ed";
  return RoomGender2;
})(RoomGender || {});
var RoomEntity = class {
};
__decorateClass([
  PrimaryColumn3("uuid")
], RoomEntity.prototype, "id", 2);
__decorateClass([
  Column3("uuid")
], RoomEntity.prototype, "tenantId", 2);
__decorateClass([
  Column3({ type: "varchar" })
], RoomEntity.prototype, "roomNumber", 2);
__decorateClass([
  Column3({ type: "integer" })
], RoomEntity.prototype, "capacity", 2);
__decorateClass([
  Column3({ type: "integer", default: 0 })
], RoomEntity.prototype, "occupancy", 2);
__decorateClass([
  Column3({ type: "enum", enum: RoomGender })
], RoomEntity.prototype, "gender", 2);
__decorateClass([
  Column3({ type: "simple-array", default: () => "'{}'" })
], RoomEntity.prototype, "residentIds", 2);
__decorateClass([
  Column3({ type: "numeric", nullable: true })
], RoomEntity.prototype, "avgSocialScore", 2);
__decorateClass([
  Column3({ type: "numeric", nullable: true })
], RoomEntity.prototype, "avgDisciplineScore", 2);
__decorateClass([
  Column3({ type: "numeric", nullable: true })
], RoomEntity.prototype, "avgNoiseLevel", 2);
__decorateClass([
  Column3({ type: "simple-array", default: () => "'{}'" })
], RoomEntity.prototype, "profileTags", 2);
__decorateClass([
  CreateDateColumn3()
], RoomEntity.prototype, "createdAt", 2);
__decorateClass([
  UpdateDateColumn2()
], RoomEntity.prototype, "updatedAt", 2);
__decorateClass([
  ManyToOne3(() => TenantEntity, (tenant) => tenant.rooms, {
    onDelete: "CASCADE"
  }),
  JoinColumn3({ name: "tenantId" })
], RoomEntity.prototype, "tenant", 2);
__decorateClass([
  OneToMany(() => ApplicationEntity, (app2) => app2.suggestedRoom)
], RoomEntity.prototype, "applications", 2);
__decorateClass([
  OneToMany(() => MaintenanceRequestEntity, (maint) => maint.room)
], RoomEntity.prototype, "maintenanceRequests", 2);
__decorateClass([
  OneToMany(() => AttendanceLogEntity, (log) => log.room)
], RoomEntity.prototype, "attendanceLogs", 2);
RoomEntity = __decorateClass([
  Entity3("rooms"),
  Index3(["tenantId"]),
  Index3(["tenantId", "roomNumber"], { unique: true })
], RoomEntity);

// src/infrastructure/database/entities/payment.entity.ts
import {
  Entity as Entity4,
  PrimaryColumn as PrimaryColumn4,
  Column as Column4,
  CreateDateColumn as CreateDateColumn4,
  UpdateDateColumn as UpdateDateColumn3,
  ManyToOne as ManyToOne4,
  JoinColumn as JoinColumn4,
  Index as Index4
} from "typeorm";
var PaymentStatus = /* @__PURE__ */ ((PaymentStatus3) => {
  PaymentStatus3["UNPAID"] = "UNPAID";
  PaymentStatus3["PAID"] = "PAID";
  PaymentStatus3["OVERDUE"] = "OVERDUE";
  PaymentStatus3["REFUNDED"] = "REFUNDED";
  return PaymentStatus3;
})(PaymentStatus || {});
var PaymentEntity = class {
};
__decorateClass([
  PrimaryColumn4("uuid")
], PaymentEntity.prototype, "id", 2);
__decorateClass([
  Column4("uuid")
], PaymentEntity.prototype, "studentId", 2);
__decorateClass([
  Column4("uuid")
], PaymentEntity.prototype, "tenantId", 2);
__decorateClass([
  Column4({ type: "varchar" })
], PaymentEntity.prototype, "studentName", 2);
__decorateClass([
  Column4({ type: "numeric" })
], PaymentEntity.prototype, "amount", 2);
__decorateClass([
  Column4({ type: "date" })
], PaymentEntity.prototype, "dueDate", 2);
__decorateClass([
  Column4({ type: "enum", enum: PaymentStatus })
], PaymentEntity.prototype, "status", 2);
__decorateClass([
  Column4({ type: "date", nullable: true })
], PaymentEntity.prototype, "paymentDate", 2);
__decorateClass([
  Column4({ type: "varchar", nullable: true })
], PaymentEntity.prototype, "transactionHash", 2);
__decorateClass([
  Column4({ type: "varchar" })
], PaymentEntity.prototype, "invoiceNumber", 2);
__decorateClass([
  CreateDateColumn4()
], PaymentEntity.prototype, "createdAt", 2);
__decorateClass([
  UpdateDateColumn3()
], PaymentEntity.prototype, "updatedAt", 2);
__decorateClass([
  ManyToOne4(() => UserEntity, (user) => user.payments, {
    onDelete: "CASCADE"
  }),
  JoinColumn4({ name: "studentId" })
], PaymentEntity.prototype, "student", 2);
__decorateClass([
  ManyToOne4(() => TenantEntity, (tenant) => tenant.payments, {
    onDelete: "CASCADE"
  }),
  JoinColumn4({ name: "tenantId" })
], PaymentEntity.prototype, "tenant", 2);
PaymentEntity = __decorateClass([
  Entity4("payments"),
  Index4(["studentId"]),
  Index4(["tenantId"]),
  Index4(["status"])
], PaymentEntity);

// src/infrastructure/database/entities/announcement.entity.ts
import {
  Entity as Entity5,
  PrimaryColumn as PrimaryColumn5,
  Column as Column5,
  CreateDateColumn as CreateDateColumn5,
  UpdateDateColumn as UpdateDateColumn4,
  ManyToOne as ManyToOne5,
  JoinColumn as JoinColumn5,
  Index as Index5
} from "typeorm";
var AnnouncementEntity = class {
};
__decorateClass([
  PrimaryColumn5("uuid")
], AnnouncementEntity.prototype, "id", 2);
__decorateClass([
  Column5("uuid", { nullable: true })
], AnnouncementEntity.prototype, "tenantId", 2);
__decorateClass([
  Column5({ type: "varchar" })
], AnnouncementEntity.prototype, "title", 2);
__decorateClass([
  Column5({ type: "text" })
], AnnouncementEntity.prototype, "content", 2);
__decorateClass([
  Column5({ type: "varchar" })
], AnnouncementEntity.prototype, "priority", 2);
__decorateClass([
  Column5({ type: "varchar", nullable: true })
], AnnouncementEntity.prototype, "targetRole", 2);
__decorateClass([
  CreateDateColumn5()
], AnnouncementEntity.prototype, "createdAt", 2);
__decorateClass([
  UpdateDateColumn4()
], AnnouncementEntity.prototype, "updatedAt", 2);
__decorateClass([
  ManyToOne5(() => TenantEntity, (tenant) => tenant.announcements, {
    onDelete: "SET NULL"
  }),
  JoinColumn5({ name: "tenantId" })
], AnnouncementEntity.prototype, "tenant", 2);
AnnouncementEntity = __decorateClass([
  Entity5("announcements"),
  Index5(["tenantId"])
], AnnouncementEntity);

// src/infrastructure/database/entities/tenant.entity.ts
var TenantEntity = class {
};
__decorateClass([
  PrimaryColumn6("uuid")
], TenantEntity.prototype, "id", 2);
__decorateClass([
  Column6({ type: "varchar" })
], TenantEntity.prototype, "name", 2);
__decorateClass([
  Column6({ type: "varchar" })
], TenantEntity.prototype, "location", 2);
__decorateClass([
  Column6({ type: "numeric" })
], TenantEntity.prototype, "monthlyFee", 2);
__decorateClass([
  Column6({ type: "integer" })
], TenantEntity.prototype, "totalRooms", 2);
__decorateClass([
  CreateDateColumn6()
], TenantEntity.prototype, "createdAt", 2);
__decorateClass([
  UpdateDateColumn5()
], TenantEntity.prototype, "updatedAt", 2);
__decorateClass([
  OneToMany2(() => RoomEntity, (room) => room.tenant)
], TenantEntity.prototype, "rooms", 2);
__decorateClass([
  OneToMany2(() => ApplicationEntity, (app2) => app2.preferredTenant)
], TenantEntity.prototype, "applications", 2);
__decorateClass([
  OneToMany2(() => PaymentEntity, (payment) => payment.tenant)
], TenantEntity.prototype, "payments", 2);
__decorateClass([
  OneToMany2(() => MaintenanceRequestEntity, (maint) => maint.tenant)
], TenantEntity.prototype, "maintenanceRequests", 2);
__decorateClass([
  OneToMany2(() => AnnouncementEntity, (announcement) => announcement.tenant)
], TenantEntity.prototype, "announcements", 2);
TenantEntity = __decorateClass([
  Entity6("tenants"),
  Index6(["name"])
], TenantEntity);

// src/infrastructure/database/entities/application.entity.ts
var ApplicationStatus = /* @__PURE__ */ ((ApplicationStatus3) => {
  ApplicationStatus3["SUBMITTED"] = "SUBMITTED";
  ApplicationStatus3["AI_MATCHED"] = "AI_MATCHED";
  ApplicationStatus3["UNDER_REVIEW"] = "UNDER_REVIEW";
  ApplicationStatus3["ASSIGNED"] = "ASSIGNED";
  ApplicationStatus3["REJECTED"] = "REJECTED";
  ApplicationStatus3["CANCELLED"] = "CANCELLED";
  return ApplicationStatus3;
})(ApplicationStatus || {});
var ApplicationEntity = class {
};
__decorateClass([
  PrimaryColumn7("uuid")
], ApplicationEntity.prototype, "id", 2);
__decorateClass([
  Column7("uuid")
], ApplicationEntity.prototype, "studentId", 2);
__decorateClass([
  Column7("uuid", { nullable: true })
], ApplicationEntity.prototype, "preferredTenantId", 2);
__decorateClass([
  Column7({ type: "varchar" })
], ApplicationEntity.prototype, "studentName", 2);
__decorateClass([
  Column7({ type: "varchar" })
], ApplicationEntity.prototype, "studentEmail", 2);
__decorateClass([
  Column7({ type: "enum", enum: ApplicationStatus })
], ApplicationEntity.prototype, "status", 2);
__decorateClass([
  Column7({ type: "jsonb" })
], ApplicationEntity.prototype, "lifestyleForm", 2);
__decorateClass([
  Column7({ type: "uuid", nullable: true })
], ApplicationEntity.prototype, "suggestedRoomId", 2);
__decorateClass([
  Column7({ type: "jsonb", nullable: true })
], ApplicationEntity.prototype, "compatibilityLog", 2);
__decorateClass([
  Column7({ type: "jsonb", nullable: true })
], ApplicationEntity.prototype, "vector", 2);
__decorateClass([
  Column7({ type: "simple-array", default: () => "'{}'" })
], ApplicationEntity.prototype, "tags", 2);
__decorateClass([
  CreateDateColumn7()
], ApplicationEntity.prototype, "submittedAt", 2);
__decorateClass([
  CreateDateColumn7()
], ApplicationEntity.prototype, "createdAt", 2);
__decorateClass([
  UpdateDateColumn6()
], ApplicationEntity.prototype, "updatedAt", 2);
__decorateClass([
  ManyToOne6(() => UserEntity, (user) => user.applications, {
    onDelete: "CASCADE"
  }),
  JoinColumn6({ name: "studentId" })
], ApplicationEntity.prototype, "student", 2);
__decorateClass([
  ManyToOne6(() => TenantEntity, (tenant) => tenant.applications, {
    onDelete: "CASCADE"
  }),
  JoinColumn6({ name: "preferredTenantId" })
], ApplicationEntity.prototype, "preferredTenant", 2);
__decorateClass([
  ManyToOne6(() => RoomEntity, (room) => room.applications, {
    onDelete: "SET NULL"
  }),
  JoinColumn6({ name: "suggestedRoomId" })
], ApplicationEntity.prototype, "suggestedRoom", 2);
ApplicationEntity = __decorateClass([
  Entity7("applications"),
  Index7(["studentId"], { unique: true }),
  Index7(["preferredTenantId"])
], ApplicationEntity);

// src/infrastructure/database/entities/notification.entity.ts
import {
  Entity as Entity8,
  PrimaryColumn as PrimaryColumn8,
  Column as Column8,
  CreateDateColumn as CreateDateColumn8,
  UpdateDateColumn as UpdateDateColumn7,
  ManyToOne as ManyToOne7,
  JoinColumn as JoinColumn7,
  Index as Index8
} from "typeorm";
var NotificationEntity = class {
};
__decorateClass([
  PrimaryColumn8("uuid")
], NotificationEntity.prototype, "id", 2);
__decorateClass([
  Column8("uuid")
], NotificationEntity.prototype, "userId", 2);
__decorateClass([
  Column8({ type: "varchar" })
], NotificationEntity.prototype, "title", 2);
__decorateClass([
  Column8({ type: "text" })
], NotificationEntity.prototype, "message", 2);
__decorateClass([
  Column8({ type: "boolean", default: false })
], NotificationEntity.prototype, "isRead", 2);
__decorateClass([
  CreateDateColumn8()
], NotificationEntity.prototype, "createdAt", 2);
__decorateClass([
  UpdateDateColumn7()
], NotificationEntity.prototype, "updatedAt", 2);
__decorateClass([
  ManyToOne7(() => UserEntity, (user) => user.notifications, {
    onDelete: "CASCADE"
  }),
  JoinColumn7({ name: "userId" })
], NotificationEntity.prototype, "user", 2);
NotificationEntity = __decorateClass([
  Entity8("notifications"),
  Index8(["userId"])
], NotificationEntity);

// src/infrastructure/database/entities/user.entity.ts
var UserRole = /* @__PURE__ */ ((UserRole4) => {
  UserRole4["SUPER_ADMIN"] = "SUPER_ADMIN";
  UserRole4["DORM_ADMIN"] = "DORM_ADMIN";
  UserRole4["STAFF"] = "STAFF";
  UserRole4["STUDENT"] = "STUDENT";
  return UserRole4;
})(UserRole || {});
var UserEntity = class {
};
__decorateClass([
  PrimaryColumn9("uuid")
], UserEntity.prototype, "id", 2);
__decorateClass([
  Column9({ type: "varchar", unique: true })
], UserEntity.prototype, "email", 2);
__decorateClass([
  Column9({ type: "varchar" })
], UserEntity.prototype, "name", 2);
__decorateClass([
  Column9({ type: "enum", enum: UserRole })
], UserEntity.prototype, "role", 2);
__decorateClass([
  Column9({ type: "uuid", nullable: true })
], UserEntity.prototype, "tenantId", 2);
__decorateClass([
  CreateDateColumn9()
], UserEntity.prototype, "createdAt", 2);
__decorateClass([
  UpdateDateColumn8()
], UserEntity.prototype, "updatedAt", 2);
__decorateClass([
  OneToMany3(() => ApplicationEntity, (app2) => app2.student)
], UserEntity.prototype, "applications", 2);
__decorateClass([
  OneToMany3(() => PaymentEntity, (payment) => payment.student)
], UserEntity.prototype, "payments", 2);
__decorateClass([
  OneToMany3(() => MaintenanceRequestEntity, (maint) => maint.student)
], UserEntity.prototype, "maintenanceRequests", 2);
__decorateClass([
  OneToMany3(() => NotificationEntity, (notif) => notif.user)
], UserEntity.prototype, "notifications", 2);
UserEntity = __decorateClass([
  Entity9("users"),
  Index9(["email"], { unique: true }),
  Index9(["tenantId"])
], UserEntity);

// src/infrastructure/database/connection.ts
import "reflect-metadata";
import { DataSource } from "typeorm";

// src/config/env.ts
import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();
var EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "staging", "production"]).default("development"),
  PORT: z.coerce.number().default(3e3),
  API_URL: z.string().url().default("http://localhost:3000"),
  // Database
  DB_TYPE: z.enum(["postgres", "mongodb"]).default("postgres"),
  DB_HOST: z.string().default("localhost"),
  DB_PORT: z.coerce.number().default(5434),
  // Docker için kullandığımız port
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_DATABASE: z.string(),
  DB_SYNCHRONIZE: z.coerce.boolean().default(false),
  DB_LOGGING: z.coerce.boolean().default(false),
  // MongoDB (optional)
  MONGODB_URI: z.string().optional(),
  // Gemini AI
  GEMINI_API_KEY: z.string().optional(),
  // JWT (future use)
  JWT_SECRET: z.string().default("dev-secret-key"),
  JWT_EXPIRATION: z.string().default("24h"),
  // Logging
  LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]).default("info"),
  // CORS
  CORS_ORIGIN: z.string().default("*"),
  // Application
  APP_NAME: z.string().default("YurtApp"),
  APP_VERSION: z.string().default("2.0.0")
});
var cachedEnv = null;
function getEnvironment() {
  if (cachedEnv) {
    return cachedEnv;
  }
  try {
    cachedEnv = EnvSchema.parse(process.env);
    return cachedEnv;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("\u274C Environment validation failed:");
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join(".")}: ${err.message}`);
      });
    }
    throw new Error("Invalid environment configuration");
  }
}
var env = getEnvironment();

// src/infrastructure/logging/logger.ts
import pino from "pino";
var logger = pino(
  {
    level: env.LOG_LEVEL,
    transport: env.NODE_ENV === "development" ? {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:standard",
        ignore: "pid,hostname"
      }
    } : void 0,
    serializers: {
      req: (req) => ({
        id: req.id,
        method: req.method,
        url: req.url,
        headers: req.headers
      }),
      res: (res) => ({
        statusCode: res.statusCode,
        headers: res.headers
      }),
      err: pino.stdSerializers.err
    }
  }
);
var Logger = class {
  static debug(message, data) {
    logger.debug(data, message);
  }
  static info(message, data) {
    logger.info(data, message);
  }
  static warn(message, data) {
    logger.warn(data, message);
  }
  static error(message, error) {
    if (error instanceof Error) {
      logger.error({ err: error }, message);
    } else {
      logger.error(error, message);
    }
  }
  static fatal(message, error) {
    if (error instanceof Error) {
      logger.fatal({ err: error }, message);
    } else {
      logger.fatal(error, message);
    }
  }
  static trace(message, data) {
    logger.trace(data, message);
  }
  static child(bindings) {
    return logger.child(bindings);
  }
};

// src/infrastructure/database/entities/student-profile.entity.ts
import {
  Entity as Entity10,
  PrimaryColumn as PrimaryColumn10,
  Column as Column10,
  CreateDateColumn as CreateDateColumn10,
  UpdateDateColumn as UpdateDateColumn9,
  OneToOne,
  JoinColumn as JoinColumn8,
  Index as Index10
} from "typeorm";
var StudentProfileEntity = class {
};
__decorateClass([
  PrimaryColumn10("uuid")
], StudentProfileEntity.prototype, "studentId", 2);
__decorateClass([
  Column10({ type: "jsonb" })
], StudentProfileEntity.prototype, "lifestyleAnswers", 2);
__decorateClass([
  Column10({ type: "jsonb" })
], StudentProfileEntity.prototype, "vector", 2);
__decorateClass([
  Column10({ type: "simple-array", default: () => "'{}'" })
], StudentProfileEntity.prototype, "tags", 2);
__decorateClass([
  CreateDateColumn10()
], StudentProfileEntity.prototype, "analyzedAt", 2);
__decorateClass([
  UpdateDateColumn9()
], StudentProfileEntity.prototype, "updatedAt", 2);
__decorateClass([
  OneToOne(() => UserEntity, {
    onDelete: "CASCADE"
  }),
  JoinColumn8({ name: "studentId" })
], StudentProfileEntity.prototype, "student", 2);
StudentProfileEntity = __decorateClass([
  Entity10("student_profiles"),
  Index10(["studentId"], { unique: true })
], StudentProfileEntity);

// src/infrastructure/database/connection.ts
var baseOptions = {
  synchronize: env.DB_SYNCHRONIZE,
  logging: env.DB_LOGGING ? ["query", "error"] : false,
  migrationsRun: true,
  migrations: ["dist/infrastructure/migrations/**/*.js"],
  subscribers: []
};
var dataSource = null;
var dataSourcePromise = null;
async function getDataSource() {
  if (dataSource?.isInitialized) {
    return dataSource;
  }
  if (dataSourcePromise) {
    return dataSourcePromise;
  }
  dataSourcePromise = (async () => {
    try {
      const migrationsPaths = [
        "dist/infrastructure/migrations/**/*.js",
        "src/infrastructure/database/migrations/**/*.ts"
      ];
      const ds = new DataSource({
        ...baseOptions,
        type: "postgres",
        host: env.DB_HOST,
        port: env.DB_PORT,
        username: env.DB_USERNAME,
        password: env.DB_PASSWORD,
        database: env.DB_DATABASE,
        entities: [
          UserEntity,
          TenantEntity,
          RoomEntity,
          ApplicationEntity,
          PaymentEntity,
          MaintenanceRequestEntity,
          AttendanceLogEntity,
          AnnouncementEntity,
          NotificationEntity,
          StudentProfileEntity
        ],
        migrations: migrationsPaths,
        synchronize: env.NODE_ENV === "development" ? true : env.DB_SYNCHRONIZE
      });
      await ds.initialize();
      dataSource = ds;
      Logger.info("\u2705 Database connection established", {
        type: env.DB_TYPE,
        host: env.DB_HOST,
        database: env.DB_DATABASE
      });
      return dataSource;
    } catch (error) {
      dataSourcePromise = null;
      Logger.error("\u274C Database connection failed", error);
      throw error;
    }
  })();
  return dataSourcePromise;
}

// src/infrastructure/repositories/postgres/entity-mappers.ts
function mapUserEntityToDomain(entity) {
  return {
    id: entity.id,
    email: entity.email,
    name: entity.name,
    role: entity.role,
    tenantId: entity.tenantId || void 0,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString()
  };
}
function mapTenantEntityToDomain(entity) {
  return {
    id: entity.id,
    name: entity.name,
    location: entity.location,
    monthlyFee: Number(entity.monthlyFee),
    totalRooms: entity.totalRooms,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString()
  };
}
function mapRoomEntityToDomain(entity) {
  return {
    id: entity.id,
    tenantId: entity.tenantId,
    roomNumber: entity.roomNumber,
    capacity: entity.capacity,
    occupancy: entity.occupancy,
    gender: entity.gender,
    residentIds: entity.residentIds || [],
    avgSocialScore: entity.avgSocialScore !== null ? Number(entity.avgSocialScore) : void 0,
    avgDisciplineScore: entity.avgDisciplineScore !== null ? Number(entity.avgDisciplineScore) : void 0,
    avgNoiseLevel: entity.avgNoiseLevel !== null ? Number(entity.avgNoiseLevel) : void 0,
    profileTags: entity.profileTags || [],
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString()
  };
}
function mapApplicationEntityToDomain(entity) {
  return {
    id: entity.id,
    studentId: entity.studentId,
    studentName: entity.studentName,
    studentEmail: entity.studentEmail,
    preferredTenantId: entity.preferredTenantId,
    status: entity.status,
    lifestyleForm: entity.lifestyleForm,
    suggestedRoomId: entity.suggestedRoomId || void 0,
    compatibilityLog: entity.compatibilityLog || void 0,
    vector: entity.vector,
    tags: entity.tags || [],
    submittedAt: entity.submittedAt.toISOString(),
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString()
  };
}
function mapPaymentEntityToDomain(entity) {
  return {
    id: entity.id,
    studentId: entity.studentId,
    studentName: entity.studentName,
    tenantId: entity.tenantId,
    amount: Number(entity.amount),
    dueDate: entity.dueDate.toISOString().split("T")[0],
    status: entity.status,
    paymentDate: entity.paymentDate ? entity.paymentDate.toISOString() : void 0,
    transactionHash: entity.transactionHash || void 0,
    invoiceNumber: entity.invoiceNumber,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString()
  };
}
function mapMaintenanceRequestEntityToDomain(entity) {
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
    updatedAt: entity.updatedAt.toISOString()
  };
}
function mapAttendanceLogEntityToDomain(entity) {
  return {
    id: entity.id,
    studentId: entity.studentId,
    studentName: entity.studentName,
    tenantId: entity.tenantId,
    roomId: entity.roomId,
    roomNumber: entity.roomNumber,
    direction: entity.direction,
    timestamp: entity.timestamp.toISOString(),
    loggedBy: entity.loggedBy,
    createdAt: entity.createdAt.toISOString()
  };
}
function mapAnnouncementEntityToDomain(entity) {
  return {
    id: entity.id,
    tenantId: entity.tenantId || void 0,
    title: entity.title,
    content: entity.content,
    priority: entity.priority,
    targetRole: entity.targetRole,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString()
  };
}
function mapNotificationEntityToDomain(entity) {
  return {
    id: entity.id,
    userId: entity.userId,
    title: entity.title,
    message: entity.message,
    isRead: entity.isRead,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString()
  };
}
function mapStudentProfileEntityToDomain(entity) {
  return {
    studentId: entity.studentId,
    lifestyleAnswers: entity.lifestyleAnswers,
    vector: entity.vector,
    tags: entity.tags || [],
    analyzedAt: entity.analyzedAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString()
  };
}

// src/infrastructure/repositories/postgres/user.repository.ts
var PostgresUserRepository = class {
  constructor() {
    this.repositoryPromise = getDataSource().then((ds) => ds.getRepository(UserEntity));
  }
  async getAll() {
    const repo = await this.repositoryPromise;
    const entities = await repo.find();
    return entities.map(mapUserEntityToDomain);
  }
  async getById(id) {
    const repo = await this.repositoryPromise;
    const entity = await repo.findOne({ where: { id } });
    return entity ? mapUserEntityToDomain(entity) : void 0;
  }
  async getByEmail(email) {
    const repo = await this.repositoryPromise;
    const entity = await repo.findOne({ where: { email: email.toLowerCase().trim() } });
    return entity ? mapUserEntityToDomain(entity) : void 0;
  }
  async create(user) {
    const repo = await this.repositoryPromise;
    const entity = repo.create({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      tenantId: user.tenantId ?? void 0,
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt)
    });
    const saved = await repo.save(entity);
    return mapUserEntityToDomain(saved);
  }
  async update(user) {
    const repo = await this.repositoryPromise;
    await repo.update(user.id, {
      email: user.email,
      name: user.name,
      role: user.role,
      tenantId: user.tenantId ?? void 0,
      updatedAt: new Date(user.updatedAt)
    });
    const updated = await repo.findOneOrFail({ where: { id: user.id } });
    return mapUserEntityToDomain(updated);
  }
};

// src/infrastructure/repositories/postgres/tenant.repository.ts
var PostgresTenantRepository = class {
  constructor() {
    this.repositoryPromise = getDataSource().then((ds) => ds.getRepository(TenantEntity));
  }
  async getAll() {
    const repo = await this.repositoryPromise;
    const entities = await repo.find();
    return entities.map(mapTenantEntityToDomain);
  }
  async getById(id) {
    const repo = await this.repositoryPromise;
    const entity = await repo.findOne({ where: { id } });
    return entity ? mapTenantEntityToDomain(entity) : void 0;
  }
};

// src/infrastructure/repositories/postgres/room.repository.ts
var PostgresRoomRepository = class {
  constructor() {
    this.repositoryPromise = getDataSource().then((ds) => ds.getRepository(RoomEntity));
  }
  async getAll(tenantId) {
    const repo = await this.repositoryPromise;
    const entities = tenantId ? await repo.find({ where: { tenantId } }) : await repo.find();
    return entities.map(mapRoomEntityToDomain);
  }
  async getById(id) {
    const repo = await this.repositoryPromise;
    const entity = await repo.findOne({ where: { id } });
    return entity ? mapRoomEntityToDomain(entity) : void 0;
  }
  async save(room) {
    const repo = await this.repositoryPromise;
    const entity = repo.create({
      ...room,
      residentIds: room.residentIds || [],
      profileTags: room.profileTags || [],
      createdAt: new Date(room.createdAt),
      updatedAt: new Date(room.updatedAt)
    });
    const saved = await repo.save(entity);
    return mapRoomEntityToDomain(saved);
  }
};

// src/infrastructure/repositories/postgres/application.repository.ts
var PostgresApplicationRepository = class {
  constructor() {
    this.repositoryPromise = getDataSource().then((ds) => ds.getRepository(ApplicationEntity));
  }
  async getAll(tenantId) {
    const repo = await this.repositoryPromise;
    const entities = tenantId ? await repo.find({ where: { preferredTenantId: tenantId } }) : await repo.find();
    return entities.map(mapApplicationEntityToDomain);
  }
  async getById(id) {
    const repo = await this.repositoryPromise;
    const entity = await repo.findOne({ where: { id } });
    return entity ? mapApplicationEntityToDomain(entity) : void 0;
  }
  async getByStudentId(studentId) {
    const repo = await this.repositoryPromise;
    const entity = await repo.findOne({ where: { studentId } });
    return entity ? mapApplicationEntityToDomain(entity) : void 0;
  }
  async save(application) {
    const repo = await this.repositoryPromise;
    const entity = repo.create({
      id: application.id,
      studentId: application.studentId,
      preferredTenantId: application.preferredTenantId ?? null,
      studentName: application.studentName,
      studentEmail: application.studentEmail,
      status: application.status,
      lifestyleForm: application.lifestyleForm,
      suggestedRoomId: application.suggestedRoomId ?? null,
      compatibilityLog: application.compatibilityLog ?? null,
      vector: application.vector ?? null,
      tags: application.tags || [],
      submittedAt: new Date(application.submittedAt),
      createdAt: new Date(application.createdAt),
      updatedAt: new Date(application.updatedAt)
    });
    const saved = await repo.save(entity);
    return mapApplicationEntityToDomain(saved);
  }
  async deleteByStudentId(studentId) {
    const repo = await this.repositoryPromise;
    await repo.delete({ studentId });
  }
};

// src/infrastructure/repositories/postgres/payment.repository.ts
var PostgresPaymentRepository = class {
  constructor() {
    this.repositoryPromise = getDataSource().then((ds) => ds.getRepository(PaymentEntity));
  }
  async getAll(tenantId) {
    const repo = await this.repositoryPromise;
    const entities = tenantId ? await repo.find({ where: { tenantId } }) : await repo.find();
    return entities.map(mapPaymentEntityToDomain);
  }
  async getById(id) {
    const repo = await this.repositoryPromise;
    const entity = await repo.findOne({ where: { id } });
    return entity ? mapPaymentEntityToDomain(entity) : void 0;
  }
  async save(payment) {
    const repo = await this.repositoryPromise;
    const entity = repo.create({
      id: payment.id,
      studentId: payment.studentId,
      tenantId: payment.tenantId,
      studentName: payment.studentName,
      amount: payment.amount,
      dueDate: new Date(payment.dueDate),
      status: payment.status,
      paymentDate: payment.paymentDate ? new Date(payment.paymentDate) : void 0,
      transactionHash: payment.transactionHash ?? void 0,
      invoiceNumber: payment.invoiceNumber,
      createdAt: new Date(payment.createdAt),
      updatedAt: new Date(payment.updatedAt)
    });
    const saved = await repo.save(entity);
    return mapPaymentEntityToDomain(saved);
  }
};

// src/infrastructure/repositories/postgres/maintenance.repository.ts
var PostgresMaintenanceRepository = class {
  constructor() {
    this.repositoryPromise = getDataSource().then((ds) => ds.getRepository(MaintenanceRequestEntity));
  }
  async getAll(tenantId) {
    const repo = await this.repositoryPromise;
    const entities = tenantId ? await repo.find({ where: { tenantId } }) : await repo.find();
    return entities.map(mapMaintenanceRequestEntityToDomain);
  }
  async getById(id) {
    const repo = await this.repositoryPromise;
    const entity = await repo.findOne({ where: { id } });
    return entity ? mapMaintenanceRequestEntityToDomain(entity) : void 0;
  }
  async save(request) {
    const repo = await this.repositoryPromise;
    const entity = repo.create({
      ...request,
      createdAt: new Date(request.createdAt),
      updatedAt: new Date(request.updatedAt)
    });
    const saved = await repo.save(entity);
    return mapMaintenanceRequestEntityToDomain(saved);
  }
};

// src/infrastructure/repositories/postgres/attendance.repository.ts
var PostgresAttendanceRepository = class {
  constructor() {
    this.repositoryPromise = getDataSource().then((ds) => ds.getRepository(AttendanceLogEntity));
  }
  async getAll(tenantId) {
    const repo = await this.repositoryPromise;
    const entities = tenantId ? await repo.find({ where: { tenantId } }) : await repo.find();
    return entities.map(mapAttendanceLogEntityToDomain);
  }
  async save(log) {
    const repo = await this.repositoryPromise;
    const entity = repo.create({
      ...log,
      timestamp: new Date(log.timestamp),
      createdAt: log.createdAt ? new Date(log.createdAt) : void 0
    });
    const saved = await repo.save(entity);
    return mapAttendanceLogEntityToDomain(saved);
  }
};

// src/infrastructure/repositories/postgres/announcement.repository.ts
var PostgresAnnouncementRepository = class {
  constructor() {
    this.repositoryPromise = getDataSource().then((ds) => ds.getRepository(AnnouncementEntity));
  }
  async getAll(tenantId) {
    const repo = await this.repositoryPromise;
    const entities = tenantId ? await repo.find({ where: [{ tenantId }, { tenantId: void 0 }] }) : await repo.find();
    return entities.map(mapAnnouncementEntityToDomain);
  }
  async save(announcement) {
    const repo = await this.repositoryPromise;
    const entity = repo.create({
      ...announcement,
      tenantId: announcement.tenantId ?? void 0,
      createdAt: new Date(announcement.createdAt),
      updatedAt: new Date(announcement.updatedAt)
    });
    const saved = await repo.save(entity);
    return mapAnnouncementEntityToDomain(saved);
  }
};

// src/infrastructure/repositories/postgres/notification.repository.ts
var PostgresNotificationRepository = class {
  constructor() {
    this.repositoryPromise = getDataSource().then((ds) => ds.getRepository(NotificationEntity));
  }
  async getByUserId(userId) {
    const repo = await this.repositoryPromise;
    const entities = await repo.find({ where: { userId } });
    return entities.map(mapNotificationEntityToDomain);
  }
  async save(notification) {
    const repo = await this.repositoryPromise;
    const entity = repo.create({
      ...notification,
      createdAt: new Date(notification.createdAt),
      updatedAt: new Date(notification.updatedAt)
    });
    const saved = await repo.save(entity);
    return mapNotificationEntityToDomain(saved);
  }
  async markAllAsRead(userId) {
    const repo = await this.repositoryPromise;
    await repo.update({ userId }, { isRead: true, updatedAt: /* @__PURE__ */ new Date() });
  }
};

// src/infrastructure/repositories/postgres/student-profile.repository.ts
var PostgresStudentProfileRepository = class {
  constructor() {
    this.repositoryPromise = getDataSource().then((ds) => ds.getRepository(StudentProfileEntity));
  }
  async getByStudentId(studentId) {
    const repo = await this.repositoryPromise;
    const entity = await repo.findOne({ where: { studentId } });
    return entity ? mapStudentProfileEntityToDomain(entity) : void 0;
  }
  async getAll() {
    const repo = await this.repositoryPromise;
    const entities = await repo.find();
    return entities.map(mapStudentProfileEntityToDomain);
  }
  async save(profile) {
    const repo = await this.repositoryPromise;
    const entity = repo.create({
      studentId: profile.studentId,
      lifestyleAnswers: profile.lifestyleAnswers,
      vector: profile.vector ? profile.vector : void 0,
      tags: profile.tags || [],
      analyzedAt: new Date(profile.analyzedAt),
      updatedAt: new Date(profile.updatedAt)
    });
    const saved = await repo.save(entity);
    return mapStudentProfileEntityToDomain(saved);
  }
};

// src/infrastructure/database/entities/assignment-log.entity.ts
import {
  Entity as Entity11,
  PrimaryColumn as PrimaryColumn11,
  Column as Column11,
  CreateDateColumn as CreateDateColumn11,
  Index as Index11
} from "typeorm";
var AssignmentLogEntity = class {
};
__decorateClass([
  PrimaryColumn11("uuid")
], AssignmentLogEntity.prototype, "id", 2);
__decorateClass([
  Column11("uuid")
], AssignmentLogEntity.prototype, "studentId", 2);
__decorateClass([
  Column11({ type: "varchar" })
], AssignmentLogEntity.prototype, "studentName", 2);
__decorateClass([
  Column11("uuid")
], AssignmentLogEntity.prototype, "roomId", 2);
__decorateClass([
  Column11({ type: "varchar" })
], AssignmentLogEntity.prototype, "roomNumber", 2);
__decorateClass([
  Column11("uuid")
], AssignmentLogEntity.prototype, "tenantId", 2);
__decorateClass([
  Column11({ type: "numeric" })
], AssignmentLogEntity.prototype, "compatibilityScore", 2);
__decorateClass([
  Column11({ type: "numeric" })
], AssignmentLogEntity.prototype, "conflictRisk", 2);
__decorateClass([
  Column11({ type: "text" })
], AssignmentLogEntity.prototype, "explanation", 2);
__decorateClass([
  Column11({ type: "boolean" })
], AssignmentLogEntity.prototype, "isOverridden", 2);
__decorateClass([
  Column11({ type: "varchar" })
], AssignmentLogEntity.prototype, "assignedBy", 2);
__decorateClass([
  Column11({ type: "timestamp with time zone" })
], AssignmentLogEntity.prototype, "assignedAt", 2);
__decorateClass([
  CreateDateColumn11()
], AssignmentLogEntity.prototype, "createdAt", 2);
AssignmentLogEntity = __decorateClass([
  Entity11("assignment_logs"),
  Index11(["studentId"]),
  Index11(["tenantId"])
], AssignmentLogEntity);

// src/infrastructure/repositories/postgres/assignment-log.repository.ts
function mapAssignmentLogEntityToDomain(entity) {
  return {
    id: entity.id,
    studentId: entity.studentId,
    studentName: entity.studentName,
    roomId: entity.roomId,
    roomNumber: entity.roomNumber,
    tenantId: entity.tenantId,
    compatibilityScore: Number(entity.compatibilityScore),
    conflictRisk: Number(entity.conflictRisk),
    explanation: entity.explanation,
    isOverridden: entity.isOverridden,
    assignedBy: entity.assignedBy,
    assignedAt: entity.assignedAt.toISOString()
  };
}
var PostgresAssignmentLogRepository = class {
  constructor() {
    this.repositoryPromise = getDataSource().then((ds) => ds.getRepository(AssignmentLogEntity));
  }
  async getAll() {
    const repo = await this.repositoryPromise;
    const entities = await repo.find();
    return entities.map(mapAssignmentLogEntityToDomain);
  }
  async save(log) {
    const repo = await this.repositoryPromise;
    const entity = repo.create({
      ...log,
      compatibilityScore: log.compatibilityScore,
      conflictRisk: log.conflictRisk,
      assignedAt: new Date(log.assignedAt)
    });
    const saved = await repo.save(entity);
    return mapAssignmentLogEntityToDomain(saved);
  }
};

// src/application/usecases/DormInteractors.ts
import { v4 as uuidv4 } from "uuid";
function createTimestamp() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function buildInvoiceNumber(roomNumber) {
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  return `INV-${year}-${roomNumber}-${Math.floor(Math.random() * 900 + 100)}`;
}
function calculateRoomStats(residentProfiles) {
  const totals = {
    social: 0,
    discipline: 0,
    noise: 0
  };
  const tags = /* @__PURE__ */ new Set();
  residentProfiles.forEach((profile) => {
    if (profile.vector) {
      totals.social += profile.vector.social_score;
      totals.discipline += profile.vector.discipline_score;
      totals.noise += profile.vector.noise_tolerance;
    }
    profile.tags?.forEach((tag) => tags.add(tag));
  });
  const count = residentProfiles.length || 1;
  return {
    avgSocialScore: Math.round(totals.social / count),
    avgDisciplineScore: Math.round(totals.discipline / count),
    avgNoiseLevel: Math.round(totals.noise / count),
    profileTags: Array.from(tags)
  };
}
var SubmitApplicationUseCase = class {
  constructor(userRepo2, appRepo2) {
    this.userRepo = userRepo2;
    this.appRepo = appRepo2;
  }
  async execute(studentId, tenantId, form) {
    const student = await this.userRepo.getById(studentId);
    if (!student) {
      throw new Error("\xD6\u011Frenci bulunamad\u0131");
    }
    await this.appRepo.deleteByStudentId(studentId);
    const now = createTimestamp();
    const newApp = {
      id: uuidv4(),
      studentId,
      studentName: student.name,
      studentEmail: student.email,
      preferredTenantId: tenantId || void 0,
      lifestyleForm: form,
      status: "SUBMITTED" /* SUBMITTED */,
      submittedAt: now,
      createdAt: now,
      updatedAt: now,
      tags: []
    };
    return this.appRepo.save(newApp);
  }
};
var AssignRoomUseCase = class {
  constructor(appRepo2, roomRepo2, userRepo2, paymentRepo2, notifRepo2, tenantRepo2, studentProfileRepo2, assignmentLogRepo2) {
    this.appRepo = appRepo2;
    this.roomRepo = roomRepo2;
    this.userRepo = userRepo2;
    this.paymentRepo = paymentRepo2;
    this.notifRepo = notifRepo2;
    this.tenantRepo = tenantRepo2;
    this.studentProfileRepo = studentProfileRepo2;
    this.assignmentLogRepo = assignmentLogRepo2;
  }
  async execute(appId, roomId, assignedByUserId) {
    const application = await this.appRepo.getById(appId);
    if (!application) {
      throw new Error("Ba\u015Fvuru bulunamad\u0131");
    }
    const room = await this.roomRepo.getById(roomId);
    if (!room) {
      throw new Error("Oda bulunamad\u0131");
    }
    if (room.occupancy >= room.capacity) {
      throw new Error("Se\xE7ilen oda tamamen dolu");
    }
    const student = await this.userRepo.getById(application.studentId);
    if (!student) {
      throw new Error("\xD6\u011Frenci bulunamad\u0131");
    }
    student.tenantId = room.tenantId;
    student.updatedAt = createTimestamp();
    await this.userRepo.update(student);
    if (!room.residentIds.includes(application.studentId)) {
      room.residentIds.push(application.studentId);
      room.occupancy = room.residentIds.length;
    }
    const residentProfiles = (await this.studentProfileRepo.getAll()).filter(
      (profile2) => room.residentIds.includes(profile2.studentId)
    );
    if (residentProfiles.length > 0) {
      const stats = calculateRoomStats(residentProfiles);
      room.avgSocialScore = stats.avgSocialScore;
      room.avgDisciplineScore = stats.avgDisciplineScore;
      room.avgNoiseLevel = stats.avgNoiseLevel;
      room.profileTags = stats.profileTags;
    }
    room.updatedAt = createTimestamp();
    await this.roomRepo.save(room);
    const profile = {
      studentId: application.studentId,
      lifestyleAnswers: application.lifestyleForm,
      vector: application.vector || void 0,
      tags: application.tags || [],
      analyzedAt: createTimestamp(),
      updatedAt: createTimestamp()
    };
    await this.studentProfileRepo.save(profile);
    application.status = "ASSIGNED" /* ASSIGNED */;
    application.suggestedRoomId = roomId;
    application.updatedAt = createTimestamp();
    await this.appRepo.save(application);
    const tenant = await this.tenantRepo.getById(room.tenantId);
    const amount = tenant ? tenant.monthlyFee : 500;
    const payment = {
      id: uuidv4(),
      studentId: application.studentId,
      studentName: application.studentName,
      tenantId: room.tenantId,
      amount,
      dueDate: new Date((/* @__PURE__ */ new Date()).getFullYear(), (/* @__PURE__ */ new Date()).getMonth() + 1, 1).toISOString().split("T")[0],
      status: "UNPAID" /* UNPAID */,
      invoiceNumber: buildInvoiceNumber(room.roomNumber),
      createdAt: createTimestamp(),
      updatedAt: createTimestamp()
    };
    await this.paymentRepo.save(payment);
    const log = {
      id: uuidv4(),
      studentId: application.studentId,
      studentName: application.studentName,
      roomId: room.id,
      roomNumber: room.roomNumber,
      tenantId: room.tenantId,
      compatibilityScore: application.compatibilityLog?.compatibilityScore ?? 85,
      conflictRisk: application.compatibilityLog?.conflictRisk ?? 15,
      explanation: application.compatibilityLog?.matchingNotes ?? "Y\xF6netici taraf\u0131ndan manuel yerle\u015Fim atand\u0131.",
      isOverridden: assignedByUserId !== "AI",
      assignedBy: assignedByUserId,
      assignedAt: createTimestamp()
    };
    await this.assignmentLogRepo.save(log);
    await this.notifRepo.save({
      id: uuidv4(),
      userId: application.studentId,
      title: "Oda Ataman\u0131z Ger\xE7ekle\u015Fti",
      message: `Tebrikler! ${tenant?.name || "Yurdumuzda"} ${room.roomNumber} no'lu odaya yerle\u015Ftirildiniz. Keyifli konaklamalar dileriz!`,
      isRead: false,
      createdAt: createTimestamp(),
      updatedAt: createTimestamp()
    });
    return log;
  }
};
var EvictResidentUseCase = class {
  constructor(roomRepo2, userRepo2, appRepo2, studentProfileRepo2) {
    this.roomRepo = roomRepo2;
    this.userRepo = userRepo2;
    this.appRepo = appRepo2;
    this.studentProfileRepo = studentProfileRepo2;
  }
  async execute(studentId, roomId) {
    const room = await this.roomRepo.getById(roomId);
    if (!room) {
      return;
    }
    room.residentIds = room.residentIds.filter((id) => id !== studentId);
    room.occupancy = room.residentIds.length;
    const residentProfiles = (await this.studentProfileRepo.getAll()).filter(
      (profile) => room.residentIds.includes(profile.studentId)
    );
    if (residentProfiles.length > 0) {
      const stats = calculateRoomStats(residentProfiles);
      room.avgSocialScore = stats.avgSocialScore;
      room.avgDisciplineScore = stats.avgDisciplineScore;
      room.avgNoiseLevel = stats.avgNoiseLevel;
      room.profileTags = stats.profileTags;
    } else {
      room.avgSocialScore = void 0;
      room.avgDisciplineScore = void 0;
      room.avgNoiseLevel = void 0;
      room.profileTags = [];
    }
    room.updatedAt = createTimestamp();
    await this.roomRepo.save(room);
    const student = await this.userRepo.getById(studentId);
    if (student) {
      student.tenantId = void 0;
      student.updatedAt = createTimestamp();
      await this.userRepo.update(student);
    }
    await this.appRepo.deleteByStudentId(studentId);
  }
};
var PayInvoiceUseCase = class {
  constructor(paymentRepo2, notifRepo2) {
    this.paymentRepo = paymentRepo2;
    this.notifRepo = notifRepo2;
  }
  async execute(paymentId) {
    const payment = await this.paymentRepo.getById(paymentId);
    if (!payment) {
      throw new Error("Fatura kayd\u0131 bulunamad\u0131");
    }
    payment.status = "PAID" /* PAID */;
    payment.paymentDate = createTimestamp();
    payment.transactionHash = `0x${Math.random().toString(16).substring(2, 18)}`;
    payment.updatedAt = createTimestamp();
    const savedPayment = await this.paymentRepo.save(payment);
    await this.notifRepo.save({
      id: uuidv4(),
      userId: payment.studentId,
      title: "\xD6deme Onayland\u0131",
      message: `${payment.invoiceNumber} numaral\u0131 yurt faturas\u0131 \xF6demeniz (${payment.amount}) ba\u015Far\u0131yla al\u0131nm\u0131\u015Ft\u0131r. Te\u015Fekk\xFCr ederiz.`,
      isRead: false,
      createdAt: createTimestamp(),
      updatedAt: createTimestamp()
    });
    return savedPayment;
  }
};
var CreateMaintenanceUseCase = class {
  constructor(userRepo2, roomRepo2, maintRepo2) {
    this.userRepo = userRepo2;
    this.roomRepo = roomRepo2;
    this.maintRepo = maintRepo2;
  }
  async execute(studentId, title, description, category, urgency) {
    const student = await this.userRepo.getById(studentId);
    if (!student) {
      throw new Error("\xD6\u011Frenci bulunamad\u0131");
    }
    const rooms = await this.roomRepo.getAll();
    const room = rooms.find((r) => r.residentIds.includes(studentId));
    if (!room) {
      throw new Error("Bu \xF6\u011Frenciye atanm\u0131\u015F bir oda bulunamad\u0131");
    }
    const now = createTimestamp();
    const request = {
      id: uuidv4(),
      studentId,
      studentName: student.name,
      roomId: room.id,
      roomNumber: room.roomNumber,
      tenantId: student.tenantId || room.tenantId,
      title,
      description,
      category,
      status: "SUBMITTED" /* SUBMITTED */,
      urgency,
      createdAt: now,
      updatedAt: now
    };
    return this.maintRepo.save(request);
  }
};

// src/gemini.ts
import { GoogleGenAI, Type } from "@google/genai";
var apiKey = process.env.GEMINI_API_KEY || "AIzaSyDF-ORdB_NoBCSFMtBT_pOhQXuWq2uE5aE";
var ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build"
    }
  }
});
async function analyzeStudentLifestyle(answers) {
  const prompt = `Analyze this college student's lifestyle questionnaire answers to formulate a precise numerical behavioral vector (0-100 score) and characteristic tags.
Student answers:
- Sleep Schedule: ${answers.sleepSchedule}
- Cleanliness Level (1-5): ${answers.cleanlinessLevel}
- Noise Tolerance (1-5): ${answers.noiseTolerance}
- Smoking Preference: ${answers.smokingPreference}
- Social Level (1-5): ${answers.socialLevel}
- Gaming Habits: ${answers.gamingHabits}
- Study Habits: ${answers.studyHabits}
- Introvert/Extrovert scale (1=Introvert, 5=Extrovert): ${answers.introvertExtrovert}
- Conflict Tolerance (1-5): ${answers.conflictTolerance}
- Roommate Preference description: "${answers.preferredRoommateType}"

Calculate scores for:
1. social_score: how interactive they are.
2. discipline_score: focus on rules, sleep structure, and studies.
3. cleanliness_score: converted cleanliness level from 1-5 scalar to 0-100.
4. noise_tolerance: noise tolerance mapped up to 100 max.
5. night_activity_score: how active they are during typical sleep hours based on gaming, bedtime owl schedules, block study modes.

Generate 3-4 characteristics tags (all lowercase, hyphenated e.g. "night-owl", "studious", "quiet-resident").`;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a professional industrial psychologist and housing compliance analyzer at a multi-dorm university residence SaaS. Provide precise numerical profiles.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["personality_vector", "tags"],
          properties: {
            personality_vector: {
              type: Type.OBJECT,
              required: ["social_score", "discipline_score", "cleanliness_score", "noise_tolerance", "night_activity_score"],
              properties: {
                social_score: { type: Type.INTEGER, description: "A score from 0 to 100 for student social behavior." },
                discipline_score: { type: Type.INTEGER, description: "A score from 0 to 100 for student study and rules discipline." },
                cleanliness_score: { type: Type.INTEGER, description: "A score from 0 to 100 for student cleanliness." },
                noise_tolerance: { type: Type.INTEGER, description: "A score from 0 to 100 for student noise tolerance." },
                night_activity_score: { type: Type.INTEGER, description: "A score from 0 to 100 for late night activity." }
              }
            },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 to 4 characteristic tags describing the student lifestyle profile."
            }
          }
        }
      }
    });
    const text = response.text || "";
    return JSON.parse(text);
  } catch (err) {
    console.error("Gemini lifestyle analysis failed. Using math fallback:", err);
    const cleanliness_score = Math.min(Math.max(answers.cleanlinessLevel * 20, 0), 100);
    const noise_tolerance = Math.min(Math.max(answers.noiseTolerance * 20, 0), 100);
    const social_score = Math.min(Math.max(answers.socialLevel * 20, 0), 100);
    const night_activity_score = answers.sleepSchedule === "night-owl" ? 85 : answers.sleepSchedule === "early-bird" ? 20 : 50;
    const discipline_score = answers.studyHabits === "solo-quiet" ? 80 : 50;
    const tags = [
      answers.sleepSchedule,
      answers.gamingHabits === "frequent" ? "gamer" : "casual-user",
      answers.cleanlinessLevel >= 4 ? "tidiness-oriented" : "relaxed-profile"
    ];
    return {
      personality_vector: {
        social_score,
        discipline_score,
        cleanliness_score,
        noise_tolerance,
        night_activity_score
      },
      tags
    };
  }
}
async function explainRoomCompatibility(applicant, room, residents) {
  const residentTexts = residents.map((r, i) => {
    return `Resident ${i + 1} lifestyle answers: ${JSON.stringify(r.lifestyleAnswers)}, tags: ${JSON.stringify(r.tags)}`;
  }).join("\n");
  const prompt = `Assess the roommate compatibility and potential conflicts between an applicant and existing residents of room ${room.roomNumber} (Capacity: ${room.capacity}).
Applicant Name: ${applicant.name}
Applicant lifestyle Answers: ${JSON.stringify(applicant.answers)}

Existing Residents in Room (${room.occupancy}/${room.capacity}):
${residents.length === 0 ? "This room is currently empty. Compare applicant expectations to general dorm structures." : residentTexts}

Analyze conflicts on:
1. Sleep schedule overlap (e.g. night-owl vs early-bird conflicts).
2. Cleanliness friction (tidy vs messy).
3. Socializing/noise vs peace expectations.
4. Smoking mismatch (this is a CRITICAL conflict; smoker and non-smoker should trigger heavily lower score and high risk).

Output a numeric compatibility score (0 to 100), a conflict risk percentage (0 to 100), and a concise, explainable matching review notes statement.`;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert student housing allocation advisor. Provide structured, fair, and high-quality reviews.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["compatibilityScore", "conflictRisk", "matchingNotes"],
          properties: {
            compatibilityScore: { type: Type.INTEGER, description: "A calculated score from 0 (terrible) to 100 (excellent)." },
            conflictRisk: { type: Type.INTEGER, description: "Estimated conflict friction probability from 0% to 100%." },
            matchingNotes: { type: Type.STRING, description: "A detailed explanation of why they fit, highlight issues (e.g. sleep/noise) if any." }
          }
        }
      }
    });
    const text = response.text || "";
    return JSON.parse(text);
  } catch (err) {
    console.error("Gemini room compatibility calculation failed, backing up to rule-based analysis:", err);
    if (residents.length === 0) {
      return {
        compatibilityScore: 90,
        conflictRisk: 5,
        matchingNotes: "Allocated to empty room. Applicant expectations match general building rules perfectly."
      };
    }
    let totalScore = 0;
    let totalRisk = 0;
    for (const resident of residents) {
      let score = 100;
      let risk = 0;
      if (applicant.answers.sleepSchedule !== resident.lifestyleAnswers.sleepSchedule) {
        if (applicant.answers.sleepSchedule === "early-bird" && resident.lifestyleAnswers.sleepSchedule === "night-owl" || applicant.answers.sleepSchedule === "night-owl" && resident.lifestyleAnswers.sleepSchedule === "early-bird") {
          score -= 25;
          risk += 35;
        } else {
          score -= 10;
          risk += 15;
        }
      }
      const cleanDiff = Math.abs(applicant.answers.cleanlinessLevel - resident.lifestyleAnswers.cleanlinessLevel);
      score -= cleanDiff * 8;
      risk += cleanDiff * 12;
      if (applicant.answers.smokingPreference === "smoker" && resident.lifestyleAnswers.smokingPreference === "non-smoker" || applicant.answers.smokingPreference === "non-smoker" && resident.lifestyleAnswers.smokingPreference === "smoker") {
        score -= 40;
        risk += 60;
      }
      const socialDiff = Math.abs(applicant.answers.socialLevel - resident.lifestyleAnswers.socialLevel);
      score -= socialDiff * 5;
      risk += socialDiff * 8;
      totalScore += score;
      totalRisk += risk;
    }
    const avgScore = Math.max(0, Math.min(Math.round(totalScore / residents.length), 100));
    const avgRisk = Math.max(0, Math.min(Math.round(totalRisk / residents.length), 100));
    return {
      compatibilityScore: avgScore,
      conflictRisk: avgRisk,
      matchingNotes: `Evaluated programmatically with a score of ${avgScore}% compatibility and ${avgRisk}% conflict risk estimation based on lifestyle differentials.`
    };
  }
}

// server.ts
import https from "https";
var app = express();
app.use(express.json());
var userRepo = new PostgresUserRepository();
var tenantRepo = new PostgresTenantRepository();
var roomRepo = new PostgresRoomRepository();
var appRepo = new PostgresApplicationRepository();
var paymentRepo = new PostgresPaymentRepository();
var maintRepo = new PostgresMaintenanceRepository();
var attendanceRepo = new PostgresAttendanceRepository();
var announcementRepo = new PostgresAnnouncementRepository();
var notifRepo = new PostgresNotificationRepository();
var studentProfileRepo = new PostgresStudentProfileRepository();
var assignmentLogRepo = new PostgresAssignmentLogRepository();
var submitAppUseCase = new SubmitApplicationUseCase(userRepo, appRepo);
var assignRoomUseCase = new AssignRoomUseCase(
  appRepo,
  roomRepo,
  userRepo,
  paymentRepo,
  notifRepo,
  tenantRepo,
  studentProfileRepo,
  assignmentLogRepo
);
var evictUseCase = new EvictResidentUseCase(roomRepo, userRepo, appRepo, studentProfileRepo);
var payInvoiceUseCase = new PayInvoiceUseCase(paymentRepo, notifRepo);
var createMaintUseCase = new CreateMaintenanceUseCase(userRepo, roomRepo, maintRepo);
async function createInAppNotification(userId, title, message) {
  const newNotif = {
    id: uuidv42(),
    userId,
    title,
    message,
    isRead: false,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  return notifRepo.save(newNotif);
}
app.get("/api/state", async (req, res) => {
  try {
    return res.json({
      users: await userRepo.getAll(),
      tenants: await tenantRepo.getAll(),
      rooms: await roomRepo.getAll(),
      applications: await appRepo.getAll(),
      payments: await paymentRepo.getAll(),
      maintenance: await maintRepo.getAll(),
      attendance: await attendanceRepo.getAll(),
      announcements: await announcementRepo.getAll()
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "E-posta adresi gereklidir" });
    }
    const foundUser = await userRepo.getByEmail(email);
    if (!foundUser) {
      const newStudent = {
        id: uuidv42(),
        email: email.toLowerCase().trim(),
        name: email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        role: "STUDENT" /* STUDENT */,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      await userRepo.create(newStudent);
      return res.json({ user: newStudent, message: "Sisteme \xD6\u011Frenci olarak otomatik kayd\u0131n\u0131z yap\u0131ld\u0131!" });
    }
    return res.json({ user: foundUser });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
app.post("/api/auth/register-custom", async (req, res) => {
  try {
    const { email, name, role, tenantId } = req.body;
    if (!email || !name || !role) {
      return res.status(400).json({ error: "E-posta, ad soyad ve rol gereklidir." });
    }
    const newUser = {
      id: uuidv42(),
      email: email.toLowerCase().trim(),
      name,
      role,
      tenantId: tenantId || void 0,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    await userRepo.create(newUser);
    return res.json({ user: newUser });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
app.get("/api/tenants", async (req, res) => {
  return res.json(await tenantRepo.getAll());
});
app.get("/api/rooms", async (req, res) => {
  const { tenantId } = req.query;
  return res.json(await roomRepo.getAll(tenantId));
});
app.get("/api/applications", async (req, res) => {
  const { tenantId } = req.query;
  return res.json(await appRepo.getAll(tenantId));
});
app.post("/api/applications/submit", async (req, res) => {
  try {
    const { studentId, preferredTenantId, lifestyleForm } = req.body;
    if (!studentId || !lifestyleForm) {
      return res.status(400).json({ error: "Eksik parametreler" });
    }
    const appRecord = await submitAppUseCase.execute(studentId, preferredTenantId, lifestyleForm);
    return res.json(appRecord);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
app.post("/api/applications/:id/analyze", async (req, res) => {
  try {
    const appId = req.params.id;
    const { tenantId } = req.body;
    const application = await appRepo.getById(appId);
    if (!application) {
      return res.status(404).json({ error: "Ba\u015Fvuru kayd\u0131 bulunamad\u0131" });
    }
    const analysis = await analyzeStudentLifestyle(application.lifestyleForm);
    const targetTenant = tenantId || application.preferredTenantId;
    const candidateRooms = (await roomRepo.getAll(targetTenant)).filter((r) => r.occupancy < r.capacity);
    let ultimateMatch = null;
    if (candidateRooms.length > 0) {
      let absoluteBestScore = -1;
      const storedProfiles = await studentProfileRepo.getAll();
      for (const room of candidateRooms) {
        const residents = storedProfiles.filter((profile) => room.residentIds.includes(profile.studentId));
        const evaluation = await explainRoomCompatibility(
          {
            name: application.studentName,
            answers: application.lifestyleForm,
            vector: analysis.personality_vector
          },
          room,
          residents
        );
        if (evaluation.compatibilityScore > absoluteBestScore) {
          absoluteBestScore = evaluation.compatibilityScore;
          ultimateMatch = {
            roomId: room.id,
            roomNumber: room.roomNumber,
            compatibilityScore: evaluation.compatibilityScore,
            conflictRisk: evaluation.conflictRisk,
            matchingNotes: evaluation.matchingNotes,
            vector: analysis.personality_vector,
            tags: analysis.tags
          };
        }
      }
    }
    if (!ultimateMatch && candidateRooms.length > 0) {
      const defaultRoom = candidateRooms[0];
      ultimateMatch = {
        roomId: defaultRoom.id,
        roomNumber: defaultRoom.roomNumber,
        compatibilityScore: 85,
        conflictRisk: 10,
        matchingNotes: "\xD6n tan\u0131ml\u0131 odaya e\u015Fle\u015Fme parametrelerine uygun \u015Fekilde yerle\u015Fim yap\u0131ld\u0131.",
        vector: analysis.personality_vector,
        tags: analysis.tags
      };
    } else if (!ultimateMatch) {
      ultimateMatch = {
        roomId: null,
        roomNumber: "UYGUN ODA YOK",
        compatibilityScore: 0,
        conflictRisk: 100,
        matchingNotes: "Yurtta tamamen doluluk var! Uygun yer bulunamad\u0131. Y\xF6netici m\xFCdahalesi gereklidir.",
        vector: analysis.personality_vector,
        tags: analysis.tags
      };
    }
    application.status = "AI_MATCHED" /* AI_MATCHED */;
    application.suggestedRoomId = ultimateMatch.roomId;
    application.compatibilityLog = {
      compatibilityScore: ultimateMatch.compatibilityScore,
      conflictRisk: ultimateMatch.conflictRisk,
      matchingNotes: ultimateMatch.matchingNotes
    };
    if (ultimateMatch.vector) {
      application.vector = ultimateMatch.vector;
    }
    if (ultimateMatch.tags) {
      application.tags = ultimateMatch.tags;
    }
    await appRepo.save(application);
    return res.json(application);
  } catch (err) {
    console.error("AI Allocation error: ", err);
    return res.status(500).json({ error: err.message });
  }
});
app.post("/api/applications/:id/assign", async (req, res) => {
  try {
    const appId = req.params.id;
    const { roomId, assignedBy } = req.body;
    if (!roomId) {
      return res.status(400).json({ error: "roomId gereklidir" });
    }
    const log = await assignRoomUseCase.execute(appId, roomId, assignedBy || "DORM_ADMIN");
    return res.json({ success: true, log });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
app.post("/api/rooms/:roomId/evict", async (req, res) => {
  try {
    const { roomId } = req.params;
    const { studentId } = req.body;
    if (!studentId) {
      return res.status(400).json({ error: "studentId bo\u015F olamaz" });
    }
    await evictUseCase.execute(studentId, roomId);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
app.get("/api/payments", async (req, res) => {
  const { tenantId, studentId } = req.query;
  let list = await paymentRepo.getAll(tenantId);
  if (studentId) {
    list = list.filter((p) => p.studentId === studentId);
  }
  res.json(list);
});
app.post("/api/payments/:id/pay", async (req, res) => {
  try {
    const payId = req.params.id;
    const updated = await payInvoiceUseCase.execute(payId);
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
app.get("/api/maintenance", async (req, res) => {
  const { tenantId, studentId } = req.query;
  let list = await maintRepo.getAll(tenantId);
  if (studentId) {
    list = list.filter((m) => m.studentId === studentId);
  }
  res.json(list);
});
app.post("/api/maintenance/create", async (req, res) => {
  try {
    const { studentId, title, description, category, urgency } = req.body;
    if (!studentId || !title || !description || !category || !urgency) {
      return res.status(400).json({ error: "Eksik parametreler girdiniz." });
    }
    const newReq = await createMaintUseCase.execute(studentId, title, description, category, urgency);
    return res.json(newReq);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
app.post("/api/maintenance/:id/update", async (req, res) => {
  try {
    const reqId = req.params.id;
    const { status, staffUpdate } = req.body;
    const reqInstance = await maintRepo.getById(reqId);
    if (!reqInstance) throw new Error("Ar\u0131za kayd\u0131 bulunamad\u0131");
    reqInstance.status = status;
    if (staffUpdate) {
      reqInstance.staffUpdate = staffUpdate;
    }
    reqInstance.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    await maintRepo.save(reqInstance);
    await createInAppNotification(
      reqInstance.studentId,
      `Talebiniz G\xFCncellendi: ${reqInstance.title}`,
      `Ar\u0131za talebinizin son durumu: ${status}. G\xF6revli notu: ${staffUpdate || "Yok"}`
    );
    return res.json(reqInstance);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
app.get("/api/attendance", async (req, res) => {
  const { tenantId, studentId } = req.query;
  let list = await attendanceRepo.getAll(tenantId);
  if (studentId) {
    list = list.filter((l) => l.studentId === studentId);
  }
  res.json(list);
});
app.post("/api/attendance/log", async (req, res) => {
  try {
    const { studentId, direction, loggedBy } = req.body;
    if (!studentId || !direction) {
      return res.status(400).json({ error: "Eksik parametre girdiniz." });
    }
    const student = await userRepo.getById(studentId);
    if (!student) throw new Error("\xD6\u011Frenci bulunamad\u0131");
    const rooms = await roomRepo.getAll();
    const room = rooms.find((r) => r.residentIds.includes(studentId));
    const roomNo = room ? room.roomNumber : "YOK";
    const newLog = {
      id: uuidv42(),
      studentId,
      studentName: student.name,
      tenantId: student.tenantId ?? void 0,
      roomId: room?.id,
      roomNumber: roomNo,
      direction,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      loggedBy: loggedBy || "QR RFID Taray\u0131c\u0131 Terminal",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    await attendanceRepo.save(newLog);
    return res.json(newLog);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
app.get("/api/announcements", async (req, res) => {
  const { tenantId } = req.query;
  return res.json(await announcementRepo.getAll(tenantId));
});
app.post("/api/announcements/create", async (req, res) => {
  try {
    const { tenantId, title, content, priority, targetRole } = req.body;
    if (!title || !content || !priority) {
      return res.status(400).json({ error: "Eksik duyuru detaylar\u0131." });
    }
    const newAnn = {
      id: uuidv42(),
      tenantId: tenantId || void 0,
      title,
      content,
      priority,
      targetRole: targetRole || void 0,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    await announcementRepo.save(newAnn);
    return res.json(newAnn);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
app.get("/api/notifications/:userId", async (req, res) => {
  return res.json(await notifRepo.getByUserId(req.params.userId));
});
app.post("/api/notifications/:userId/mark-read", async (req, res) => {
  try {
    await notifRepo.markAllAsRead(req.params.userId);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
app.get("/api/dashboard/stats", async (req, res) => {
  try {
    const { tenantId } = req.query;
    let targetRooms = await roomRepo.getAll();
    let targetPayments = await paymentRepo.getAll();
    let targetMaint = await maintRepo.getAll();
    let targetApps = await appRepo.getAll();
    if (tenantId) {
      targetRooms = await roomRepo.getAll(tenantId);
      targetPayments = await paymentRepo.getAll(tenantId);
      targetMaint = await maintRepo.getAll(tenantId);
      targetApps = await appRepo.getAll(tenantId);
    }
    const totalBeds = targetRooms.reduce((sum, r) => sum + r.capacity, 0);
    const occupiedBeds = targetRooms.reduce((sum, r) => sum + r.occupancy, 0);
    const availableBeds = totalBeds - occupiedBeds;
    const occupancyRate = totalBeds > 0 ? Math.round(occupiedBeds / totalBeds * 100) : 0;
    const unpaidPayments = targetPayments.filter((p) => p.status === "UNPAID" || p.status === "OVERDUE");
    const unpaidDebtSum = unpaidPayments.reduce((sum, p) => sum + p.amount, 0);
    const activeMaint = targetMaint.filter((m) => m.status !== "COMPLETED").length;
    const submittedAppsCount = targetApps.filter((a) => a.status === "SUBMITTED" /* SUBMITTED */).length;
    const matchedAppsCount = targetApps.filter((a) => a.status === "AI_MATCHED" /* AI_MATCHED */).length;
    const assignedAppsCount = targetApps.filter((a) => a.status === "ASSIGNED" /* ASSIGNED */).length;
    let targetLogs = await assignmentLogRepo.getAll();
    if (tenantId) {
      targetLogs = targetLogs.filter((l) => l.tenantId === tenantId);
    }
    const avgScore = targetLogs.length > 0 ? Math.round(targetLogs.reduce((sum, l) => sum + l.compatibilityScore, 0) / targetLogs.length) : 88;
    return res.json({
      dormName: tenantId ? (await tenantRepo.getById(tenantId))?.name || "Yurt" : "T\xFCm Yurtlar",
      occupancyRate,
      totalBeds,
      occupiedBeds,
      availableBeds,
      unpaidDebtSum,
      unpaidCount: unpaidPayments.length,
      activeMaintenanceRequests: activeMaint,
      appStats: {
        submitted: submittedAppsCount,
        matched: matchedAppsCount,
        assigned: assignedAppsCount,
        total: targetApps.length
      },
      aiAssignmentSuccessScore: avgScore
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
var startServer = async () => {
  const isProduction = process.env.NODE_ENV === "production" || fs.existsSync(path.join(process.cwd(), "dist"));
  if (!isProduction) {
    console.log("Starting backend with active Vite-development middleware...");
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    console.log("\u{1F4C2} Sunucu statik dosyalar\u0131 \u015Furada ar\u0131yor:", distPath);
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      if (req.originalUrl.includes(".")) {
        console.error(`\u{1F6A8} HATA: Taray\u0131c\u0131 "${req.originalUrl}" dosyas\u0131n\u0131 istedi ama ${distPath} i\xE7inde bulunamad\u0131!`);
        return res.status(404).send("Dosya bulunamad\u0131");
      }
      return res.sendFile(path.join(distPath, "index.html"));
    });
  }
  const sslOptions = {
    // En dış klasördeki dümdüz 'key.pem' ve 'cert.pem' dosyalarına bak diyoruz
    key: fs.readFileSync(path.resolve(process.cwd(), "key.pem")),
    cert: fs.readFileSync(path.resolve(process.cwd(), "cert.pem"))
  };
  https.createServer(sslOptions, app).listen(3e3, () => {
    console.log("\u{1F680} G\xFCvenli HTTPS Sunucusu Port: 3000 \xFCzerinde dinliyor");
  });
};
startServer().catch((err) => {
  console.error("Express failed to spin up gracefully:", err);
});
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
//# sourceMappingURL=server.mjs.map
