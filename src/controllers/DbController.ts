import express from 'express';

import { IDbClient } from '@chunchun-db/shared/dist/IDbClient';

import { FileDbClient } from '../db/FileDbClient';
import { controllersRouter } from './CollectionsController';

export const dbRouter = express.Router({ mergeParams: true });

const dbClient: IDbClient = new FileDbClient();

dbRouter.get('/checkIfExist', async (req, res) => {
    if (!req.query.name) {
        return res.status(400).json({ message: 'No name provided' });
    }

    try {
        await dbClient.getDatabase(String(req.query.name));
        return res.json(true);
    } catch {
        return res.json(false);
    }
});

dbRouter.put('/create', async (req, res) => {
    if (!req.query.name) {
        return res.status(400).json({ message: 'No name provided' });
    }

    await dbClient.createDatabase(String(req.query.name));

    return res.json({ message: 'Ok ' });
});

dbRouter.use('/:dbName/collections', controllersRouter);
