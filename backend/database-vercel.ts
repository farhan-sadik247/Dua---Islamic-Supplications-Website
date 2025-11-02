import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

export interface Category {
  id: number;
  name: string;
  icon: string;
  duaCount: number;
}

export interface Subcategory {
  id: number;
  categoryId: number;
  name: string;
  duaCount: number;
}

export interface Dua {
  id: number;
  subcategoryId: number;
  name: string;
  context: string;
  arabic: string;
  transliteration: string;
  translation: string;
  reference: string;
}

let db: Database.Database | null = null;

function getDatabase(): Database.Database {
  if (db) return db;

  // Try different paths for database location
  const possiblePaths = [
    path.join(process.cwd(), 'backend', 'duas.db'),
    path.join(__dirname, 'duas.db'),
    path.join(process.cwd(), 'duas.db'),
  ];

  let dbPath = possiblePaths[0];
  
  // Find the first existing database file
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      dbPath = p;
      break;
    }
  }

  console.log('Using database at:', dbPath);
  
  db = new Database(dbPath, { 
    readonly: true, // Read-only for Vercel
    fileMustExist: true 
  });
  
  return db;
}

export class DatabaseService {
  private getDb(): Database.Database {
    return getDatabase();
  }

  getCategories(): Category[] {
    const db = this.getDb();
    return db.prepare('SELECT * FROM categories ORDER BY id').all() as Category[];
  }

  getSubcategories(categoryId: number): Subcategory[] {
    const db = this.getDb();
    return db.prepare('SELECT * FROM subcategories WHERE categoryId = ? ORDER BY id')
      .all(categoryId) as Subcategory[];
  }

  getDuas(subcategoryId: number): Dua[] {
    const db = this.getDb();
    return db.prepare('SELECT * FROM duas WHERE subcategoryId = ? ORDER BY id')
      .all(subcategoryId) as Dua[];
  }

  getAllDuas(): Dua[] {
    const db = this.getDb();
    return db.prepare('SELECT * FROM duas ORDER BY id').all() as Dua[];
  }

  getDuaById(id: number): Dua | undefined {
    const db = this.getDb();
    return db.prepare('SELECT * FROM duas WHERE id = ?').get(id) as Dua | undefined;
  }

  close() {
    if (db) {
      db.close();
      db = null;
    }
  }
}
