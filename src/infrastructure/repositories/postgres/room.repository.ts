/**
 * Postgres implementation for IRoomRepository
 */

import { Repository } from 'typeorm';
import { IRoomRepository } from '../../../domain/repositories/interfaces.js';
import { Room } from '../../../domain/types.js';
import { RoomEntity } from '../../database/entities/room.entity.js';
import { getDataSource } from '../../database/connection.js';
import { mapRoomEntityToDomain } from './entity-mappers.js';

export class PostgresRoomRepository implements IRoomRepository {
  private repositoryPromise: Promise<Repository<RoomEntity>>;

  constructor() {
    this.repositoryPromise = getDataSource().then(ds => ds.getRepository(RoomEntity));
  }

  async getAll(tenantId?: string): Promise<Room[]> {
    const repo = await this.repositoryPromise;
    const entities = tenantId
      ? await repo.find({ where: { tenantId } })
      : await repo.find();
    return entities.map(mapRoomEntityToDomain);
  }

  async getById(id: string): Promise<Room | undefined> {
    const repo = await this.repositoryPromise;
    const entity = await repo.findOne({ where: { id } });
    return entity ? mapRoomEntityToDomain(entity) : undefined;
  }

  async save(room: Room): Promise<Room> {
    const repo = await this.repositoryPromise;
    const entity = repo.create({
      ...room,
      residentIds: room.residentIds || [],
      profileTags: room.profileTags || [],
      createdAt: new Date(room.createdAt),
      updatedAt: new Date(room.updatedAt),
    });
    const saved = await repo.save(entity);
    return mapRoomEntityToDomain(saved);
  }
}
