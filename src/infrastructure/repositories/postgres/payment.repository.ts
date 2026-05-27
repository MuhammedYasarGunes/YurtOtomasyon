/**
 * Postgres implementation for IPaymentRepository
 */

import { DeepPartial, Repository } from 'typeorm';
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
      id: payment.id,
      studentId: payment.studentId,
      tenantId: payment.tenantId,
      studentName: payment.studentName,
      amount: payment.amount,
      dueDate: new Date(payment.dueDate),
      status: payment.status,
      paymentDate: payment.paymentDate ? new Date(payment.paymentDate) : undefined,
      transactionHash: payment.transactionHash ?? undefined,
      invoiceNumber: payment.invoiceNumber,
      createdAt: new Date(payment.createdAt),
      updatedAt: new Date(payment.updatedAt),
    } as DeepPartial<PaymentEntity>);
    const saved = await repo.save(entity);
    return mapPaymentEntityToDomain(saved);
  }
}
