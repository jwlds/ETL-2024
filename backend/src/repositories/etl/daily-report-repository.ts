// src/repository/dailyReportRepository.ts

import { Database } from 'sqlite3';
import { initializeDBETL } from '../../config/etl/database-etl';
import DailyReport from '../../models/etl/Report';

let database: Database;

initializeDBETL().then(db => {
  database = db;
}).catch(err => {
  console.error('Failed to initialize database:', err);
});

const dailyReportRepository = {
  addNew: (report: DailyReport, callback: (lastID?: number) => void): void => {
    const sql = "INSERT INTO daily_reports (ticker, createdAt, quantity, liquidity) VALUES (?, ?, ?, ?)";
    const params = [report.ticker, report.createdAt, report.quantity, report.liquidity];
    
    database.run(sql, params, function (err: Error | null) {
      if (err) {
        console.error('Error inserting new daily report:', err);
        callback(undefined);
      } else {
        report.id = this.lastID;
        callback(report.id);
      }
    });
  },

  getAllReports: (callback: (reports: DailyReport[]) => void): void => {
    const sql = "SELECT * FROM daily_reports";
    const params: any[] = [];

    database.all(sql, params, (err: Error | null, rows: DailyReport[]) => {
      if (err) {
        console.error('Error fetching all daily reports:', err);
        callback([]);
      } else {
        callback(rows);
      }
    });
  },

  getReportById: (id: number, callback: (report?: DailyReport) => void): void => {
    const sql = "SELECT * FROM daily_reports WHERE id = ?";
    const params = [id];

    database.get(sql, params, (err: Error | null, row: DailyReport) => {
      if (err) {
        console.error(`Error fetching daily report with id ${id}:`, err);
        callback(undefined);
      } else {
        callback(row);
      }
    });
  },

  updateReport: (report: DailyReport, callback: (notFound: boolean) => void): void => {
    const sql = "UPDATE daily_reports SET ticker = ?, createdAt = ?, quantity = ?, liquidity = ? WHERE id = ?";
    const params = [report.ticker, report.createdAt, report.quantity, report.liquidity, report.id];

    database.run(sql, params, function (err: Error | null) {
      if (err) {
        console.error(`Error updating daily report with id ${report.id}:`, err);
        callback(true);
      } else {
        callback(this.changes === 0);
      }
    });
  },

  deleteReport: (id: number, callback: (notFound: boolean) => void): void => {
    const sql = "DELETE FROM daily_reports WHERE id = ?";
    const params = [id];

    database.run(sql, params, function (err: Error | null) {
      if (err) {
        console.error(`Error deleting daily report with id ${id}:`, err);
        callback(true);
      } else {
        callback(this.changes === 0);
      }
    });
  },

  getReportsByTicker: (ticker: string, callback: (reports: DailyReport[]) => void): void => {
    const sql = "SELECT * FROM daily_reports WHERE ticker = ?";
    const params = [ticker];

    database.all(sql, params, (err: Error | null, rows: DailyReport[]) => {
      if (err) {
        console.error(`Error fetching daily reports for ticker ${ticker}:`, err);
        callback([]);
      } else {
        callback(rows);
      }
    });
  }
};

export default dailyReportRepository;
