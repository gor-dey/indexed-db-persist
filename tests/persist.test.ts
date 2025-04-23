import { storeNames } from "../src/persist/config";
import { Persist } from "../src/persist/index";
import { openDB } from "idb";
import "fake-indexeddb/auto";
import { deleteDB } from "idb";

const defaultStore = storeNames[0];

describe("Persist Class", () => {
  let persist: Persist<{ key1: string; key2: number }>;
  const storeName = defaultStore;

  beforeAll(async () => {
    await deleteDB("DB");

    await openDB("DB", 1, {
      upgrade(db) {
        db.createObjectStore(storeName);
      },
    });
    persist = new Persist({ key1: "", key2: 0 });
  });

  afterAll(async () => {
    const db = await openDB("DB", 1);
    await db.delete(storeName, "key1");
    await db.delete(storeName, "key2");
    db.close();
    await deleteDB("DB");
  });

  test("should save data to the database", async () => {
    await persist.save({ key1: "value1", key2: 42 }, storeName);
    const data = await persist.getData(storeName);
    expect(data.key1).toBe("value1");
    expect(data.key2).toBe(42);
  });

  test("should retrieve data from the database", async () => {
    const data = await persist.getData(storeName);
    expect(data.key1).toBe("value1");
    expect(data.key2).toBe(42);
  });

  test("should remove data from the database", async () => {
    await persist.remove("key1", storeName);
    const data = await persist.getData(storeName);
    expect(data.key1).toBe(null);
    expect(data.key2).toBe(42);
  });

  test("should remove part of the map", async () => {
    await persist.save({ key1: "value1", key2: 42 }, storeName);
    await persist.removePartOfMap("key1", storeName);
    const data = await persist.getData(storeName);
    expect(data.key1).toBe(null);
    expect(data.key2).toBe(42);
  });

  test("should clear this instance data", async () => {
    await persist.clearThisInstance(storeName);
    const data = await persist.getData(storeName);
    expect(data.key1).toBe(null);
    expect(data.key2).toBe(null);
  });

  test("should clear all data from the database", async () => {
    await persist.save({ key1: "value1", key2: 42 }, storeName);
    await persist.clearAll();
    const data = await persist.getData(storeName);
    expect(data.key1).toBe(null);
    expect(data.key2).toBe(null);
  });
});
