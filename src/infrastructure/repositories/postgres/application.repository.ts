/**
 * Postgres implementation for IApplicationRepository
 */

import { DeepPartial, Repository } from 'typeorm';
import { IApplicationRepository } from '../../../domain/repositories/interfaces.js';
import { Application } from '../../../domain/types.js';
import { ApplicationEntity } from '../../database/entities/application.entity.js';
import { getDataSource } from '../../database/connection.js';
import { mapApplicationEntityToDomain } from './entity-mappers.js';

export class PostgresApplicationRepository implements IApplicationRepository {
  private repositoryPromise: Promise<Repository<ApplicationEntity>>;

  constructor() {
    this.repositoryPromise = getDataSource().then(ds => ds.getRepository(ApplicationEntity));
  }

  async getAll(tenantId?: string): Promise<Application[]> {
    const repo = await this.repositoryPromise;
    const entities = tenantId
      ? await repo.find({ where: { preferredTenantId: tenantId } })
      : await repo.find();
    return entities.map(mapApplicationEntityToDomain);
  }

  async getById(id: string): Promise<Application | undefined> {
    const repo = await this.repositoryPromise;
    const entity = await repo.findOne({ where: { id } });
    return entity ? mapApplicationEntityToDomain(entity) : undefined;
  }

  async getByStudentId(studentId: string): Promise<Application | undefined> {
    const repo = await this.repositoryPromise;
    const entity = await repo.findOne({ where: { studentId } });
    return entity ? mapApplicationEntityToDomain(entity) : undefined;
  }

  async save(application: Application): Promise<Application> {
    const repo = await this.repositoryPromise;
    const entity = repo.create({
      id: application.id,
      studentId: application.studentId,
      preferredTenantId: application.preferredTenantId ?? null,
      studentName: application.studentName,
      studentEmail: application.studentEmail,
      status: application.status,
      lifestyleForm: application.lifestyleForm as Record<string, any>,
      suggestedRoomId: application.suggestedRoomId ?? null,
      compatibilityLog: application.compatibilityLog ?? null,
      vector: application.vector ?? null,
      tags: application.tags || [],
      submittedAt: new Date(application.submittedAt),
      createdAt: new Date(application.createdAt),
      updatedAt: new Date(application.updatedAt),
    } as DeepPartial<ApplicationEntity>);
    const saved = await repo.save(entity);
    return mapApplicationEntityToDomain(saved);
  }

  async deleteByStudentId(studentId: string): Promise<void> {
    const repo = await this.repositoryPromise;
    await repo.delete({ studentId });
  }
}
