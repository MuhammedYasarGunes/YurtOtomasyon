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

let dataSource: DataSource | null = null;
let dataSourcePromise: Promise<DataSource> | null = null;

/**
 * Get or create database connection
 */
export async function getDataSource(): Promise<DataSource> {
  if (dataSource?.isInitialized) {
    return dataSource;
  }

  if (dataSourcePromise) {
    return dataSourcePromise;
  }

  dataSourcePromise = (async () => {
    try {
      const migrationsPaths = [
        'dist/infrastructure/migrations/**/*.js',
        'src/infrastructure/database/migrations/**/*.ts',
      ];

      const ds = new DataSource({
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
        migrations: migrationsPaths,
        synchronize: env.NODE_ENV === 'development' ? true : env.DB_SYNCHRONIZE,
      } as DataSourceOptions);

      await ds.initialize();
      dataSource = ds;
      Logger.info('✅ Database connection established', {
        type: env.DB_TYPE,
        host: env.DB_HOST,
        database: env.DB_DATABASE,
      });

      return dataSource;
    } catch (error) {
      dataSourcePromise = null;
      Logger.error('❌ Database connection failed', error as Error);
      throw error;
    }
  })();

  return dataSourcePromise;
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
