import { Router } from 'express';
import DailyReportController from '../../controllers/etl/daily-report-controller';

const router = Router();

router.get('/daily-reports', DailyReportController.showAll);
router.get('/daily-reports/:id', DailyReportController.show);

export default router;
