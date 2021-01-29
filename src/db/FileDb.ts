import * as path from 'path';
import { IRecord, IDatabase } from '@chunchun-db/shared/dist';

import { isFileExists, renameFile, writeFile } from '@services/FileService';

import { FileCollection } from './FileCollection';

export class FileDb implements IDatabase {
    name: string;
    path: string;

    constructor(name: string, path: string) {
        this.name = name;
        this.path = path;
    }

    getCollectionFileName(collectionName: string) {
        return `${path.join(this.path, collectionName)}.json`;
    }

    async createCollection<T extends IRecord>(name: string) {
        const fileName = this.getCollectionFileName(name);
        const isExist = await isFileExists(fileName);

        if (isExist) {
            throw new Error('collection with that name already exist');
        }

        await writeFile(fileName, []);

        return new FileCollection<T>(name, fileName);
    }

    async rename(newName: string) {
        const newPath = this.path.replace(new RegExp(this.name + '$'), newName);
        await renameFile(this.path, newPath);

        this.name = newName;
        this.path = newPath;
    }

    async getCollection<T extends IRecord>(name: string) {
        const fileName = this.getCollectionFileName(name);

        if (!(await isFileExists(fileName))) {
            throw new Error('no collection found');
        }

        return new FileCollection<T>(name, fileName);
    }
}
