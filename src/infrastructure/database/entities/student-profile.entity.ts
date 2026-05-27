/**
 * Student Profile Entity - TypeORM Entity
 */

import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('student_profiles')
@Index(['studentId'], { unique: true })
export class StudentProfileEntity {
  @PrimaryColumn('uuid')
  studentId: string;

  @Column({ type: 'jsonb' })
  lifestyleAnswers: Record<string, any>;

  @Column({ type: 'jsonb' })
  vector: Record<string, number>;

  @Column({ type: 'simple-array', default: () => "'{}'" })
  tags: string[];

  @CreateDateColumn()
  analyzedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => UserEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'studentId' })
  student?: UserEntity;
}
