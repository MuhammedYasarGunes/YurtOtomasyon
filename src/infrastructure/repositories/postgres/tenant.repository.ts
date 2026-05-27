/**
 * Postgres implementation for ITenantRepository
 */

import { Repository } from 'typeorm';
import { ITenantRepository } from '../../../domain/repositories/interfaces.js';
import { Tenant } from '../../../domain/types.js';
import { TenantEntity } from '../../database/entities/tenant.entity.js';
import { getDataSource } from '../../database/connection.js';
import { mapTenantEntityToDomain } from './entity-mappers.js';

export class PostgresTenantRepository implements ITenantRepository {
  private repositoryPromise: Promise<Repository<TenantEntity>>;

  constructor() {
    this.repositoryPromise = getDataSource().then(ds => ds.getRepository(TenantEntity));
  }

  async getAll(): Promise<Tenant[]> {
    const repo = await this.repositoryPromise;
    const entities = await repo.find();
    return entities.map(mapTenantEntityToDomain);
  }

  async getById(id: string): Promise<Tenant | undefined> {
    const repo = await this.repositoryPromise;
    const entity = await repo.findOne({ where: { id } });
    return entity ? mapTenantEntityToDomain(entity) : undefined;
  }
}
