import express, { Express, Request, Response, NextFunction } from 'express';
import http from 'http';
import reportRoutes from './routes/etl/DailyReport';
import { config } from './config/index';
import ChalkLog from './library/ChalkLog';
import { initializeDBETL } from './config/etl/database-etl';

const router: Express = express();

initializeDBETL()
  .then(() => {
    ChalkLog.info('Connected to SQLite database');
    startServer();
  })
  .catch((error: Error) => {
    ChalkLog.error('Unable to connect to SQLite database:');
    ChalkLog.error(error);
  });

const startServer = (): void => {
  router.use((req: Request, res: Response, next: NextFunction) => {
    ChalkLog.info(`IP:[${req.socket.remoteAddress}]/nURL:[${req.url}]Method:[${req.method}]`);
    res.on('finish', () => {
      ChalkLog.info(`Status:[${res.statusCode}] || IP:[${req.socket.remoteAddress}] || URL:[${req.url}] || Method:[${req.method}]`);
    });

    next();
  });

  router.use(express.urlencoded({ extended: true }));
  router.use(express.json());

  router.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
      return res.status(200).json({});
    }

    next();
  });

  router.use('/report', reportRoutes);

  router.get('/ping', (req: Request, res: Response, next: NextFunction) => res.status(200).json({ status: 'ok' }));

  router.use((req: Request, res: Response, next: NextFunction) => {
    const error = new Error('Not found') as any;
    ChalkLog.error(error);
    res.status(404).json({
      message: error.message
    });
  });

  http.createServer(router).listen(config.server.port_etl, () => ChalkLog.info(`Server is running on port ${config.server.port_etl}`));
};
