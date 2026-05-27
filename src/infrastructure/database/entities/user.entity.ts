/**
 * User Entity - TypeORM Entity
 */

import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { ApplicationEntity } from './application.entity';
import { PaymentEntity } from './payment.entity';
import { MaintenanceRequestEntity } from './maintenance-request.entity';
import { NotificationEntity } from './notification.entity';

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  DORM_ADMIN = 'DORM_ADMIN',
  STAFF = 'STAFF',
  STUDENT = 'STUDENT',
}

@Entity('users')
@Index(['email'], { unique: true })
@Index(['tenantId'])
export class UserEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ type: 'uuid', nullable: true })
  tenantId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => ApplicationEntity, app => app.student)
  applications?: ApplicationEntity[];

  @OneToMany(() => PaymentEntity, payment => payment.student)
  payments?: PaymentEntity[];

  @OneToMany(() => MaintenanceRequestEntity, maint => maint.student)
  maintenanceRequests?: MaintenanceRequestEntity[];

  @OneToMany(() => NotificationEntity, notif => notif.user)
  notifications?: NotificationEntity[];
}
