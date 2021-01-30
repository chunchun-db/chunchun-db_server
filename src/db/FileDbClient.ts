import * as path from 'path';
import { IDatabase, IDbClient } from '@chunchun-db/shared';

import {
    createFolder,
    isFileExists,
    getAllFilesInFolder,
} from '@services/FileService';

import { FileDb } from './FileDb';

const STORAGE_BASE_PATH = path.resolve('./storage');

export class FileDbClient implements IDbClient {
    getDatabaseFileName(dbName: string) {
        return path.join(STORAGE_BASE_PATH, dbName);
    }

    async getAllDatabases(): Promise<IDatabase[]> {
        const allFiles = await getAllFilesInFolder(STORAGE_BASE_PATH);

        return allFiles
            .filter((file) => file.isDirectory)
            .map(
                (file) =>
                    new FileDb(file.name, this.getDatabaseFileName(file.name))
            );
    }

    async getDatabase(name: string): Promise<IDatabase> {
        const dbFileName = this.getDatabaseFileName(name);
        const isDbExist = await isFileExists(dbFileName);

        if (!isDbExist) {
            throw new Error('database with that name does not exist');
        }

        return new FileDb(name, dbFileName);
    }

    async createDatabase(name: string): Promise<IDatabase> {
        const dbFileName = this.getDatabaseFileName(name);

        if (await isFileExists(dbFileName)) {
            throw new Error('database with that name already exist');
        }

        await createFolder(dbFileName);

        return new FileDb(name, dbFileName);
    }

    dropDatabase(): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
