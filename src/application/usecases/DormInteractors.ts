import { v4 as uuidv4 } from 'uuid';
import {
  IUserRepository,
  ITenantRepository,
  IRoomRepository,
  IApplicationRepository,
  IPaymentRepository,
  IMaintenanceRepository,
  INotificationRepository,
  IStudentProfileRepository,
  IAssignmentLogRepository,
} from '../../domain/repositories/interfaces.js';
import {
  Application,
  ApplicationStatus,
  AssignmentLog,
  BehavioralVector,
  LifestyleForm,
  MaintenanceRequest,
  MaintenanceStatus,
  MaintenanceUrgency,
  Payment,
  PaymentStatus,
  Room,
  StudentProfile,
  User,
  UserRole,
} from '../../domain/types.js';

function createTimestamp(): string {
  return new Date().toISOString();
}

function buildInvoiceNumber(roomNumber: string): string {
  const year = new Date().getFullYear();
  return `INV-${year}-${roomNumber}-${Math.floor(Math.random() * 900 + 100)}`;
}

function calculateRoomStats(residentProfiles: StudentProfile[]) {
  const totals = {
    social: 0,
    discipline: 0,
    noise: 0,
  };
  const tags = new Set<string>();

  residentProfiles.forEach(profile => {
    if (profile.vector) {
      totals.social += profile.vector.social_score;
      totals.discipline += profile.vector.discipline_score;
      totals.noise += profile.vector.noise_tolerance;
    }
    profile.tags?.forEach(tag => tags.add(tag));
  });

  const count = residentProfiles.length || 1;

  return {
    avgSocialScore: Math.round(totals.social / count),
    avgDisciplineScore: Math.round(totals.discipline / count),
    avgNoiseLevel: Math.round(totals.noise / count),
    profileTags: Array.from(tags),
  };
}

export class SubmitApplicationUseCase {
  constructor(
    private userRepo: IUserRepository,
    private appRepo: IApplicationRepository
  ) {}

  async execute(studentId: string, tenantId: string, form: LifestyleForm): Promise<Application> {
    const student = await this.userRepo.getById(studentId);
    if (!student) {
      throw new Error('Öğrenci bulunamadı');
    }

    await this.appRepo.deleteByStudentId(studentId);

    const now = createTimestamp();
    const newApp: Application = {
      id: uuidv4(),
      studentId,
      studentName: student.name,
      studentEmail: student.email,
      preferredTenantId: tenantId,
      lifestyleForm: form,
      status: ApplicationStatus.SUBMITTED,
      submittedAt: now,
      createdAt: now,
      updatedAt: now,
      tags: [],
    };

    return this.appRepo.save(newApp);
  }
}

export class AssignRoomUseCase {
  constructor(
    private appRepo: IApplicationRepository,
    private roomRepo: IRoomRepository,
    private userRepo: IUserRepository,
    private paymentRepo: IPaymentRepository,
    private notifRepo: INotificationRepository,
    private tenantRepo: ITenantRepository,
    private studentProfileRepo: IStudentProfileRepository,
    private assignmentLogRepo: IAssignmentLogRepository
  ) {}

  async execute(appId: string, roomId: string, assignedByUserId: string): Promise<AssignmentLog> {
    const application = await this.appRepo.getById(appId);
    if (!application) {
      throw new Error('Başvuru bulunamadı');
    }

    const room = await this.roomRepo.getById(roomId);
    if (!room) {
      throw new Error('Oda bulunamadı');
    }

    if (room.occupancy >= room.capacity) {
      throw new Error('Seçilen oda tamamen dolu');
    }

    const student = await this.userRepo.getById(application.studentId);
    if (!student) {
      throw new Error('Öğrenci bulunamadı');
    }

    student.tenantId = room.tenantId;
    student.updatedAt = createTimestamp();
    await this.userRepo.update(student);

    if (!room.residentIds.includes(application.studentId)) {
      room.residentIds.push(application.studentId);
      room.occupancy = room.residentIds.length;
    }

    const residentProfiles = (await this.studentProfileRepo.getAll()).filter(profile =>
      room.residentIds.includes(profile.studentId)
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

    const profile: StudentProfile = {
      studentId: application.studentId,
      lifestyleAnswers: application.lifestyleForm,
      vector: application.vector || undefined,
      tags: application.tags || [],
      analyzedAt: createTimestamp(),
      updatedAt: createTimestamp(),
    };
    await this.studentProfileRepo.save(profile);

    application.status = ApplicationStatus.ASSIGNED;
    application.suggestedRoomId = roomId;
    application.updatedAt = createTimestamp();
    await this.appRepo.save(application);

    const tenant = await this.tenantRepo.getById(room.tenantId);
    const amount = tenant ? tenant.monthlyFee : 500;

    const payment: Payment = {
      id: uuidv4(),
      studentId: application.studentId,
      studentName: application.studentName,
      tenantId: room.tenantId,
      amount,
      dueDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
        .toISOString()
        .split('T')[0],
      status: PaymentStatus.UNPAID,
      invoiceNumber: buildInvoiceNumber(room.roomNumber),
      createdAt: createTimestamp(),
      updatedAt: createTimestamp(),
    };
    await this.paymentRepo.save(payment);

    const log: AssignmentLog = {
      id: uuidv4(),
      studentId: application.studentId,
      studentName: application.studentName,
      roomId: room.id,
      roomNumber: room.roomNumber,
      tenantId: room.tenantId,
      compatibilityScore: application.compatibilityLog?.compatibilityScore ?? 85,
      conflictRisk: application.compatibilityLog?.conflictRisk ?? 15,
      explanation: application.compatibilityLog?.matchingNotes ?? 'Yönetici tarafından manuel yerleşim atandı.',
      isOverridden: assignedByUserId !== 'AI',
      assignedBy: assignedByUserId,
      assignedAt: createTimestamp(),
    };

    await this.assignmentLogRepo.save(log);

    await this.notifRepo.save({
      id: uuidv4(),
      userId: application.studentId,
      title: 'Oda Atamanız Gerçekleşti',
      message: `Tebrikler! ${tenant?.name || 'Yurdumuzda'} ${room.roomNumber} no'lu odaya yerleştirildiniz. Keyifli konaklamalar dileriz!`,
      isRead: false,
      createdAt: createTimestamp(),
      updatedAt: createTimestamp(),
    });

    return log;
  }
}

export class EvictResidentUseCase {
  constructor(
    private roomRepo: IRoomRepository,
    private userRepo: IUserRepository,
    private appRepo: IApplicationRepository,
    private studentProfileRepo: IStudentProfileRepository
  ) {}

