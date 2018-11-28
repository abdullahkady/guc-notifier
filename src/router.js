import { Router } from 'express';

const router = new Router();

router.use('/', (req, res, next) => res.send('Hello! :)'));

export default router;
