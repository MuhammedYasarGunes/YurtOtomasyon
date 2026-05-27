/**
 * Postgres implementation for IAnnouncementRepository
 */

import { Repository } from 'typeorm';
import { IAnnouncementRepository } from '../../../domain/repositories/interfaces.js';
import { Announcement } from '../../../domain/types.js';
import { AnnouncementEntity } from '../../database/entities/announcement.entity.js';
import { getDataSource } from '../../database/connection.js';
import { mapAnnouncementEntityToDomain } from './entity-mappers.js';

export class PostgresAnnouncementRepository implements IAnnouncementRepository {
  private repositoryPromise: Promise<Repository<AnnouncementEntity>>;

  constructor() {
    this.repositoryPromise = getDataSource().then(ds => ds.getRepository(AnnouncementEntity));
  }

  async getAll(tenantId?: string): Promise<Announcement[]> {
    const repo = await this.repositoryPromise;
    const entities = tenantId
      ? await repo.find({ where: [{ tenantId }, { tenantId: undefined }] })
      : await repo.find();
    return entities.map(mapAnnouncementEntityToDomain);
  }

  async save(announcement: Announcement): Promise<Announcement> {
    const repo = await this.repositoryPromise;
    const entity = repo.create({
      ...announcement,
      tenantId: announcement.tenantId ?? undefined,
      createdAt: new Date(announcement.createdAt),
      updatedAt: new Date(announcement.updatedAt),
    });
    const saved = await repo.save(entity);
    return mapAnnouncementEntityToDomain(saved);
  }
}
