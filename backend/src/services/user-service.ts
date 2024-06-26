import usersRepository from '../repositories/user-repository';
import User from '../models/User';

class UserService {
  async addNew(user: User): Promise<User | null> {
    return new Promise((resolve, reject) => {
      usersRepository.addNew(user, (lastID?: number) => {
        if (lastID === undefined) {
          reject(new Error('Error inserting new user'));
        } else {
          const newUser: User = { ...user, id: lastID }; // Criando um novo objeto User com o ID inserido
          resolve(newUser);
        }
      });
    });
  }

  async getAllUsers(): Promise<User[]> {
    return new Promise((resolve, reject) => {
      usersRepository.getAllUsers((users: User[]) => {
        if (users.length === 0) {
          reject(new Error('Error fetching all users'));
        } else {
          resolve(users);
        }
      });
    });
  }

  async getById(id: number): Promise<User | null> {
    return new Promise((resolve, reject) => {
      usersRepository.getById(id, (user?: User) => {
        if (user === undefined) {
          reject(new Error(`Error fetching user with id ${id}`));
        } else {
          resolve(user);
        }
      });
    });
  }

  async update(id: number, user: User): Promise<boolean> {
    return new Promise((resolve, reject) => {
      usersRepository.update(id, user, (notFound: boolean) => {
        if (notFound) {
          reject(new Error(`Error updating user with id ${id}`));
        } else {
          resolve(true);
        }
      });
    });
  }

  async delete(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      usersRepository.delete(id, (notFound: boolean) => {
        if (notFound) {
          reject(new Error(`Error deleting user with id ${id}`));
        } else {
          resolve(true);
        }
      });
    });
  }
}

export default new UserService();
