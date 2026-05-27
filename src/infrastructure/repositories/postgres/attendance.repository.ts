/**
 * Postgres implementation for IAttendanceRepository
 */

import { Repository } from 'typeorm';
import { IAttendanceRepository } from '../../../domain/repositories/interfaces.js';
import { EntryExitLog } from '../../../domain/types.js';
import { AttendanceLogEntity } from '../../database/entities/attendance-log.entity.js';
import { getDataSource } from '../../database/connection.js';
import { mapAttendanceLogEntityToDomain } from './entity-mappers.js';

export class PostgresAttendanceRepository implements IAttendanceRepository {
  private repositoryPromise: Promise<Repository<AttendanceLogEntity>>;

  constructor() {
    this.repositoryPromise = getDataSource().then(ds => ds.getRepository(AttendanceLogEntity));
  }

  async getAll(tenantId?: string): Promise<EntryExitLog[]> {
    const repo = await this.repositoryPromise;
    const entities = tenantId ? await repo.find({ where: { tenantId } }) : await repo.find();
    return entities.map(mapAttendanceLogEntityToDomain);
  }

  async save(log: EntryExitLog): Promise<EntryExitLog> {
    const repo = await this.repositoryPromise;
    const entity = repo.create({
      ...log,
      timestamp: new Date(log.timestamp),
      createdAt: new Date(log.createdAt),
    });
    const saved = await repo.save(entity);
    return mapAttendanceLogEntityToDomain(saved);
  }
}
