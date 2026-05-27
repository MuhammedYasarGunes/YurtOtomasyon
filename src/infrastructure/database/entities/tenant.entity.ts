/**
 * Tenant Entity - TypeORM Entity
 */

import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { RoomEntity } from './room.entity';
import { ApplicationEntity } from './application.entity';
import { PaymentEntity } from './payment.entity';
import { MaintenanceRequestEntity } from './maintenance-request.entity';
import { AnnouncementEntity } from './announcement.entity';

@Entity('tenants')
@Index(['name'])
export class TenantEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  location: string;

  @Column({ type: 'numeric' })
  monthlyFee: number;

  @Column({ type: 'integer' })
  totalRooms: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => RoomEntity, room => room.tenant)
  rooms?: RoomEntity[];

  @OneToMany(() => ApplicationEntity, app => app.preferredTenant)
  applications?: ApplicationEntity[];

  @OneToMany(() => PaymentEntity, payment => payment.tenant)
  payments?: PaymentEntity[];

  @OneToMany(() => MaintenanceRequestEntity, maint => maint.tenant)
  maintenanceRequests?: MaintenanceRequestEntity[];

  @OneToMany(() => AnnouncementEntity, announcement => announcement.tenant)
  announcements?: AnnouncementEntity[];
}
