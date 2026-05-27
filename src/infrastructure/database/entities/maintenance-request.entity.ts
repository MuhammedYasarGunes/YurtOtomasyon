/**
 * MaintenanceRequest Entity - TypeORM Entity
 */

import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { TenantEntity } from './tenant.entity';
import { RoomEntity } from './room.entity';

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

@Entity('maintenance_requests')
@Index(['studentId'])
@Index(['roomId'])
@Index(['tenantId'])
@Index(['status'])
export class MaintenanceRequestEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  studentId: string;

  @Column('uuid')
  roomId: string;

  @Column('uuid')
  tenantId: string;

  @Column({ type: 'varchar' })
  studentName: string;

  @Column({ type: 'varchar' })
  roomNumber: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar' })
  category: string;

  @Column({ type: 'enum', enum: MaintenanceStatus })
  status: MaintenanceStatus;

  @Column({ type: 'enum', enum: MaintenanceUrgency })
  urgency: MaintenanceUrgency;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => UserEntity, user => user.maintenanceRequests, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'studentId' })
  student?: UserEntity;

  @ManyToOne(() => TenantEntity, tenant => tenant.maintenanceRequests, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tenantId' })
  tenant?: TenantEntity;

  @ManyToOne(() => RoomEntity, room => room.maintenanceRequests, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'roomId' })
  room?: RoomEntity;
}
