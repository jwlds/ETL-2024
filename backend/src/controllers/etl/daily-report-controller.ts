import { NextFunction, Request, Response } from 'express';
import dailyReportService from '../../services/etl/daily-report-service';
import DailyReport from '../../models/etl/Report';

class DailyReportController {
 

  async showAll(req: Request, res: Response, next: NextFunction) {
    try {
      const reports = await dailyReportService.getAllReports();
      return res.status(200).json({
        status: 'success',
        message: 'All daily reports retrieved successfully.',
        payload: reports,
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
      const reportId = parseInt(req.params.id, 10);
      const report = await dailyReportService.getReportById(reportId);

      if (!report) {
        return res.status(404).json({
          status: 'error',
          message: `Daily report with id ${reportId} not found.`,
          payload: [],
        });
      }

      return res.status(200).json({
        status: 'success',
        message: 'Daily report retrieved successfully.',
        payload: report,
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

export default new DailyReportController();
