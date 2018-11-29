import { Router } from 'express';
import controller from './controller';

const router = new Router();

router.post('/', controller.subscribeUser);

export default router;
