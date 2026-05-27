import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

// Environment variable schema
const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  API_URL: z.string().url().default('http://localhost:3000'),
  
  // Database
  DB_TYPE: z.enum(['postgres', 'mongodb']).default('postgres'),
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.coerce.number().default(5434), // Docker için kullandığımız port
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_DATABASE: z.string(),
  DB_SYNCHRONIZE: z.coerce.boolean().default(false),
  DB_LOGGING: z.coerce.boolean().default(false),
  
  // MongoDB (optional)
  MONGODB_URI: z.string().optional(),
  
  // Gemini AI
  GEMINI_API_KEY: z.string().optional(),
  
  // JWT (future use)
  JWT_SECRET: z.string().default('dev-secret-key'),
  JWT_EXPIRATION: z.string().default('24h'),
  
  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  
  // CORS
  CORS_ORIGIN: z.string().default('*'),
  
  // Application
  APP_NAME: z.string().default('YurtApp'),
  APP_VERSION: z.string().default('2.0.0'),
});

type Environment = z.infer<typeof EnvSchema>;

let cachedEnv: Environment | null = null;

export function getEnvironment(): Environment {
  if (cachedEnv) {
    return cachedEnv;
  }

  try {
    // Node.js --env-file sayesinde process.env zaten dolu geliyor!
    cachedEnv = EnvSchema.parse(process.env);
    return cachedEnv;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Environment validation failed:');
      error.errors.forEach(err => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
    }
    throw new Error('Invalid environment configuration');
  }
}

// Export for convenience
export const env = getEnvironment();