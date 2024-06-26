import { NextFunction, Request, Response } from 'express';
import AccountService from '../services/account-service';
import userService from '../services/user-service';
import User from '../models/User';

class AccountController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = parseInt(req.params.userId, 10);

      const user = await userService.getById(userId);

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
  async showAll(req: Request, res: Response, next: NextFunction) {
    try {
      const accounts = await AccountService.getAllAccounts();
      return res.status(200).json({
        status: 'success',
        message: 'All accounts retrieved successfully.',
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


  async destroy(req: Request, res: Response, next: NextFunction) {
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
}

export default new AccountController();
