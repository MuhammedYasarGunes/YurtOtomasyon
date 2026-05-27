/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  IUserRepository,
  ITenantRepository,
  IRoomRepository,
  IApplicationRepository,
  IPaymentRepository,
  IMaintenanceRepository,
  IAttendanceRepository,
  IAnnouncementRepository,
  INotificationRepository,
  IStudentProfileRepository,
  IAssignmentLogRepository
} from "./src/domain/repositories/interfaces.js";
import {
  JSONUserRepository,
  JSONTenantRepository,
  JSONRoomRepository,
  JSONApplicationRepository,
  JSONPaymentRepository,
  JSONMaintenanceRepository,
  JSONAttendanceRepository,
  JSONAnnouncementRepository,
  JSONNotificationRepository,
  JSONStudentProfileRepository,
  JSONAssignmentLogRepository
} from "./src/infrastructure/repositories/JSONRepositories.js";
import {
  SubmitApplicationUseCase,
  AssignRoomUseCase,
  EvictResidentUseCase,
  PayInvoiceUseCase,
  CreateMaintenanceUseCase
} from "./src/application/usecases/DormInteractors.js";

/**
 * Dependency Injection Container
 * Centralizes all dependency instantiation
 */
export class Container {
  private static instance: Container;

  // Repositories
  private userRepository: IUserRepository;
  private tenantRepository: ITenantRepository;
  private roomRepository: IRoomRepository;
  private applicationRepository: IApplicationRepository;
  private paymentRepository: IPaymentRepository;
  private maintenanceRepository: IMaintenanceRepository;
  private attendanceRepository: IAttendanceRepository;
  private announcementRepository: IAnnouncementRepository;
  private notificationRepository: INotificationRepository;
  private studentProfileRepository: IStudentProfileRepository;
  private assignmentLogRepository: IAssignmentLogRepository;

  // Use cases
  private submitApplicationUseCase: SubmitApplicationUseCase;
  private assignRoomUseCase: AssignRoomUseCase;
  private evictResidentUseCase: EvictResidentUseCase;
  private payInvoiceUseCase: PayInvoiceUseCase;
  private createMaintenanceUseCase: CreateMaintenanceUseCase;

  private constructor() {
    // Initialize repositories
    this.userRepository = new JSONUserRepository();
    this.tenantRepository = new JSONTenantRepository();
    this.roomRepository = new JSONRoomRepository();
    this.applicationRepository = new JSONApplicationRepository();
    this.paymentRepository = new JSONPaymentRepository();
    this.maintenanceRepository = new JSONMaintenanceRepository();
    this.attendanceRepository = new JSONAttendanceRepository();
    this.announcementRepository = new JSONAnnouncementRepository();
    this.notificationRepository = new JSONNotificationRepository();
    this.studentProfileRepository = new JSONStudentProfileRepository();
    this.assignmentLogRepository = new JSONAssignmentLogRepository();

    // Initialize use cases with injected dependencies
    this.submitApplicationUseCase = new SubmitApplicationUseCase(
      this.userRepository,
      this.applicationRepository
    );

    this.assignRoomUseCase = new AssignRoomUseCase(
      this.applicationRepository,
      this.roomRepository,
      this.userRepository,
      this.paymentRepository,
      this.notificationRepository,
      this.tenantRepository,
      this.studentProfileRepository,
      this.assignmentLogRepository
    );

    this.evictResidentUseCase = new EvictResidentUseCase(
      this.roomRepository,
      this.userRepository,
      this.applicationRepository
    );

    this.payInvoiceUseCase = new PayInvoiceUseCase(
      this.paymentRepository,
      this.notificationRepository
    );

    this.createMaintenanceUseCase = new CreateMaintenanceUseCase(
      this.userRepository,
      this.roomRepository,
      this.maintenanceRepository
    );
  }

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  // Repository getters
  getUserRepository(): IUserRepository {
    return this.userRepository;
  }

  getTenantRepository(): ITenantRepository {
    return this.tenantRepository;
  }

  getRoomRepository(): IRoomRepository {
    return this.roomRepository;
  }

  getApplicationRepository(): IApplicationRepository {
    return this.applicationRepository;
  }

  getPaymentRepository(): IPaymentRepository {
    return this.paymentRepository;
  }

  getMaintenanceRepository(): IMaintenanceRepository {
    return this.maintenanceRepository;
  }

  getAttendanceRepository(): IAttendanceRepository {
    return this.attendanceRepository;
  }

  getAnnouncementRepository(): IAnnouncementRepository {
    return this.announcementRepository;
  }

  getNotificationRepository(): INotificationRepository {
    return this.notificationRepository;
  }

  getStudentProfileRepository(): IStudentProfileRepository {
    return this.studentProfileRepository;
  }

  getAssignmentLogRepository(): IAssignmentLogRepository {
    return this.assignmentLogRepository;
  }

  // Use case getters
  getSubmitApplicationUseCase(): SubmitApplicationUseCase {
    return this.submitApplicationUseCase;
  }

  getAssignRoomUseCase(): AssignRoomUseCase {
    return this.assignRoomUseCase;
  }

  getEvictResidentUseCase(): EvictResidentUseCase {
    return this.evictResidentUseCase;
  }

  getPayInvoiceUseCase(): PayInvoiceUseCase {
    return this.payInvoiceUseCase;
  }

  getCreateMaintenanceUseCase(): CreateMaintenanceUseCase {
    return this.createMaintenanceUseCase;
  }

  /**
   * Reset container (useful for testing)
   */
  static reset(): void {
    Container.instance = new Container();
  }
}
