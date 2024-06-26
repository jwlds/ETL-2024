import { NextFunction, Request, Response } from 'express';
import UserService from '../services/user-service';
import AccountService from '../services/account-service';
import User from '../models/User';
import Account from '../models/Account';
import { Order, OrderAction } from '../models/Order';
import OrderService from '../services/order-service';

class UserController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userData: User = req.body as User;
      const user = await UserService.addNew(userData); // Cria o usuário

      if (!user) {
        throw new Error('Failed to create user');
      }
   
      const accountId = await AccountService.addNewAccount(user);

      return res.status(201).json({
        status: 'success',
        message: 'User and account created successfully.',
        payload: { ...userData, id: user.id, accountId },
      });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({
        status: 'error',
        message: err.message,
        payload: [],
      });
    }
  }

  async openAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = parseInt(req.params.userId, 10);
      

      const user = await UserService.getById(userId);
      
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: `User with id ${userId} not found.`,
          payload: [],
        });
      }
   
      const account = await AccountService.addNewAccount(user);
      
      return res.status(201).json({
        status: 'success',
        message: 'Account created successfully.',
        payload: account,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: 'error',
        message: (err as Error).message,
        payload: [],
      });
    }
  }

  async deleteAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const accountId = parseInt(req.params.accountId, 10);
      
   
      await AccountService.deleteAccount(accountId);
      
      return res.status(200).json({
        status: 'success',
        message: 'Account deleted successfully.',
        payload: [],
      });
    } catch (err) {
      console.error(err);
      return res.status(404).json({
        status: 'error',
        message: (err as Error).message,
        payload: [],
      });
    }
  }
  async getAccountById(req: Request, res: Response, next: NextFunction) {
    try {
      const accountId = parseInt(req.params.accountId, 10);
      const account = await AccountService.getAccountById(accountId);
      
      if (!account) {
        return res.status(404).json({
          status: 'error',
          message: `Account with id ${accountId} not found.`,
          payload: [],
        });
      }

      return res.status(200).json({
        status: 'success',
        message: 'Account retrieved successfully.',
        payload: account,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: 'error',
        message: (err as Error).message,
        payload: [],
      });
    }
  }

  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { executorId, ticker, quantity, action, value }: { executorId: number, ticker: string, quantity: number, action: OrderAction, value: number, accountId: number} = req.body;

   
      if (!executorId || !ticker || !quantity || !action || !value) {
        throw new Error('Missing required parameters for creating order');
      }


      const executor: User | null = await UserService.getById(executorId);

      if (!executor) {
        return res.status(404).json({
          status: 'error',
          message: `Executor with id ${executorId} not found.`,
          payload: [],
        });
      }

  
      const orderId: number = await OrderService.createOrder(executor, ticker, quantity, action, value, executorId);

      return res.status(201).json({
        status: 'success',
        message: 'Order created successfully.',
        payload: { orderId },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: 'error',
        message: (err as Error).message,
        payload: [],
      });
    }
  }

  async cancelOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const orderId = parseInt(req.params.orderId, 10);

      console.log(orderId)

      await OrderService.cancelOrder(orderId);

      return res.status(200).json({
        status: 'success',
        message: `Order with id ${orderId} cancelled successfully.`,
        payload: [],
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: 'error',
        message: (err as Error).message,
        payload: [],
      });
    }
  }

  async showAllAccounts(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = parseInt(req.params.userId, 10);
      
     
      const accounts = await AccountService.getAccountsByUserId(userId);
      
      return res.status(200).json({
        status: 'success',
        message: `All accounts for user with id ${userId} retrieved successfully.`,
        payload: accounts,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: 'error',
        message: (err as Error).message,
        payload: [],
      });
    }
  }

  async show(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = parseInt(req.params.userId, 10);
      const user = await UserService.getById(userId);
      return res.status(200).json({
        status: 'success',
        message: 'User found.',
        payload: user,
      });
    } catch (err) {
      return res.status(404).json({
        status: 'error',
        message: (err as Error).message,
        payload: [],
      });
    }
  }

  async showAll(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserService.getAllUsers();
      return res.status(200).json({
        status: 'success',
        message: 'All registered users',
        payload: users,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: 'error',
        message: (err as Error).message,
        payload: [],
      });
    }
  }

  async getAllOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const orders = await OrderService.getAllOrders();
      return res.status(200).json({
        status: 'success',
        message: 'All registered users',
        payload: orders,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: 'error',
        message: (err as Error).message,
        payload: [],
      });
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = parseInt(req.params.userId, 10);
      const updateUser = req.body as User;
      await UserService.update(userId, updateUser);
      return res.status(200).json({
        status: 'success',
        message: 'User updated successfully',
        payload: updateUser,
      });
    } catch (err) {
      console.error(err);
      return res.status(422).json({
        status: 'error',
        message: (err as Error).message,
        payload: [],
      });
    }
  }

  async destroy(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = parseInt(req.params.userId, 10);
      await UserService.delete(userId);
      return res.status(200).json({
        status: 'success',
        message: 'Successfully deleted user',
        payload: [],
      });
    } catch (err) {
      console.error(err);
      return res.status(404).json({
        status: 'error',
        message: (err as Error).message,
        payload: [],
      });
    }
  }

  async getOrdersByUserId(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = parseInt(req.params.userId, 10);
      const orders: Order[] = await OrderService.getOrdersByUserId(userId);

      return res.status(200).json({
        status: 'success',
        message: `Orders for user with id ${userId} retrieved successfully.`,
        payload: orders,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: 'error',
        message: (err as Error).message,
        payload: [],
      });
    }
  }

  async getOrdersByAccountId(req: Request, res: Response, next: NextFunction) {
    try {
      const accountId = parseInt(req.params.accountId, 10);
      const orders: Order[] = await OrderService.getOrdersByAccountId(accountId);

      return res.status(200).json({
        status: 'success',
        message: `Orders for account with id ${accountId} retrieved successfully.`,
        payload: orders,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: 'error',
        message: (err as Error).message,
        payload: [],
      });
    }
  }
}

export default new UserController();
