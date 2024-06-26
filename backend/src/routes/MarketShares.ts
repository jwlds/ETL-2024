import express from 'express';
import MarketSharesController from '../controllers/market-share-controller';

const router = express.Router();


router.post('/create', MarketSharesController.create);
router.get('/catalog', MarketSharesController.catalog);
router.get('/get/:marketSharesId', MarketSharesController.show);
router.put('/update/:marketSharesId', MarketSharesController.update);
router.delete('/delete/:marketSharesId', MarketSharesController.destroy);
router.get('/marketShares/:ticker', MarketSharesController.getByTicker);

export default router;
