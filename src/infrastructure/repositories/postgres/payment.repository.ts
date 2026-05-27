/**
 * Postgres implementation for IPaymentRepository
 */

import { Repository } from 'typeorm';
import { IPaymentRepository } from '../../../domain/repositories/interfaces.js';
import { Payment } from '../../../domain/types.js';
import { PaymentEntity } from '../../database/entities/payment.entity.js';
import { getDataSource } from '../../database/connection.js';
import { mapPaymentEntityToDomain } from './entity-mappers.js';

export class PostgresPaymentRepository implements IPaymentRepository {
  private repositoryPromise: Promise<Repository<PaymentEntity>>;

  constructor() {
    this.repositoryPromise = getDataSource().then(ds => ds.getRepository(PaymentEntity));
  }

  async getAll(tenantId?: string): Promise<Payment[]> {
    const repo = await this.repositoryPromise;
    const entities = tenantId ? await repo.find({ where: { tenantId } }) : await repo.find();
    return entities.map(mapPaymentEntityToDomain);
  }

  async getById(id: string): Promise<Payment | undefined> {
    const repo = await this.repositoryPromise;
    const entity = await repo.findOne({ where: { id } });
    return entity ? mapPaymentEntityToDomain(entity) : undefined;
  }

  async save(payment: Payment): Promise<Payment> {
    const repo = await this.repositoryPromise;
    const entity = repo.create({
      ...payment,
      dueDate: new Date(payment.dueDate),
      paymentDate: payment.paymentDate ? new Date(payment.paymentDate) : null,
      createdAt: new Date(payment.createdAt),
      updatedAt: new Date(payment.updatedAt),
    });
    const saved = await repo.save(entity);
    return mapPaymentEntityToDomain(saved);
  }
}
