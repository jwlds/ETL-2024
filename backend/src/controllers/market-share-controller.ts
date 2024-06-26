import { NextFunction, Request, Response } from 'express';
import MarketSharesService from '../services/market-shares-service.';
import MarketShares from '../models/MarketShares';
import OrderRepository from '../repositories/order-repository';

interface ResponsePayloadItem {
  id?: number;
  name: string;
  ticker: string;
  lastPrice: number | null;
}

class MarketSharesController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const marketSharesData = req.body as MarketShares;
      const marketSharesId = await MarketSharesService.addNewMarketShares(marketSharesData);

      return res.status(201).json({
        status: 'success',
        message: 'Market share created successfully.',
        payload: { ...marketSharesData, id: marketSharesId },
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

  async catalog(req: Request, res: Response, next: NextFunction) {
    try {
      const marketShares = await MarketSharesService.getAllMarketShares();
  
      const responsePayload: ResponsePayloadItem[] = [];
  
      for (const marketShare of marketShares) {

        if (marketShare.id === undefined) {
          continue;
        }
  
        const orders = await OrderRepository.getAllOrdersForMarketShare(marketShare.id);
  
        let lastPrice = null;
  
        if (orders.length > 0) {
          const lastOrder = orders[0];
          lastPrice = lastOrder.value / lastOrder.quantity;
        }
  
        responsePayload.push({
          id: marketShare.id,
          name: marketShare.name,
          ticker: marketShare.ticker,
          lastPrice: lastPrice,
        });
      }
  
      return res.status(200).json({
        status: 'success',
        message: 'All market shares retrieved successfully.',
        payload: responsePayload,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: 'error',
        message: null,
        payload: [],
      });
    }
  }
  

  async show(req: Request, res: Response, next: NextFunction) {
    try {
      const marketSharesId = parseInt(req.params.marketSharesId, 10);
      const marketShares = await MarketSharesService.getMarketSharesById(marketSharesId);
      
      if (!marketShares) {
        return res.status(404).json({
          status: 'error',
          message: `Market share with id ${marketSharesId} not found.`,
          payload: [],
        });
      }

      return res.status(200).json({
        status: 'success',
        message: 'Market share retrieved successfully.',
        payload: marketShares,
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
      const marketSharesId = parseInt(req.params.marketSharesId, 10);
      const updatedMarketShares = req.body as MarketShares;

      await MarketSharesService.updateMarketShares(marketSharesId, updatedMarketShares);
      
      return res.status(200).json({
        status: 'success',
        message: 'Market share updated successfully.',
        payload: updatedMarketShares,
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
      const marketSharesId = parseInt(req.params.marketSharesId, 10);
      await MarketSharesService.deleteMarketShares(marketSharesId);
      
      return res.status(200).json({
        status: 'success',
        message: 'Market share deleted successfully.',
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
  async getByTicker(req: Request, res: Response, next: NextFunction) {
    try {
      const ticker = req.params.ticker;

      const marketShare = await MarketSharesService.getMarketSharesByTicker(ticker);

      if (!marketShare) {
        return res.status(404).json({
          status: 'error',
          message: `Market share with ticker ${ticker} not found.`,
          payload: null,
        });
      }

      return res.status(200).json({
        status: 'success',
        message: 'Market share found.',
        payload: marketShare,
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

export default new MarketSharesController();
