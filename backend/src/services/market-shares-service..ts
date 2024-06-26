import MarketShares from '../models/MarketShares';
import marketSharesRepository from '../repositories/market-shares-repository';

class MarketSharesService {
  async addNewMarketShares(marketSharesData: MarketShares): Promise<number | null> {
    return new Promise((resolve, reject) => {
      marketSharesRepository.addNew(marketSharesData, (lastID: number | undefined) => {
        if (lastID === undefined) {
          reject(new Error('Error inserting new market share'));
        } else {
          resolve(lastID);
        }
      });
    });
  }

  async getAllMarketShares(): Promise<MarketShares[]> {
    return new Promise((resolve, reject) => {
      marketSharesRepository.getAllMarketShares((marketShares: MarketShares[]) => {
        resolve(marketShares);
      });
    });
  }

  async getMarketSharesById(id: number): Promise<MarketShares | null> {
    return new Promise((resolve, reject) => {
      marketSharesRepository.getMarketSharesById(id, (marketShares: MarketShares | undefined) => {
        if (!marketShares) {
          resolve(null);
        } else {
          resolve(marketShares);
        }
      });
    });
  }

  async updateMarketShares(id: number, updatedMarketShares: MarketShares): Promise<void> {
    return new Promise((resolve, reject) => {
      marketSharesRepository.updateMarketShares(updatedMarketShares, (notFound: boolean) => {
        if (notFound) {
          reject(new Error(`Market share with id ${id} not found`));
        } else {
          resolve();
        }
      });
    });
  }

  async deleteMarketShares(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      marketSharesRepository.deleteMarketShares(id, (notFound: boolean) => {
        if (notFound) {
          reject(new Error(`Market share with id ${id} not found`));
        } else {
          resolve();
        }
      });
    });
  }
  async getMarketSharesByTicker(ticker: string): Promise<MarketShares | null> {
    return new Promise((resolve, reject) => {
      marketSharesRepository.getMarketSharesByTicker(ticker, (marketShares: MarketShares | undefined) => {
        if (!marketShares) {
          resolve(null);
        } else {
          resolve(marketShares);
        }
      });
    });
  }
}

export default new MarketSharesService();
