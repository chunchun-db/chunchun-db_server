import { ICollection, IRecord } from '@chunchun-db/shared';

import { writeFile, readFile } from '@services/FileService';
import { generateId } from '@utils/index';

export class FileCollection<T extends IRecord> implements ICollection<T> {
    constructor(public name: string, private path: string) {}

    async getAll(): Promise<T[]> {
        const items = await readFile<T[]>(this.path);

        return items || [];
    }

    async add(
        newItems: Array<Omit<T, 'id'> & Partial<Pick<T, 'id'>>>
    ): Promise<void> {
        const oldItems = await this.getAll();

        let lastId = oldItems[oldItems.length - 1]?.id;
        const nextId = generateId(lastId);

        const newItemsWithIds = newItems.map(
            (item) => ({ ...item, id: nextId() } as T)
        );
        const items = oldItems.concat(newItemsWithIds);

        await writeFile(this.path, items);
    }

    async remove(items: T['id'][]): Promise<void> {
        const oldItems = await this.getAll();
        const updatedItems = oldItems.filter(
            (item) => !items.includes(item.id)
        );

        await writeFile(this.path, updatedItems);
    }

    async removeAll(): Promise<void> {
        await writeFile(this.path, []);
    }

    async update(item: T): Promise<void> {
        const oldItems = await this.getAll();
        const updatedItems = oldItems.map((i) => (i.id === item.id ? item : i));

        await writeFile(this.path, updatedItems);
    }
}
