// src/services/dailyReportService.ts

import dailyReportRepository from '../../repositories/etl/daily-report-repository';
import DailyReport from '../../models/etl/Report';
import { Order } from '../../models/Order';
function transformOrderToDailyReport(order: Order): DailyReport {
    return {
      ticker: order.marketShare.ticker,
      createdAt: order.createdAt.toISOString(),
      quantity: order.quantity,
      liquidity: order.value * order.quantity,
    };
  }
class DailyReportService {
  public async addNewReport(order: Order): Promise<number | undefined> {
    return new Promise((resolve, reject) => {
        const dailyReport: DailyReport = transformOrderToDailyReport(order);
        dailyReportRepository.addNew(dailyReport, (lastID) => {
          if (lastID) {
            resolve(lastID);
          } else {
            reject(new Error('Failed to add new report'));
          }
        });
      });
  }

  public async getAllReports(): Promise<DailyReport[]> {
    return new Promise((resolve, reject) => {
      dailyReportRepository.getAllReports((reports) => {
        resolve(reports);
      });
    });
  }

  public async getReportById(id: number): Promise<DailyReport | undefined> {
    return new Promise((resolve, reject) => {
      dailyReportRepository.getReportById(id, (report) => {
        if (report) {
          resolve(report);
        } else {
          reject(new Error(`Report with id ${id} not found`));
        }
      });
    });
  }

  public async updateReport(report: DailyReport): Promise<boolean> {
    return new Promise((resolve, reject) => {
      dailyReportRepository.updateReport(report, (notFound) => {
        if (notFound) {
          reject(new Error(`Report with id ${report.id} not found`));
        } else {
          resolve(true);
        }
      });
    });
  }

  public async deleteReport(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      dailyReportRepository.deleteReport(id, (notFound) => {
        if (notFound) {
          reject(new Error(`Report with id ${id} not found`));
        } else {
          resolve(true);
        }
      });
    });
  }

  public async getReportsByTicker(ticker: string): Promise<DailyReport[]> {
    return new Promise((resolve, reject) => {
      dailyReportRepository.getReportsByTicker(ticker, (reports) => {
        resolve(reports);
      });
    });
  }
}

export default new DailyReportService();
