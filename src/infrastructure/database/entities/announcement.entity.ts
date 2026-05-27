/**
 * Announcement Entity - TypeORM Entity
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
import { TenantEntity } from './tenant.entity';

@Entity('announcements')
@Index(['tenantId'])
export class AnnouncementEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid', { nullable: true })
  tenantId?: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar' })
  priority: string;

  @Column({ type: 'varchar', nullable: true })
  targetRole?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => TenantEntity, tenant => tenant.announcements, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'tenantId' })
  tenant?: TenantEntity;
}
