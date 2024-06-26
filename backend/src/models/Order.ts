import User from "./User";
import MarketShares from "./MarketShares";

enum OrderAction {
  BUY = 'buy',
  SELL = 'sell',
  HOLD = 'hold',
}

enum OrderStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

type Order = {
  id?: number;
  executor: User;
  accountId: number;
  marketShare: MarketShares;
  createdAt: Date;
  quantity: number;
  updatedAt: Date;
  action: OrderAction;
  value: number;
  status: OrderStatus; 
};

export { Order, OrderAction, OrderStatus };
