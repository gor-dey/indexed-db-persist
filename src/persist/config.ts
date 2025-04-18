export let defaultStore = "DefaultStore";
export let storeNames: string[] = ["DefaultStore", "AnotherStore"];

export type PersistConfig = (typeof storeNames)[number];

export function configure(config: {
  defaultStore?: string;
  storeNames?: string[];
}) {
  if (config.defaultStore) {
    defaultStore = config.defaultStore;
  }

  if (config.storeNames && config.storeNames.length > 0) {
    storeNames = config.storeNames;
  }
}
