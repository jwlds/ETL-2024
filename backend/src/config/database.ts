import ChalkLog from '../library/ChalkLog';

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

const initializeDB = async (): Promise<Database> => {
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

const dropTables = async (): Promise<void> => {
  try {
    await dropOrdersTable();
    await dropMarketSharesTable();
    await dropAccountsTable();
    await dropUsersTable();
    ChalkLog.info('All tables dropped successfully');
  } catch (err) {
    ChalkLog.error(`Error dropping tables: ${err}`);
    throw err;
  }
};

const dropUsersTable = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!database) {
      reject(new Error('Database not initialized'));
      return;
    }

    const dropTableQuery = `
      DROP TABLE IF EXISTS users;
    `;

    database.run(dropTableQuery, (err: Error | null) => {
      if (err) {
        ChalkLog.error(`Error dropping users table: ${err}`);
        reject(err);
      } else {
        ChalkLog.info('Users table dropped successfully');
        resolve();
      }
    });
  });
};

const dropAccountsTable = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!database) {
      reject(new Error('Database not initialized'));
      return;
    }

    const dropTableQuery = `
      DROP TABLE IF EXISTS accounts;
    `;

    database.run(dropTableQuery, (err: Error | null) => {
      if (err) {
        ChalkLog.error(`Error dropping accounts table: ${err}`);
        reject(err);
      } else {
        ChalkLog.info('Accounts table dropped successfully');
        resolve();
      }
    });
  });
};

const dropMarketSharesTable = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!database) {
      reject(new Error('Database not initialized'));
      return;
    }

    const dropTableQuery = `
      DROP TABLE IF EXISTS shares;
    `;

    database.run(dropTableQuery, (err: Error | null) => {
      if (err) {
        ChalkLog.error(`Error dropping marketShares table: ${err}`);
        reject(err);
      } else {
        ChalkLog.info('MarketShares table dropped successfully');
        resolve();
      }
    });
  });
};

const dropOrdersTable = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!database) {
      reject(new Error('Database not initialized'));
      return;
    }

    const dropTableQuery = `
      DROP TABLE IF EXISTS orders;
    `;

    database.run(dropTableQuery, (err: Error | null) => {
      if (err) {
        ChalkLog.error(`Error dropping orders table: ${err}`);
        reject(err);
      } else {
        ChalkLog.info('Orders table dropped successfully');
        resolve();
      }
    });
  });
};

const createTables = async (): Promise<void> => {
  try {
    await createUsersTable();
    await createAccountsTable();
    await createMarketSharesTable();
    await createOrdersTable();
    ChalkLog.info('All tables created successfully');
  } catch (err) {
    ChalkLog.error(`Error creating tables: ${err}`);
    throw err;
  }
};

const createUsersTable = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!database) {
      reject(new Error('Database not initialized'));
      return;
    }

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        document TEXT,
        first_name TEXT,
        last_name TEXT
      );
    `;

    database.run(createTableQuery, (err: Error | null) => {
      if (err) {
        ChalkLog.error(`Error creating users table: ${err}`);
        reject(err);
      } else {
        ChalkLog.info('Users table created successfully');
        resolve();
      }
    });
  });
};

const createAccountsTable = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!database) {
      reject(new Error('Database not initialized'));
      return;
    }

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `;

    database.run(createTableQuery, (err: Error | null) => {
      if (err) {
        ChalkLog.error(`Error creating accounts table: ${err}`);
        reject(err);
      } else {
        ChalkLog.info('Accounts table created successfully');
        resolve();
      }
    });
  });
};

const createMarketSharesTable = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!database) {
      reject(new Error('Database not initialized'));
      return;
    }

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS shares (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ticker TEXT,
        name TEXT,
        current_value REAL
      );
    `;

    database.run(createTableQuery, (err: Error | null) => {
      if (err) {
        ChalkLog.error(`Error creating marketShares table: ${err}`);
        reject(err);
      } else {
        ChalkLog.info('MarketShares table created successfully');
        resolve();
      }
    });
  });
};

const createOrdersTable = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!database) {
      reject(new Error('Database not initialized'));
      return;
    }

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        executor_id INTEGER,
        account_id INTEGER,
        share_id INTEGER,
        createdAt TEXT,
        quantity INTEGER,
        updatedAt TEXT,
        action TEXT,
        value REAL,
        status TEXT,
        FOREIGN KEY (executor_id) REFERENCES users(id),
        FOREIGN KEY (share_id) REFERENCES shares(id)
      );
    `;

    database.run(createTableQuery, (err: Error | null) => {
      if (err) {
        ChalkLog.error(`Error creating orders table: ${err}`);
        reject(err);
      } else {
        ChalkLog.info('Orders table created successfully');
        resolve();
      }
    });
  });
};

export { initializeDB };
