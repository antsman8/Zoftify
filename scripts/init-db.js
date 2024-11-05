import pg from 'pg';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config();

async function initializeDatabase() {
  // Создаем клиент для подключения к postgres (без указания базы данных)
  const client = new pg.Client({
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
  });

  try {
    await client.connect();
    console.log('Подключение к PostgreSQL успешно установлено');

    // Проверяем существование базы данных
    const dbExistsResult = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [process.env.POSTGRES_DATABASE]
    );

    // Если база данных не существует, создаем её
    if (dbExistsResult.rows.length === 0) {
      await client.query(`CREATE DATABASE ${process.env.POSTGRES_DATABASE}`);
      console.log(`База данных ${process.env.POSTGRES_DATABASE} создана`);
    }

    // Закрываем соединение с postgres
    await client.end();

    // Создаем новое подключение уже к нашей базе данных
    const dbClient = new pg.Client({
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      user: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
    });

    await dbClient.connect();

    // Читаем SQL файл
    const sqlFile = await fs.readFile(
      path.join(__dirname, '..', 'db', 'init.sql'),
      'utf8'
    );

    // Выполняем SQL команды
    await dbClient.query(sqlFile);
    console.log('Структура базы данных успешно создана');

    await dbClient.end();
  } catch (error) {
    console.error('Ошибка при инициализации базы данных:', error);
    process.exit(1);
  }
}

initializeDatabase();
