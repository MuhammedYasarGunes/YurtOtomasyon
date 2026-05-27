/**
 * Postgres implementation for IStudentProfileRepository
 */

import { Repository } from 'typeorm';
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
      ...profile,
      tags: profile.tags || [],
      analyzedAt: new Date(profile.analyzedAt),
      updatedAt: new Date(profile.updatedAt),
    });
    const saved = await repo.save(entity);
    return mapStudentProfileEntityToDomain(saved);
  }
}
