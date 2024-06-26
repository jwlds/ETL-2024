import accountRepository from '../repositories/account-repository';
import Account from '../models/Account';
import User from '../models/User';

class AccountService {
  async addNewAccount(user: User): Promise<number | null> {
    return new Promise((resolve, reject) => {
      const newAccount: Account = {
        user,
        shares: []
      };


      accountRepository.addNew(newAccount, (lastID) => {
        if (lastID === undefined) {
          reject(new Error('Error inserting new account'));
        } else {
          resolve(lastID);
        }
      });
    });
  }

  async getAllAccounts(): Promise<Account[]> {
    return new Promise((resolve, reject) => {
      accountRepository.getAllAccounts((accounts) => {
        if (accounts.length === 0) {
          reject(new Error('No accounts found'));
        } else {
          resolve(accounts);
        }
      });
    });
  }

  async getAccountById(id: number): Promise<Account | null> {
    return new Promise((resolve, reject) => {
      accountRepository.getAccountById(id, (account) => {
        if (!account) {
          reject(new Error(`Account with id ${id} not found`));
        } else {
          resolve(account);
        }
      });
    });
  }

  async updateAccount(account: Account): Promise<boolean> {
    return new Promise((resolve, reject) => {
      accountRepository.updateAccount(account, (notFound) => {
        if (notFound) {
          reject(new Error(`Account with id ${account.id} not found`));
        } else {
          resolve(true);
        }
      });
    });
  }

  async deleteAccount(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      accountRepository.deleteAccount(id, (notFound) => {
        if (notFound) {
          reject(new Error(`Account with id ${id} not found`));
        } else {
          resolve(true);
        }
      });
    });
  }

  async getAccountsByUserId(userId: number): Promise<Account[]> {
    return new Promise((resolve, reject) => {
      accountRepository.getAccountsByUserId(userId, (accounts) => {
        if (accounts.length === 0) {
          reject(new Error(`No accounts found for user with id ${userId}`));
        } else {
          resolve(accounts);
        }
      });
    });
  }
}

export default new AccountService();
