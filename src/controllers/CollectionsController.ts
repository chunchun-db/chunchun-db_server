import express from 'express';
import { IRecord } from '@chunchun-db/shared';

import { dbClient } from '../diContainer';

export const controllersRouter = express.Router({ mergeParams: true });

controllersRouter.get('/getAll', async (req, res) => {
    const { dbName, name } = req.params;

    const collection = await dbClient
        .getDatabase(dbName)
        .then((db) => db.getCollection(name));

    const items = await collection.getAll();

    return res.json(items);
});

controllersRouter.post('/add', async (req, res) => {
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

controllersRouter.delete('/remove', async (req, res) => {
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

controllersRouter.delete('/removeAll', async (req, res) => {
    const { dbName, name } = req.params;

    const collection = await dbClient
        .getDatabase(dbName)
        .then((db) => db.getCollection(name));
    await collection.removeAll();

    return res.json({ message: 'Ok ' });
});

controllersRouter.put('/update', async (req, res) => {
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
