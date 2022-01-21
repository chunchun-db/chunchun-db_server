import { ICollection, IRecord } from '@chunchun-db/shared';

import { writeFile, readFile } from '@services/FileService';
// import { generateId } from '@utils/index';
export class FileCollection<T extends IRecord> implements ICollection<T> {
  constructor(public name: string, private path: string) {}

  async getAll(): Promise<T[]> {
    const items = await readFile<Record<T['id'], T>>(this.path);

    return Object.values(items ?? {})
  }

  async getIndexed(): Promise<Record<string, T>> {
    const items = await readFile<Record<T['id'], T>>(this.path);

    return items ?? {};
  }

  async add(newItems: Array<Omit<T, 'id'> & Partial<Pick<T, 'id'>>>): Promise<void> {
    const oldItems = await this.getIndexed();

    // let lastId = oldItems[oldItems.length - 1]?.id;

    const newItemsWithIds = newItems.map((item, index) => ({ ...item, id: item.id ?? String(index) } as T));
    const newDictionary = newItemsWithIds.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
    }, {} as Record<string, T>);

    const items = {
        ...oldItems,
        ...newDictionary,
    };

    await writeFile(this.path, items);
  }

  async remove(items: T['id'][]): Promise<void> {
    const oldItems = await this.getIndexed();
    // const updatedItems = oldItems.filter((item) => !items.includes(item.id));
    items.forEach(itemId => delete oldItems[itemId]);

    await writeFile(this.path, oldItems);
  }

  async removeAll(): Promise<void> {
    await writeFile(this.path, {});
  }

  async update(item: T): Promise<void> {
    const items = await this.getIndexed();
    items[item.id] = item;

    await writeFile(this.path, item);
  }
}
