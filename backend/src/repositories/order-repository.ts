import { Database } from 'sqlite3';
import { initializeDB } from '../config/database';
import { Order } from '../models/Order';

let database: Database | null = null;

initializeDB().then(db => {
  database = db;
}).catch(err => {
  console.error('Failed to initialize database:', err);
});

const OrderRepository = {
  async create(order: Order): Promise<number> {
    try {
      if (!database) {
        throw new Error('Database not initialized');
      }
  
      const { executor, accountId, marketShare, createdAt, quantity, updatedAt, action, value, status } = order;
  
      const insertQuery = `
        INSERT INTO orders (executor_id, account_id, share_id, createdAt, quantity, updatedAt, action, value, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
      `;
  
      const executorId = executor.id; 
      const shareId = marketShare.id;
      const createdAtString = createdAt.toISOString();
      const updatedAtString = updatedAt.toISOString();
  
      return new Promise<number>((resolve, reject) => {
        database?.run(insertQuery, [executorId, accountId, shareId, createdAtString, quantity, updatedAtString, action, value, status], function (err) {
          if (err) {
            console.error('Error inserting order:', err);
            reject(err);
          } else {
            console.log(`Order inserted with id ${this.lastID}`);
            resolve(this.lastID);
          }
        });
      });
  
    } catch (err) {
      console.error('Error creating order:', err);
      throw err;
    }
  },  

  getById(id: number): Promise<Order | null> {
    return new Promise((resolve, reject) => {
      if (!database) {
        console.error('Database is not initialized');
        resolve(null);
        return;
      }
  
      const sql = "SELECT * FROM orders WHERE id = ?";
      const params = [id];
      database.get(sql, params, (err: Error | null, row: Order) => {
        if (err) {
          console.error(`Error fetching order with id ${id}:`, err);
          resolve(null);
        } else {
          resolve(row);
        }
      });
    });
  }, 

  async delete(id: number): Promise<void> {
    try {
      if (!database) {
        throw new Error('Database not initialized');
      }

      const deleteQuery = `
        DELETE FROM orders WHERE id = ?;
      `;

      await new Promise<void>((resolve, reject) => {
        database?.run(deleteQuery, [id], function (err) {
          if (err) {
            console.error('Error deleting order:', err);
            reject(err);
          } else {
            console.log(`Order deleted with id ${id}`);
            resolve();
          }
        });
      });

    } catch (err) {
      console.error('Error deleting order:', err);
      throw err;
    }
  },

  async getAllByField(fieldName: string, value: any): Promise<Order[]> {
    try {
      if (!database) {
        throw new Error('Database not initialized');
      }
  
      const sql = `SELECT * FROM orders WHERE ${fieldName} = ?`;
      const params = [value];
  
      return new Promise<Order[]>((resolve, reject) => {
        database?.all(sql, params, (err: Error | null, rows: Order[]) => {
          if (err) {
            console.error(`Error fetching orders where ${fieldName} = ${value}:`, err);
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    } catch (err) {
      console.error(`Error fetching orders where ${fieldName} = ${value}:`, err);
      throw err;
    }
  },

  getAllOrders: (): Promise<Order[]> => {
    return new Promise((resolve, reject) => {
      if (!database) {
        reject(new Error('Database is not initialized'));
        return;
      }

      const sql = "SELECT * FROM orders"; 
      const params: any[] = [];

      database.all(sql, params, (err: Error | null, rows: Order[]) => {
        if (err) {
          console.error('Error fetching all orders:', err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },

  async getOrdersByUserId(userId: number): Promise<Order[]> {
    try {
      if (!database) {
        throw new Error('Database not initialized');
      }

      const sql = `
        SELECT * FROM orders
        WHERE executor_id = ?
      `;
      const params = [userId];

      return new Promise<Order[]>((resolve, reject) => {
        database?.all(sql, params, (err: Error | null, rows: Order[]) => {
          if (err) {
            console.error(`Error fetching orders for userId ${userId}:`, err);
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });

    } catch (err) {
      console.error(`Error fetching orders for userId ${userId}:`, err);
      throw err;
    }
  },

  async getOrdersByAccountId(accountId: number): Promise<Order[]> {
    try {
      if (!database) {
        throw new Error('Database not initialized');
      }

      const sql = `
        SELECT * FROM orders
        WHERE account_id = ?
      `;
      const params = [accountId];

      return new Promise<Order[]>((resolve, reject) => {
        database?.all(sql, params, (err: Error | null, rows: Order[]) => {
          if (err) {
            console.error(`Error fetching orders for accountId ${accountId}:`, err);
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });

    } catch (err) {
      console.error(`Error fetching orders for accountId ${accountId}:`, err);
      throw err;
    }
  },

  cancelOrderById: async (orderId: number): Promise<void> => {
    try {
      if (!database) {
        throw new Error('Database not initialized');
      }
  
      const updatedAt = new Date().toISOString();
      const status = 'CANCELLED';
  
      const updateQuery = `
        UPDATE orders
        SET status = ?, updatedAt = ?
        WHERE id = ?;
      `;
  
      await new Promise<void>((resolve, reject) => {
        database?.run(updateQuery, [status, updatedAt, orderId], function (err) {
          if (err) {
            console.error('Error updating order status:', err);
            reject(err);
          } else {
            console.log(`Order with id ${orderId} cancelled successfully`);
            resolve();
          }
        });
      });
  
    } catch (err) {
      console.error('Error cancelling order:', err);
      throw err;
    }
  },
    async getAllOrdersForMarketShare(shareId: number): Promise<any[]> {
   
    return new Promise((resolve, reject) => {
      const query = `
        SELECT *
        FROM orders
        WHERE share_id  = ?
        ORDER BY createdAt DESC;`;

        database?.all(query, [shareId], (err, rows) => {
        if (err) {
          console.error('Error fetching orders:', err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
  
};


export default OrderRepository;
