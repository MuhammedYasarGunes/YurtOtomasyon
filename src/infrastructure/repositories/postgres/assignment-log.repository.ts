/**
 * Postgres implementation for assignment log storage.
 */

import { Repository } from 'typeorm';
import { IAssignmentLogRepository } from '../../../domain/repositories/interfaces.js';
import { AssignmentLog } from '../../../domain/types.js';
import { AssignmentLogEntity } from '../../database/entities/assignment-log.entity.js';
import { getDataSource } from '../../database/connection.js';

function mapAssignmentLogEntityToDomain(entity: AssignmentLogEntity): AssignmentLog {
  return {
    id: entity.id,
    studentId: entity.studentId,
    studentName: entity.studentName,
    roomId: entity.roomId,
    roomNumber: entity.roomNumber,
    tenantId: entity.tenantId,
    compatibilityScore: Number(entity.compatibilityScore),
    conflictRisk: Number(entity.conflictRisk),
    explanation: entity.explanation,
    isOverridden: entity.isOverridden,
    assignedBy: entity.assignedBy,
    assignedAt: entity.assignedAt.toISOString(),
  };
}

export class PostgresAssignmentLogRepository implements IAssignmentLogRepository {
  private repositoryPromise: Promise<Repository<AssignmentLogEntity>>;

  constructor() {
    this.repositoryPromise = getDataSource().then(ds => ds.getRepository(AssignmentLogEntity));
  }

  async getAll(): Promise<AssignmentLog[]> {
    const repo = await this.repositoryPromise;
    const entities = await repo.find();
    return entities.map(mapAssignmentLogEntityToDomain);
  }

  async save(log: AssignmentLog): Promise<AssignmentLog> {
    const repo = await this.repositoryPromise;
    const entity = repo.create({
      ...log,
      compatibilityScore: log.compatibilityScore,
      conflictRisk: log.conflictRisk,
      assignedAt: new Date(log.assignedAt),
    });
    const saved = await repo.save(entity);
    return mapAssignmentLogEntityToDomain(saved);
  }
}
