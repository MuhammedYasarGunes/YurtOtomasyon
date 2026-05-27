import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "127.0.0.1", // localhost yerine bunu kullanıyoruz, IP karmaşasını önler
  port: 5434,        // KESİNLİKLE 5434!
  username: "yurtapp_user",
  password: "SecretPass123",
  database: "yurtapp_dev",
  synchronize: false,
  logging: true,
  entities: ["src/**/*.entity.ts"],
  migrations: ["src/infrastructure/database/migrations/*.ts"],
  subscribers: [],
});