  async execute(studentId: string, roomId: string): Promise<void> {
    const room = await this.roomRepo.getById(roomId);
    if (!room) {
      return;
    }

    room.residentIds = room.residentIds.filter(id => id !== studentId);
    room.occupancy = room.residentIds.length;

    const residentProfiles = (await this.studentProfileRepo.getAll()).filter(profile =>
      room.residentIds.includes(profile.studentId)
    );

    if (residentProfiles.length > 0) {
      const stats = calculateRoomStats(residentProfiles);
      room.avgSocialScore = stats.avgSocialScore;
      room.avgDisciplineScore = stats.avgDisciplineScore;
      room.avgNoiseLevel = stats.avgNoiseLevel;
      room.profileTags = stats.profileTags;
    } else {
      room.avgSocialScore = undefined;
      room.avgDisciplineScore = undefined;
      room.avgNoiseLevel = undefined;
      room.profileTags = [];
    }

    room.updatedAt = createTimestamp();
    await this.roomRepo.save(room);

    const student = await this.userRepo.getById(studentId);
    if (student) {
      student.tenantId = undefined;
      student.updatedAt = createTimestamp();
      await this.userRepo.update(student);
    }

    await this.appRepo.deleteByStudentId(studentId);
  }
}

export class PayInvoiceUseCase {
  constructor(
    private paymentRepo: IPaymentRepository,
    private notifRepo: INotificationRepository
  ) {}

  async execute(paymentId: string): Promise<Payment> {
    const payment = await this.paymentRepo.getById(paymentId);
    if (!payment) {
      throw new Error('Fatura kaydı bulunamadı');
    }

    payment.status = PaymentStatus.PAID;
    payment.paymentDate = createTimestamp();
    payment.transactionHash = `0x${Math.random().toString(16).substring(2, 18)}`;
    payment.updatedAt = createTimestamp();

    const savedPayment = await this.paymentRepo.save(payment);

    await this.notifRepo.save({
      id: uuidv4(),
      userId: payment.studentId,
      title: 'Ödeme Onaylandı',
      message: `${payment.invoiceNumber} numaralı yurt faturası ödemeniz (${payment.amount}) başarıyla alınmıştır. Teşekkür ederiz.`,
      isRead: false,
      createdAt: createTimestamp(),
      updatedAt: createTimestamp(),
    });

    return savedPayment;
  }
}

export class CreateMaintenanceUseCase {
  constructor(
    private userRepo: IUserRepository,
    private roomRepo: IRoomRepository,
    private maintRepo: IMaintenanceRepository
  ) {}

  async execute(
    studentId: string,
    title: string,
    description: string,
    category: string,
    urgency: string
  ): Promise<MaintenanceRequest> {
    const student = await this.userRepo.getById(studentId);
    if (!student) {
      throw new Error('Öğrenci bulunamadı');
    }

    const rooms = await this.roomRepo.getAll();
    const room = rooms.find(r => r.residentIds.includes(studentId));
    if (!room) {
      throw new Error('Bu öğrenciye atanmış bir oda bulunamadı');
    }

    const now = createTimestamp();
    const request: MaintenanceRequest = {
      id: uuidv4(),
      studentId,
      studentName: student.name,
      roomId: room.id,
      roomNumber: room.roomNumber,
      tenantId: student.tenantId || room.tenantId,
      title,
      description,
      category,
      status: MaintenanceStatus.SUBMITTED,
      urgency: urgency as MaintenanceUrgency,
      createdAt: now,
      updatedAt: now,
    };

    return this.maintRepo.save(request);
  }
}
