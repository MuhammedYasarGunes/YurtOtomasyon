/**
 * Room Entity - TypeORM Entity
 */

import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  Index,
  JoinColumn,
} from 'typeorm';
import { TenantEntity } from './tenant.entity';
import { ApplicationEntity } from './application.entity';
import { MaintenanceRequestEntity } from './maintenance-request.entity';
import { AttendanceLogEntity } from './attendance-log.entity';

export enum RoomGender {
  MALE = 'Male',
  FEMALE = 'Female',
  COED = 'Co-Ed',
}

@Entity('rooms')
@Index(['tenantId'])
@Index(['tenantId', 'roomNumber'], { unique: true })
export class RoomEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  tenantId: string;

  @Column({ type: 'varchar' })
  roomNumber: string;

  @Column({ type: 'integer' })
  capacity: number;

  @Column({ type: 'integer', default: 0 })
  occupancy: number;

  @Column({ type: 'enum', enum: RoomGender })
  gender: RoomGender;

  @Column({ type: 'simple-array', default: () => "'{}'" })
  residentIds: string[];

  @Column({ type: 'numeric', nullable: true })
  avgSocialScore?: number;

  @Column({ type: 'numeric', nullable: true })
  avgDisciplineScore?: number;

  @Column({ type: 'numeric', nullable: true })
  avgNoiseLevel?: number;

  @Column({ type: 'simple-array', default: () => "'{}'" })
  profileTags: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => TenantEntity, tenant => tenant.rooms, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tenantId' })
  tenant?: TenantEntity;

  @OneToMany(() => ApplicationEntity, app => app.suggestedRoom)
  applications?: ApplicationEntity[];

  @OneToMany(() => MaintenanceRequestEntity, maint => maint.room)
  maintenanceRequests?: MaintenanceRequestEntity[];

  @OneToMany(() => AttendanceLogEntity, log => log.room)
  attendanceLogs?: AttendanceLogEntity[];
}
