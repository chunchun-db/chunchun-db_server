import { promises as fs } from 'fs';
import * as path from 'path';

export async function isFileExists(path: string): Promise<boolean> {
    return fs
        .access(path)
        .then(() => true)
        .catch(() => false);
}

export async function readFile<T>(path: string): Promise<T | null> {
    const isExist = await isFileExists(path);
    if (!isExist) {
        return null;
    }

    const data = await fs.readFile(path);

    return data ? JSON.parse(data.toString()) : null;
}

export async function writeFile(pathName: string, data: any): Promise<void> {
    const serialized = JSON.stringify(data);

    await fs.mkdir(path.dirname(pathName), { recursive: true });
    await fs.writeFile(pathName, serialized);
}

export async function createFolder(path: string) {
    if (await isFileExists(path)) {
        throw new Error('folder already exist');
    }

    await fs.mkdir(path);
}

export async function renameFile(path: string, newName: string) {
    await fs.rename(path, newName);
}
