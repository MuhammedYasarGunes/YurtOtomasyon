/**
 * Assignment log entity for room placements.
 */

import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('assignment_logs')
@Index(['studentId'])
@Index(['tenantId'])
export class AssignmentLogEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  studentId: string;

  @Column({ type: 'varchar' })
  studentName: string;

  @Column('uuid')
  roomId: string;

  @Column({ type: 'varchar' })
  roomNumber: string;

  @Column('uuid')
  tenantId: string;

  @Column({ type: 'numeric' })
  compatibilityScore: number;

  @Column({ type: 'numeric' })
  conflictRisk: number;

  @Column({ type: 'text' })
  explanation: string;

  @Column({ type: 'boolean' })
  isOverridden: boolean;

  @Column({ type: 'varchar' })
  assignedBy: string;

  @Column({ type: 'timestamp with time zone' })
  assignedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
