import { Database } from 'sqlite3';
import { initializeDB } from '../config/database';
import MarketShares from '../models/MarketShares';

let database: Database;

initializeDB().then(db => {
  database = db;
}).catch(err => {
  console.error('Failed to initialize database:', err);
});

const marketSharesRepository = {
  addNew: (marketShares: MarketShares, callback: (lastID?: number) => void): void => {
    const sql = "INSERT INTO shares (ticker, name, current_value) VALUES (?, ?, ?)";
    const params = [marketShares.ticker, marketShares.name, marketShares.current_value];
    
    database.run(sql, params, function (err: Error | null) {
      if (err) {
        console.error('Error inserting new market share:', err);
        callback(undefined);
      } else {
        marketShares.id = this.lastID;
        callback(marketShares.id);
      }
    });
  },

  getAllMarketShares: (callback: (marketShares: MarketShares[]) => void): void => {
    const sql = "SELECT * FROM shares";
    const params: any[] = [];

    database.all(sql, params, (err: Error | null, rows: MarketShares[]) => {
      if (err) {
        console.error('Error fetching all market shares:', err);
        callback([]);
      } else {
        callback(rows);
      }
    });
  },

  getMarketSharesById: (id: number, callback: (marketShares?: MarketShares) => void): void => {
    const sql = "SELECT * FROM shares WHERE id = ?";
    const params = [id];

    database.get(sql, params, (err: Error | null, row: MarketShares) => {
      if (err) {
        console.error(`Error fetching market share with id ${id}:`, err);
        callback(undefined);
      } else {
        callback(row);
      }
    });
  },

  updateMarketShares: (marketShares: MarketShares, callback: (notFound: boolean) => void): void => {
    const sql = "UPDATE shares SET ticker = ?, name = ?, current_value = ? WHERE id = ?";
    const params = [marketShares.ticker, marketShares.name, marketShares.current_value, marketShares.id];

    database.run(sql, params, function (err: Error | null) {
      if (err) {
        console.error(`Error updating market share with id ${marketShares.id}:`, err);
        callback(true);
      } else {
        callback(this.changes === 0);
      }
    });
  },

  deleteMarketShares: (id: number, callback: (notFound: boolean) => void): void => {
    const sql = "DELETE FROM shares WHERE id = ?";
    const params = [id];

    database.run(sql, params, function (err: Error | null) {
      if (err) {
        console.error(`Error deleting market share with id ${id}:`, err);
        callback(true);
      } else {
        callback(this.changes === 0);
      }
    });
  },
  
  getMarketSharesByTicker: (ticker: string, callback: (marketShares?: MarketShares) => void): void => {
    const sql = "SELECT * FROM shares WHERE ticker = ?";
    const params = [ticker];

    database.get(sql, params, (err: Error | null, row: MarketShares) => {
      if (err) {
        console.error(`Error fetching market share with ticker ${ticker}:`, err);
        callback(undefined);
      } else {
        callback(row);
      }
    });
  }
};

export default marketSharesRepository;
