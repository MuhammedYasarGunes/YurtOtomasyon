/**
 * Postgres implementation for IMaintenanceRepository
 */

import { Repository } from 'typeorm';
import { IMaintenanceRepository } from '../../../domain/repositories/interfaces.js';
import { MaintenanceRequest } from '../../../domain/types.js';
import { MaintenanceRequestEntity } from '../../database/entities/maintenance-request.entity.js';
import { getDataSource } from '../../database/connection.js';
import { mapMaintenanceRequestEntityToDomain } from './entity-mappers.js';

export class PostgresMaintenanceRepository implements IMaintenanceRepository {
  private repositoryPromise: Promise<Repository<MaintenanceRequestEntity>>;

  constructor() {
    this.repositoryPromise = getDataSource().then(ds => ds.getRepository(MaintenanceRequestEntity));
  }

  async getAll(tenantId?: string): Promise<MaintenanceRequest[]> {
    const repo = await this.repositoryPromise;
    const entities = tenantId ? await repo.find({ where: { tenantId } }) : await repo.find();
    return entities.map(mapMaintenanceRequestEntityToDomain);
  }

  async getById(id: string): Promise<MaintenanceRequest | undefined> {
    const repo = await this.repositoryPromise;
    const entity = await repo.findOne({ where: { id } });
    return entity ? mapMaintenanceRequestEntityToDomain(entity) : undefined;
  }

  async save(request: MaintenanceRequest): Promise<MaintenanceRequest> {
    const repo = await this.repositoryPromise;
    const entity = repo.create({
      ...request,
      createdAt: new Date(request.createdAt),
      updatedAt: new Date(request.updatedAt),
    });
    const saved = await repo.save(entity);
    return mapMaintenanceRequestEntityToDomain(saved);
  }
}
