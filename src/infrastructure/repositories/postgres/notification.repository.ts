/**
 * Postgres implementation for INotificationRepository
 */

import { Repository } from 'typeorm';
import { INotificationRepository } from '../../../domain/repositories/interfaces.js';
import { Notification } from '../../../domain/types.js';
import { NotificationEntity } from '../../database/entities/notification.entity.js';
import { getDataSource } from '../../database/connection.js';
import { mapNotificationEntityToDomain } from './entity-mappers.js';

export class PostgresNotificationRepository implements INotificationRepository {
  private repositoryPromise: Promise<Repository<NotificationEntity>>;

  constructor() {
    this.repositoryPromise = getDataSource().then(ds => ds.getRepository(NotificationEntity));
  }

  async getByUserId(userId: string): Promise<Notification[]> {
    const repo = await this.repositoryPromise;
    const entities = await repo.find({ where: { userId } });
    return entities.map(mapNotificationEntityToDomain);
  }

  async save(notification: Notification): Promise<Notification> {
    const repo = await this.repositoryPromise;
    const entity = repo.create({
      ...notification,
      createdAt: new Date(notification.createdAt),
      updatedAt: new Date(notification.updatedAt),
    });
    const saved = await repo.save(entity);
    return mapNotificationEntityToDomain(saved);
  }

  async markAllAsRead(userId: string): Promise<void> {
    const repo = await this.repositoryPromise;
    await repo.update({ userId }, { isRead: true, updatedAt: new Date() });
  }
}
