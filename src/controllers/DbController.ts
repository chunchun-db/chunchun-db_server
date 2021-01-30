import express from 'express';
import { IDbClient } from '@chunchun-db/shared';

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

dbRouter.get('/getAll', async (req, res) => {
    const dbs = await dbClient.getAllDatabases();

    return res.json(dbs.map((db) => ({ name: db.name })));
});

dbRouter.put('/:dbName/collections/create', async (req, res) => {
    if (!req.query.name) {
        return res.status(400).json({ message: 'No name provided' });
    }

    const { dbName } = req.params;
    const { name } = req.query;

    const db = await dbClient.getDatabase(dbName);
    await db.createCollection(String(name));

    return res.json({ message: 'Ok ' });
});

dbRouter.get('/:dbName/collections/checkIfExist', async (req, res) => {
    const { dbName } = req.params;
    const { name } = req.query;

    try {
        await dbClient
            .getDatabase(dbName)
            .then((db) => db.getCollection(String(name)));

        res.json(true);
    } catch {
        res.json(false);
    }
});

dbRouter.get('/:dbName/collections/checkIfExist', async (req, res) => {
    const { dbName } = req.params;
    const { name } = req.query;

    try {
        await dbClient
            .getDatabase(dbName)
            .then((db) => db.getCollection(String(name)));

        res.json(true);
    } catch {
        res.json(false);
    }
});

dbRouter.get('/:dbName/collections/getAll', async (req, res) => {
    const { dbName } = req.params;

    const collections = await dbClient
        .getDatabase(dbName)
        .then((db) => db.getAllCollections());

    res.json(collections.map((col) => ({ name: col.name })));
});

dbRouter.use('/:dbName/collections/:name', controllersRouter);
