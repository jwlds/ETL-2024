import express from 'express';
import AccountController from '../controllers/account-controller';

const router = express.Router();

router.post('/create/:userId', AccountController.create);
router.get('/get', AccountController.showAll);
router.get('/get/:accountId', AccountController.show);
router.delete('/delete/:accountId', AccountController.destroy);

export default router;
