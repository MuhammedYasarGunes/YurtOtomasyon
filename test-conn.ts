import { AppDataSource } from "./src/infrastructure/database/data-source.ts";

AppDataSource.initialize()
    .then(() => {
        console.log("🚀 HARİKA! Veritabanı bağlantısı BAŞARILI!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("❌ Veritabanı bağlantı HATASI:", error);
        process.exit(1);
    });