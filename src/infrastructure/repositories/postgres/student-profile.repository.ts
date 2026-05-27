/**
 * Postgres implementation for IStudentProfileRepository
 */

import { DeepPartial, Repository } from 'typeorm';
import { IStudentProfileRepository } from '../../../domain/repositories/interfaces.js';
import { StudentProfile } from '../../../domain/types.js';
import { StudentProfileEntity } from '../../database/entities/student-profile.entity.js';
import { getDataSource } from '../../database/connection.js';
import { mapStudentProfileEntityToDomain } from './entity-mappers.js';

export class PostgresStudentProfileRepository implements IStudentProfileRepository {
  private repositoryPromise: Promise<Repository<StudentProfileEntity>>;

  constructor() {
    this.repositoryPromise = getDataSource().then(ds => ds.getRepository(StudentProfileEntity));
  }

  async getByStudentId(studentId: string): Promise<StudentProfile | undefined> {
    const repo = await this.repositoryPromise;
    const entity = await repo.findOne({ where: { studentId } });
    return entity ? mapStudentProfileEntityToDomain(entity) : undefined;
  }

  async getAll(): Promise<StudentProfile[]> {
    const repo = await this.repositoryPromise;
    const entities = await repo.find();
    return entities.map(mapStudentProfileEntityToDomain);
  }

  async save(profile: StudentProfile): Promise<StudentProfile> {
    const repo = await this.repositoryPromise;
    const entity = repo.create({
      studentId: profile.studentId,
      lifestyleAnswers: profile.lifestyleAnswers as Record<string, any>,
      vector: profile.vector ? (profile.vector as unknown as Record<string, number>) : undefined,
      tags: profile.tags || [],
      analyzedAt: new Date(profile.analyzedAt),
      updatedAt: new Date(profile.updatedAt),
    } as DeepPartial<StudentProfileEntity>);
    const saved = await repo.save(entity);
    return mapStudentProfileEntityToDomain(saved);
  }
}
