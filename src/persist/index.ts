// This file contains the Persist class, which manages IndexedDB storage.
// It provides methods to get, save, remove, and clear data in the database.
// The class has the following public methods:
// - getData: Retrieves data from the database for a specified store name.
// - save: Saves data to the database for a specified store name.
// - remove: Removes data from the database for a specified key and store name.
// - removePartOfMap: Removes a part of the data from the database for a specified key.
// - clearThisInstance: Clears all data from the current instance of the Persist class.
// - clearAll: Clears all data from the database.

import { openDB, IDBPDatabase, deleteDB } from "idb";
import { storeNames } from "./config";

const defaultStore = storeNames[0];

type AuthDB<T> = {
  [K in storeNames]: T;
};

export class Persist<T extends Record<string, any>> {
  private static dbName = "DB";
  private dbPromise: Promise<IDBPDatabase<AuthDB<unknown>>> | null = null;
  private persisted: T;

  constructor(persisted: T) {
    this.persisted = persisted;
  }

  async getData(storeName: keyof AuthDB<T> = defaultStore): Promise<T> {
    try {
      const db = await this.getDB();
      const result: T = { ...this.persisted };

      for (const key of Object.keys(result) as (keyof T)[]) {
        result[key] = (await db.get(storeName, key as string)) || null;
      }

      return result;
    } catch (error) {
      this.dbPromise = null;

      try {
        await this.resetDatabase();
        await this.getDB();
      } catch (dbError) {
        console.error("Failed to reestablish database connection:", dbError);
      }

      return { ...this.persisted };
    }
  }

  async save(
    data: Partial<T>,
    storeName: keyof AuthDB<T> = defaultStore
  ): Promise<void> {
    const db = await this.getDB();
    for (const [key, value] of Object.entries(data)) {
      await db.put(storeName, value, key);
    }
  }

  async remove(
    key: keyof T,
    storeName: keyof AuthDB<T> = defaultStore
  ): Promise<void> {
    const db = await this.getDB();
    await db.delete(storeName, key as string);
  }

  /**
   * Removes a part of the map data for a specific key from the database
   * @param key - The key to remove from the store
   * @param storeName - The name of the store to remove data from, defaults to the configured default store
   * @returns Promise that resolves when the item is removed
   */
  async removePartOfMap(
    key: keyof T,
    storeName: string = defaultStore
  ): Promise<void> {
    const db = await this.getDB();
    await db.delete(storeName, key as string);
  }

  async clearThisInstance(
    storeName: keyof AuthDB<T> = defaultStore
  ): Promise<void> {
    const db = await this.getDB();

    for (const key of Object.keys(this.persisted)) {
      const item = await db.get(storeName, key);
      if (item) {
        await db.delete(storeName, key);
      }
    }
  }

  async clearAll(): Promise<void> {
    const db = await this.getDB();
    const storeNames = db.objectStoreNames;

    for (const storeName of storeNames) {
      await db.clear(storeName as string);
    }
  }

  private getDB(): Promise<IDBPDatabase<AuthDB<unknown>>> {
    if (!this.dbPromise) {
      this.dbPromise = openDB<AuthDB<unknown>>(Persist.dbName, 1, {
        upgrade(db) {
          for (const storeName of storeNames) {
            if (!db.objectStoreNames.contains(storeName)) {
              db.createObjectStore(storeName);
            }
          }
        },
      });
    }
    return this.dbPromise;
  }

  /**
   * Completely resets the database by deleting and recreating it
   * @returns {Promise<void>}
   */
  private async resetDatabase(): Promise<void> {
    try {
      if (this.dbPromise) {
        const db = await this.dbPromise;
        db.close();
        this.dbPromise = null;
      }

      await deleteDB(Persist.dbName);

      await this.getDB();
    } catch (error) {
      throw error;
    }
  }
}
