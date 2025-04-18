// This file contains the Persist class, which manages IndexedDB storage.
// It provides methods to get, save, remove, and clear data in the database.
// The class has the following public methods:
// - getData: Retrieves data from the database for a specified store name.
// - save: Saves data to the database for a specified store name.
// - remove: Removes data from the database for a specified key and store name.
// - removePartOfMap: Removes a part of the data from the database for a specified key.
// - clearThisInstance: Clears all data from the current instance of the Persist class.
// - clearAll: Clears all data from the database.

import { openDB, IDBPDatabase } from "idb";
import { defaultStore, PersistConfig } from "./config";

type AuthDB<T> = {
  [K in PersistConfig]: T;
};

/**
 * Persist class for managing data persistence in IndexedDB
 * @template T - Type of data to be persisted, must be a record with string keys
 */
export class Persist<T extends Record<string, any>> {
  private static dbName = "DB";
  private static dbPromise: Promise<IDBPDatabase<AuthDB<unknown>>> | null =
    null;
  private persisted: T;

  /**
   * Creates a new instance of the Persist class
   * @param persisted - Initial data structure with default values
   */
  constructor(persisted: T) {
    this.persisted = persisted;
  }

  /**
   * Retrieves data from the database for all keys in the persisted object
   * @param storeName - The name of the store to retrieve data from, defaults to the configured default store
   * @returns Promise resolving to an object with all retrieved values
   */
  async getData(storeName: keyof AuthDB<T> = defaultStore): Promise<T> {
    const db = await Persist.getDB(storeName);
    const result: T = { ...this.persisted };

    for (const key of Object.keys(result) as (keyof T)[]) {
      result[key] = (await db.get(storeName, key as string)) || null;
    }

    return result;
  }

  /**
   * Saves data to the database
   * @param data - Partial data object with values to save
   * @param storeName - The name of the store to save data to, defaults to the configured default store
   * @returns Promise that resolves when all values are saved
   */
  async save(
    data: Partial<T>,
    storeName: keyof AuthDB<T> = defaultStore
  ): Promise<void> {
    const db = await Persist.getDB(storeName);
    for (const [key, value] of Object.entries(data)) {
      await db.put(storeName, value, key);
    }
  }

  /**
   * Removes data for a specific key from the database
   * @param key - The key to remove from the store
   * @param storeName - The name of the store to remove data from, defaults to the configured default store
   * @returns Promise that resolves when the item is removed
   */
  async remove(
    key: keyof T,
    storeName: keyof AuthDB<T> = defaultStore
  ): Promise<void> {
    const db = await Persist.getDB(storeName);
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
    storeName: keyof AuthDB<T> = defaultStore
  ): Promise<void> {
    const db = await Persist.getDB(storeName);
    await db.delete(storeName, key as string);
  }

  /**
   * Clears all data associated with this instance from the database
   * @param storeName - The name of the store to clear data from, defaults to the configured default store
   * @returns Promise that resolves when all items are removed
   */
  async clearThisInstance(
    storeName: keyof AuthDB<T> = defaultStore
  ): Promise<void> {
    const db = await Persist.getDB(storeName);

    for (const key of Object.keys(this.persisted)) {
      const item = await db.get(storeName, key);
      if (item) {
        await db.delete(storeName, key);
      }
    }
  }

  /**
   * Clears all data from all stores in the database
   * @returns Promise that resolves when all stores are cleared
   */
  async clearAll(): Promise<void> {
    const db = await Persist.getDB();
    const storeNames = db.objectStoreNames;

    for (const storeName of storeNames) {
      await db.clear(storeName as string);
    }
  }

  /**
   * Gets or initializes the database connection
   * @param storeName - The name of the store to ensure exists
   * @returns Promise resolving to the database connection
   * @private
   */
  private static getDB(
    storeName: keyof AuthDB<unknown> = defaultStore
  ): Promise<IDBPDatabase<AuthDB<unknown>>> {
    if (!this.dbPromise) {
      this.dbPromise = openDB<AuthDB<unknown>>(this.dbName, 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName);
          }
        },
      });
    }
    return this.dbPromise;
  }
}
