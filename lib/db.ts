import { AppState, Task } from '../types';

const DB_NAME = 'FocoVitalDB';
const DB_VERSION = 1;
const STORE_TASKS = 'tasks';
const STORE_SETTINGS = 'settings';

export class LocalDB {
  private db: IDBDatabase | null = null;

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_TASKS)) {
          db.createObjectStore(STORE_TASKS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORE_SETTINGS)) {
          db.createObjectStore(STORE_SETTINGS, { keyPath: 'key' });
        }
      };
    });
  }

  async saveTask(task: Task): Promise<void> {
    if (!this.db) await this.connect();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(STORE_TASKS, 'readwrite');
      const store = tx.objectStore(STORE_TASKS);
      const req = store.put(task);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async deleteTask(id: string): Promise<void> {
    if (!this.db) await this.connect();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(STORE_TASKS, 'readwrite');
      const store = tx.objectStore(STORE_TASKS);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async getAllTasks(): Promise<Task[]> {
    if (!this.db) await this.connect();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(STORE_TASKS, 'readonly');
      const store = tx.objectStore(STORE_TASKS);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async saveSetting(key: string, value: any): Promise<void> {
    if (!this.db) await this.connect();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(STORE_SETTINGS, 'readwrite');
      const store = tx.objectStore(STORE_SETTINGS);
      const req = store.put({ key, value });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async getSetting<T>(key: string): Promise<T | null> {
    if (!this.db) await this.connect();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(STORE_SETTINGS, 'readonly');
      const store = tx.objectStore(STORE_SETTINGS);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result ? req.result.value : null);
      req.onerror = () => reject(req.error);
    });
  }

  async clearAll(): Promise<void> {
    if (!this.db) await this.connect();
    return new Promise((resolve, reject) => {
        const tx = this.db!.transaction([STORE_TASKS, STORE_SETTINGS], 'readwrite');
        tx.objectStore(STORE_TASKS).clear();
        tx.objectStore(STORE_SETTINGS).clear();
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
  }
}

export const db = new LocalDB();