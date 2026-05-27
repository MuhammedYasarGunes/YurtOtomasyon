/**
 * Postgres implementation for IUserRepository
 */

import { DeepPartial, Repository } from 'typeorm';
import { IUserRepository } from '../../../domain/repositories/interfaces.js';
import { User } from '../../../domain/types.js';
import { UserEntity } from '../../database/entities/user.entity.js';
import { getDataSource } from '../../database/connection.js';
import { mapUserEntityToDomain } from './entity-mappers.js';

export class PostgresUserRepository implements IUserRepository {
  private repositoryPromise: Promise<Repository<UserEntity>>;

  constructor() {
    this.repositoryPromise = getDataSource().then(ds => ds.getRepository(UserEntity));
  }

  async getAll(): Promise<User[]> {
    const repo = await this.repositoryPromise;
    const entities = await repo.find();
    return entities.map(mapUserEntityToDomain);
  }

  async getById(id: string): Promise<User | undefined> {
    const repo = await this.repositoryPromise;
    const entity = await repo.findOne({ where: { id } });
    return entity ? mapUserEntityToDomain(entity) : undefined;
  }

  async getByEmail(email: string): Promise<User | undefined> {
    const repo = await this.repositoryPromise;
    const entity = await repo.findOne({ where: { email: email.toLowerCase().trim() } });
    return entity ? mapUserEntityToDomain(entity) : undefined;
  }

  async create(user: User): Promise<User> {
    const repo = await this.repositoryPromise;
    const entity = repo.create({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      tenantId: user.tenantId ?? undefined,
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt),
    } as DeepPartial<UserEntity>);
    const saved = await repo.save(entity);
    return mapUserEntityToDomain(saved);
  }

  async update(user: User): Promise<User> {
    const repo = await this.repositoryPromise;
    await repo.update(user.id, {
      email: user.email,
      name: user.name,
      role: user.role,
      tenantId: user.tenantId ?? undefined,
      updatedAt: new Date(user.updatedAt),
    });
    const updated = await repo.findOneOrFail({ where: { id: user.id } });
    return mapUserEntityToDomain(updated);
  }
}
