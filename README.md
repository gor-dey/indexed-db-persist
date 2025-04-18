# IndexedDB Persist Library

## Overview

The IndexedDB Persist library provides a simple and efficient way to manage data storage in IndexedDB. It offers a straightforward API for saving, retrieving, and managing data, making it easier to work with client-side storage in web applications.

## Features

- **Data Persistence**: Store and retrieve data using IndexedDB.
- **Flexible API**: Simple methods for saving, removing, and clearing data.
- **TypeScript Support**: Built with TypeScript for type safety and better development experience.

## Installation

To install the library, use npm:

```
npm install indexed-db-persist
```

## Usage

### Importing the Library

You can import the `Persist` class from the library as follows:

```typescript
import { Persist } from 'indexed-db-persist';
```

### Creating an Instance

To create an instance of the `Persist` class, you need to pass an initial object that represents the data structure you want to persist:

```typescript
const myPersist = new Persist<{ key1: string; key2: number }>({
  key1: '',
  key2: 0,
});
```

### Methods

#### `getData(storeName?: string): Promise<T>`

Retrieves data from the specified store. If no store name is provided, it uses the default store.

#### `save(data: Partial<T>, storeName?: string): Promise<void>`

Saves the provided data to the specified store.

#### `remove(key: keyof T, storeName?: string): Promise<void>`

Removes data from the specified store using the provided key.

#### `removePartOfMap(key: keyof T, storeName?: string): Promise<void>`

Removes a part of the data from the specified store for the given key.

#### `clearThisInstance(storeName?: string): Promise<void>`

Clears all data from the current instance of the `Persist` class for the specified store.

#### `clearAll(): Promise<void>`

Clears all data from the entire database.

## Example

```typescript
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

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.# indexed-db-persist
