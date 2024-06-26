import express from 'express';
import UserController from '../controllers/user-controller';

const router = express.Router();

router.post('/create', UserController.create);
router.post('/openAccount', UserController.openAccount);
router.post('/createOrder', UserController.createOrder);

router.get('/get', UserController.showAll);
router.get('/get/:userId', UserController.show);

router.get('/accounts/:userId', UserController.showAllAccounts);
router.get('/orders/', UserController.getAllOrders);
router.get('/orders/:userId', UserController.getOrdersByUserId);
router.get('/orders-acc/:accountId', UserController.getOrdersByAccountId);


router.put('/update/:userId', UserController.update);
router.put('/cancelOrder/:orderId', UserController.cancelOrder);

router.delete('/delete/:userId', UserController.destroy);
router.delete('/deleteAccount/:accountId', UserController.deleteAccount);

export = router;