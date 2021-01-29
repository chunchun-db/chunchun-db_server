import express from 'express';
import { IRecord } from '@chunchun-db/shared/dist/IRecord';

import { dbClient } from '../diContainer';

export const controllersRouter = express.Router({ mergeParams: true });

controllersRouter.put('/create', async (req, res) => {
    if (!req.query.name) {
        return res.status(400).json({ message: 'No name provided' });
    }

    const { dbName } = req.params;
    const { name } = req.query;

    const db = await dbClient.getDatabase(dbName);
    await db.createCollection(String(name));

    return res.json({ message: 'Ok ' });
});

controllersRouter.get('/checkIfExist', async (req, res) => {
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

controllersRouter.get('/:name/getAll', async (req, res) => {
    const { dbName, name } = req.params;

    const collection = await dbClient
        .getDatabase(dbName)
        .then((db) => db.getCollection(name));

    return res.json(JSON.stringify(await collection.getAll()));
});

controllersRouter.post('/:name/add', async (req, res) => {
    const { dbName, name } = req.params;
    const items = req.body as IRecord[];

    if (!items?.length) {
        return res.status(400).json({ message: 'No items provided' });
    }

    const collection = await dbClient
        .getDatabase(dbName)
        .then((db) => db.getCollection(name));
    await collection.add(items);

    return res.json({ message: 'Ok ' });
});

controllersRouter.delete('/:name/remove', async (req, res) => {
    const { dbName, name } = req.params;
    const ids = req.body;

    if (!ids?.length) {
        return res.status(400).json({ message: 'No items provided' });
    }

    const collection = await dbClient
        .getDatabase(dbName)
        .then((db) => db.getCollection(name));
    await collection.remove(ids);

    return res.json({ message: 'Ok ' });
});

controllersRouter.put('/:name/update', async (req, res) => {
    const { dbName, name } = req.params;
    const item = req.body as IRecord;

    if (!item || !item.id) {
        return res.status(400).json({ message: 'Incorrect item provided' });
    }

    const collection = await dbClient
        .getDatabase(dbName)
        .then((db) => db.getCollection(name));
    await collection.update(item);

    return res.json({ message: 'Ok ' });
});
