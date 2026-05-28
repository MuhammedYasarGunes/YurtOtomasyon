/**
 * Application Entity - TypeORM Entity
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

export enum ApplicationStatus {
  SUBMITTED = 'SUBMITTED',
  AI_MATCHED = 'AI_MATCHED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  ASSIGNED = 'ASSIGNED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

@Entity('applications')
@Index(['studentId'], { unique: true })
@Index(['preferredTenantId'])
export class ApplicationEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  studentId: string;

  @Column('uuid', { nullable: true })
  preferredTenantId?: string;

  @Column({ type: 'varchar' })
  studentName: string;

  @Column({ type: 'varchar' })
  studentEmail: string;

  @Column({ type: 'enum', enum: ApplicationStatus })
  status: ApplicationStatus;

  @Column({ type: 'jsonb' })
  lifestyleForm: Record<string, any>;

  @Column({ type: 'uuid', nullable: true })
  suggestedRoomId?: string;

  @Column({ type: 'jsonb', nullable: true })
  compatibilityLog?: {
    compatibilityScore: number;
    conflictRisk: number;
    matchingNotes: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  vector?: {
    social_score: number;
    discipline_score: number;
    cleanliness_score: number;
    noise_tolerance: number;
    night_activity_score: number;
  };

  @Column({ type: 'simple-array', default: () => "'{}'" })
  tags: string[];

  @CreateDateColumn()
  submittedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => UserEntity, user => user.applications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'studentId' })
  student?: UserEntity;

  @ManyToOne(() => TenantEntity, tenant => tenant.applications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'preferredTenantId' })
  preferredTenant?: TenantEntity;

  @ManyToOne(() => RoomEntity, room => room.applications, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'suggestedRoomId' })
  suggestedRoom?: RoomEntity;
}
