/**
 * Payment Entity - TypeORM Entity
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

export enum PaymentStatus {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  REFUNDED = 'REFUNDED',
}

@Entity('payments')
@Index(['studentId'])
@Index(['tenantId'])
@Index(['status'])
export class PaymentEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  studentId: string;

  @Column('uuid')
  tenantId: string;

  @Column({ type: 'varchar' })
  studentName: string;

  @Column({ type: 'numeric' })
  amount: number;

  @Column({ type: 'date' })
  dueDate: Date;

  @Column({ type: 'enum', enum: PaymentStatus })
  status: PaymentStatus;

  @Column({ type: 'date', nullable: true })
  paymentDate?: Date;

  @Column({ type: 'varchar', nullable: true })
  transactionHash?: string;

  @Column({ type: 'varchar' })
  invoiceNumber: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => UserEntity, user => user.payments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'studentId' })
  student?: UserEntity;

  @ManyToOne(() => TenantEntity, tenant => tenant.payments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tenantId' })
  tenant?: TenantEntity;
}
