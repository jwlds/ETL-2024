import { Database } from 'sqlite3';
import { initializeDB } from '../config/database';
import Account from '../models/Account';

let database: Database;

initializeDB().then(db => {
    database = db;
  }).catch(err => {
    console.error('Failed to initialize database:', err);
  });
  

const accountRepository = {
  addNew: (account: Account, callback: (lastID?: number) => void): void => {
    const sql = "INSERT INTO accounts (user_id) VALUES (?)";
    const params = [account.user.id];
    
    database.run(sql, params, function (err: Error | null) {
      if (err) {
        console.error('Error inserting new account:', err);
        callback(undefined);
      } else {
        account.id = this.lastID;
        callback(account.id);
      }
    });
  },

  getAllAccounts: (callback: (accounts: Account[]) => void): void => {
    const sql = "SELECT * FROM accounts";
    const params: any[] = [];

    database.all(sql, params, (err: Error | null, rows: Account[]) => {
      if (err) {
        console.error('Error fetching all accounts:', err);
        callback([]);
      } else {
        callback(rows);
      }
    });
  },

  getAccountById: (id: number, callback: (account?: Account) => void): void => {
    const sql = "SELECT * FROM accounts WHERE id = ?";
    const params = [id];

    database.get(sql, params, (err: Error | null, row: Account) => {
      if (err) {
        console.error(`Error fetching account with id ${id}:`, err);
        callback(undefined);
      } else {
        callback(row);
      }
    });
  },

  updateAccount: (account: Account, callback: (notFound: boolean) => void): void => {
    const sql = "UPDATE accounts SET user_id = ? WHERE id = ?";
    const params = [account.user.id, account.id];

    database.run(sql, params, function (err: Error | null) {
      if (err) {
        console.error(`Error updating account with id ${account.id}:`, err);
        callback(true);
      } else {
        callback(this.changes === 0);
      }
    });
  },

  deleteAccount: (id: number, callback: (notFound: boolean) => void): void => {
    const sql = "DELETE FROM accounts WHERE id = ?";
    const params = [id];

    database.run(sql, params, function (err: Error | null) {
      if (err) {
        console.error(`Error deleting account with id ${id}:`, err);
        callback(true);
      } else {
        callback(this.changes === 0);
      }
    });
  },

  getAccountsByUserId: (userId: number, callback: (accounts: Account[]) => void): void => {
    const sql = "SELECT * FROM accounts WHERE user_id = ?";
    const params = [userId];

    database.all(sql, params, (err: Error | null, rows: Account[]) => {
      if (err) {
        console.error(`Error fetching accounts for user with id ${userId}:`, err);
        callback([]);
      } else {
        callback(rows);
      }
    });
  }
};

export default accountRepository;
