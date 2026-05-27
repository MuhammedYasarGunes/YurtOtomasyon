/**
 * AttendanceLog Entity - TypeORM Entity
 */

import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { TenantEntity } from './tenant.entity';
import { RoomEntity } from './room.entity';

@Entity('attendance_logs')
@Index(['studentId'])
@Index(['tenantId'])
@Index(['roomId'])
export class AttendanceLogEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  studentId: string;

  @Column({ type: 'varchar' })
  studentName: string;

  @Column('uuid')
  tenantId: string;

  @Column('uuid', { nullable: true })
  roomId?: string;

  @Column({ type: 'varchar' })
  roomNumber: string;

  @Column({ type: 'varchar' })
  direction: 'IN' | 'OUT';

  @Column({ type: 'timestamp with time zone' })
  timestamp: Date;

  @Column({ type: 'varchar' })
  loggedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => UserEntity, user => user.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'studentId' })
  student?: UserEntity;

  @ManyToOne(() => TenantEntity, tenant => tenant.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tenantId' })
  tenant?: TenantEntity;

  @ManyToOne(() => RoomEntity, room => room.attendanceLogs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'roomId' })
  room?: RoomEntity;
}
