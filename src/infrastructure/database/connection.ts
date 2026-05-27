/**
 * Database connection configuration
 * Supports PostgreSQL and MongoDB
 */

import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { env } from '@config/env';
import { Logger } from '@infrastructure/logging/logger';

// PostgreSQL entities
import { UserEntity } from './entities/user.entity';
import { TenantEntity } from './entities/tenant.entity';
import { RoomEntity } from './entities/room.entity';
import { ApplicationEntity } from './entities/application.entity';
import { PaymentEntity } from './entities/payment.entity';
import { MaintenanceRequestEntity } from './entities/maintenance-request.entity';
import { AttendanceLogEntity } from './entities/attendance-log.entity';
import { AnnouncementEntity } from './entities/announcement.entity';
import { NotificationEntity } from './entities/notification.entity';
import { StudentProfileEntity } from './entities/student-profile.entity';

const baseOptions: Partial<DataSourceOptions> = {
  synchronize: env.DB_SYNCHRONIZE,
  logging: env.DB_LOGGING ? ['query', 'error'] : false,
  migrationsRun: true,
  migrations: ['dist/infrastructure/migrations/**/*.js'],
  subscribers: [],
};

let dataSource: DataSource;

/**
 * Get or create database connection
 */
export async function getDataSource(): Promise<DataSource> {
  if (dataSource && dataSource.isInitialized) {
    return dataSource;
  }

  try {
    if (env.DB_TYPE === 'postgres') {
      dataSource = new DataSource({
        ...baseOptions,
        type: 'postgres',
        host: env.DB_HOST,
        port: env.DB_PORT,
        username: env.DB_USERNAME,
        password: env.DB_PASSWORD,
        database: env.DB_DATABASE,
        entities: [
          UserEntity,
          TenantEntity,
          RoomEntity,
          ApplicationEntity,
          PaymentEntity,
          MaintenanceRequestEntity,
          AttendanceLogEntity,
          AnnouncementEntity,
          NotificationEntity,
          StudentProfileEntity,
        ],
      } as DataSourceOptions);
    } else if (env.DB_TYPE === 'mongodb') {
      throw new Error('MongoDB support coming soon');
    } else {
      throw new Error(`Unsupported database type: ${env.DB_TYPE}`);
    }

    await dataSource.initialize();
    Logger.info('✅ Database connection established', { 
      type: env.DB_TYPE,
      host: env.DB_HOST,
      database: env.DB_DATABASE 
    });

    return dataSource;
  } catch (error) {
    Logger.error('❌ Database connection failed', error as Error);
    throw error;
  }
}

/**
 * Initialize database on app startup
 */
export async function initializeDatabase(): Promise<void> {
  try {
    const dataSource = await getDataSource();
    
    // Run migrations if needed
    if (dataSource.migrations.length > 0) {
      await dataSource.runMigrations();
      Logger.info('✅ Database migrations completed');
    }
  } catch (error) {
    Logger.error('❌ Database initialization failed', error as Error);
    throw error;
  }
}

/**
 * Close database connection
 */
export async function closeDatabase(): Promise<void> {
  if (dataSource && dataSource.isInitialized) {
    await dataSource.destroy();
    Logger.info('Database connection closed');
  }
}

export { dataSource };
