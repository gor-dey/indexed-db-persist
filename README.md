# IndexedDB Persist Library

## Overview

A lightweight library for simple and efficient data persistence with IndexedDB in web applications.

## Features

- **Data Persistence**: Store and retrieve data using IndexedDB
- **Flexible API**: Simple methods for data operations
- **Configurable Stores**: Organize data with custom store names
- **TypeScript Support**: Full type safety

## Installation

```
npm install indexed-db-persist
```

## Usage

```typescript
import { Persist } from 'indexed-db-persist';

// Create instance with initial data structure
const persist = new Persist<{ name: string; age: number }>({
  name: '',
  age: 0,
});

// Save data
await persist.save({ name: 'John Doe', age: 30 });

// Retrieve data
const data = await persist.getData();
console.log(data); // { name: 'John Doe', age: 30 }

// Remove data
await persist.remove('name');

// Clear instance data
await persist.clearThisInstance();
```

## API

- **getData(storeName?: string)**: Retrieves data from store
- **save(data: Partial<T>, storeName?: string)**: Saves data to store
- **remove(key: keyof T, storeName?: string)**: Removes data by key
- **removePartOfMap(key: keyof T, storeName?: string)**: Removes part of map data
- **clearThisInstance(storeName?: string)**: Clears instance data
- **clearAll()**: Clears all database data

## Example with MobX

```typescript
import { Persist } from 'indexed-db-persist';
import { makeAutoObservable } from 'mobx';

// Define data structure
interface PersistedData {
  theme: string;
}

// Create persist instance with defaults
const persist = new Persist<PersistedData>({ theme: 'light' });

class ThemeStore {
  private _theme = 'light';

  constructor() {
    // Load saved data on initialization
    persist.getData().then(data => {
      if (data.theme) this.setTheme(data.theme);
    });
    
    makeAutoObservable(this);
  }

  setTheme(theme: string) {
    this._theme = theme;
    // Save changes automatically
    persist.save({ theme });
  }
  
  get theme() {
    return this._theme;
  }
}

export const themeStore = new ThemeStore();
```

## License

MIT License