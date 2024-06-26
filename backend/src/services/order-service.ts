import { Order, OrderAction, OrderStatus } from '../models/Order';
import OrderRepository from '../repositories/order-repository';
import User from '../models/User';
import MarketShares from '../models/MarketShares';
import MarketSharesService from '../services/market-shares-service.';
import dailyReportService from './etl/daily-report-service';

const OrderService = {
  async createOrder(executor: User,ticker: string, quantity: number, action: OrderAction, value: number, accountId: number): Promise<number> {
    try {

      const createdAt = new Date();
      const updatedAt = new Date();
      

      const marketShare: MarketShares | null = await MarketSharesService.getMarketSharesByTicker(ticker);


      if (!marketShare) {
        throw new Error(`Market share with ticker ${ticker} not found.`);
      }

      const status: OrderStatus = OrderStatus.PENDING;


      const order: Order = {
        executor,
        accountId,
        marketShare,
        createdAt,
        quantity,
        updatedAt,
        action,
        value,
        status, 
      };

      await dailyReportService.addNewReport(order);

  
      const orderId: number = await OrderRepository.create(order);

    
      return orderId;
    } catch (err) {
      console.error('Error creating order:', err);
      throw err; 
    }
  },
  async getOrdersByUserId(userId: number): Promise<Order[]> {
    try {
   
      const orders: Order[] = await OrderRepository.getOrdersByUserId(userId);
      return orders;
    } catch (err) {
      console.error(`Error fetching orders for userId ${userId}:`, err);
      throw err;
    }
  },
  async getOrdersByAccountId(accountId: number): Promise<Order[]> {
    try {
    
      const orders: Order[] = await OrderRepository.getOrdersByAccountId(accountId);
      return orders;
    } catch (err) {
      console.error(`Error fetching orders for acScountId ${accountId}:`, err);
      throw err;
    }
  },

  async cancelOrder(orderId: number): Promise<void> {
    try {
   
      await OrderRepository.cancelOrderById(orderId);
      console.log(`Order with id ${orderId} cancelled successfully`);
    } catch (err) {
      console.error('Error cancelling order:', err);
      throw err; 
    }
  },
  async getAllOrders(): Promise<Order[]> {
    try {
     
      const orders: Order[] = await OrderRepository.getAllOrders();
      return orders;
    } catch (err) {
      console.error('Error fetching all orders:', err);
      throw err;
    }
  },
}

export default OrderService;
