import { Router } from 'express';

import { dbRouter } from './DbController';

export const indexRouter = Router();

indexRouter.use('/db', dbRouter);

indexRouter.get('/checkAvailability', (req, res) => {
    res.status(200).json({ message: 'Ok' });
});
