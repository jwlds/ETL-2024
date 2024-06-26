import ChalkLog from '../../library/ChalkLog';

import { Database, verbose } from 'sqlite3';
import { resolve } from 'path';

const sqlite3 = verbose();
const dbPath = resolve(__dirname, 'database.sqlite');

let database: Database | null = null;

const connectDB = (): Promise<Database> => {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err: Error | null) => {
      if (err) {
        ChalkLog.error(`Error connecting to the database: ${err}`);
        reject(err);
      } else {
        ChalkLog.info('Connected to the SQLite database');
        resolve(db);
      }
    });
  });
};

const createDailyReportTable = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!database) {
      reject(new Error('Database not initialized'));
      return;
    }

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS daily_reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ticker TEXT,
        createdAt TEXT,
        quantity INTEGER,
        liquidity REAL
      );
    `;

    database.run(createTableQuery, (err: Error | null) => {
      if (err) {
        ChalkLog.error(`Error creating daily_reports table: ${err}`);
        reject(err);
      } else {
        ChalkLog.info('DailyReports table created successfully');
        resolve();
      }
    });
  });
};

const createTables = async (): Promise<void> => {
  await createDailyReportTable();
};

const initializeDBETL = async (): Promise<Database> => {
  if (!database) {
    try {
      database = await connectDB();
      await createTables();
    } catch (err) {
      ChalkLog.error(`Error initializing database: ${err}`);
      throw err;
    }
  }
  return database;
};

export { initializeDBETL };
