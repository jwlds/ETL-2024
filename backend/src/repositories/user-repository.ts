import { Database } from 'sqlite3';
import { initializeDB } from '../config/database';
import User from '../models/User';
import { Order } from '../models/Order';

let database: Database;

initializeDB().then(db => {
  database = db;
}).catch(err => {
  console.error('Failed to initialize database:', err);
});

const usersRepository = {
  addNew: (user: User, callback: (lastID?: number) => void): void => {
    if (!database) {
      console.error('Database is not initialized');
      callback(undefined);
      return;
    }

    const sql = "INSERT INTO users (document, first_name, last_name) VALUES (?, ?, ?)";
    const params = [user.document, user.first_name, user.last_name];
    database.run(sql, params, function (err: Error | null) {
      if (err) {
        console.error('Error inserting new user:', err);
        callback(undefined);
      } else {
        callback(this.lastID);
      }
    });
  },
  getAllUsers: (callback: (users: User[]) => void): void => {
    if (!database) {
      console.error('Database is not initialized');
      callback([]);
      return;
    }

    const sql = "SELECT * FROM users";
    const params: any[] = [];
    database.all(sql, params, (err: Error | null, rows: User[]) => {
      if (err) {
        console.error('Error fetching all users:', err);
        callback([]);
      } else {
        callback(rows);
      }
    });
  },
  getById: (id: number, callback: (user?: User) => void): void => {
    if (!database) {
      console.error('Database is not initialized');
      callback(undefined);
      return;
    }

    const sql = "SELECT * FROM users WHERE id = ?";
    const params = [id];
    database.get(sql, params, (err: Error | null, row: User) => {
      if (err) {
        console.error(`Error fetching user with id ${id}:`, err);
        callback(undefined);
      } else {
        callback(row);
      }
    });
  },
  update: (id: number, user: User, callback: (notFound: boolean) => void): void => {
    if (!database) {
      console.error('Database is not initialized');
      callback(true);
      return;
    }

    const sql = "UPDATE users SET document = ?, first_name = ?, last_name = ? WHERE id = ?";
    const params = [user.document, user.first_name, user.last_name, id];
    database.run(sql, params, function (err: Error | null) {
      if (err) {
        console.error(`Error updating user with id ${id}:`, err);
        callback(true);
      } else {
        callback(this.changes === 0);
      }
    });
  },
  delete: (id: number, callback: (notFound: boolean) => void): void => {
    if (!database) {
      console.error('Database is not initialized');
      callback(true);
      return;
    }

    const sql = "DELETE FROM users WHERE id = ?";
    const params = [id];
    database.run(sql, params, function (err: Error | null) {
      if (err) {
        console.error(`Error deleting user with id ${id}:`, err);
        callback(true);
      } else {
        callback(this.changes === 0);
      }
    });
  },

};

export default usersRepository;
