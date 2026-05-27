/**
 * Postgres implementation for IApplicationRepository
 */

import { Repository } from 'typeorm';
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
      ...application,
      tags: application.tags || [],
      lifestyleForm: application.lifestyleForm,
      compatibilityLog: application.compatibilityLog || null,
      vector: application.vector || null,
      suggestedRoomId: application.suggestedRoomId || null,
      submittedAt: new Date(application.submittedAt),
      createdAt: new Date(application.createdAt),
      updatedAt: new Date(application.updatedAt),
    });
    const saved = await repo.save(entity);
    return mapApplicationEntityToDomain(saved);
  }

  async deleteByStudentId(studentId: string): Promise<void> {
    const repo = await this.repositoryPromise;
    await repo.delete({ studentId });
  }
}
