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
    path.join(process.cwd(), '.next', 'server', 'backend', 'duas.db'),
    path.join(__dirname, 'duas.db'),
    path.join(process.cwd(), 'duas.db'),
    '/var/task/backend/duas.db', // Vercel serverless path
    '/var/task/.next/server/backend/duas.db', // Vercel build output path
  ];

  let dbPath = '';
  
  console.log('Looking for database in the following locations:');
  console.log('Current working directory:', process.cwd());
  console.log('__dirname:', __dirname);
  
  // Find the first existing database file
  for (const p of possiblePaths) {
    console.log(`Checking: ${p}`);
    try {
      if (fs.existsSync(p)) {
        dbPath = p;
        console.log(`✓ Found database at: ${dbPath}`);
        break;
      }
    } catch (error) {
      console.log(`  Error checking path: ${error}`);
    }
  }

  if (!dbPath) {
    console.error('Database file not found in any location!');
    console.log('Listing current directory contents:');
    try {
      const files = fs.readdirSync(process.cwd());
      console.log('Files in cwd:', files.slice(0, 20));
      
      if (fs.existsSync(path.join(process.cwd(), 'backend'))) {
        const backendFiles = fs.readdirSync(path.join(process.cwd(), 'backend'));
        console.log('Files in backend:', backendFiles);
      }
    } catch (error) {
      console.error('Error listing directory:', error);
    }
    throw new Error('Database file not found');
  }

  console.log('Opening database at:', dbPath);
  
  try {
    db = new Database(dbPath, { 
      readonly: true,
      fileMustExist: true 
    });
    
    // Test the connection
    const testQuery = db.prepare('SELECT COUNT(*) as count FROM categories').get() as any;
    console.log('Database connected successfully. Categories count:', testQuery.count);
    
    return db;
  } catch (error: any) {
    console.error('Error opening database:', error.message);
    throw error;
  }
}

export class DatabaseService {
  private getDb(): Database.Database {
    return getDatabase();
  }

  getCategories(): Category[] {
    try {
      const db = this.getDb();
      const categories = db.prepare('SELECT * FROM categories ORDER BY id').all() as Category[];
      console.log(`Retrieved ${categories.length} categories`);
      return categories;
    } catch (error: any) {
      console.error('Error getting categories:', error.message);
      throw error;
    }
  }

  getSubcategories(categoryId: number): Subcategory[] {
    try {
      const db = this.getDb();
      const subcategories = db.prepare('SELECT * FROM subcategories WHERE categoryId = ? ORDER BY id')
        .all(categoryId) as Subcategory[];
      console.log(`Retrieved ${subcategories.length} subcategories for category ${categoryId}`);
      return subcategories;
    } catch (error: any) {
      console.error('Error getting subcategories:', error.message);
      throw error;
    }
  }

  getDuas(subcategoryId: number): Dua[] {
    try {
      const db = this.getDb();
      const duas = db.prepare('SELECT * FROM duas WHERE subcategoryId = ? ORDER BY id')
        .all(subcategoryId) as Dua[];
      console.log(`Retrieved ${duas.length} duas for subcategory ${subcategoryId}`);
      return duas;
    } catch (error: any) {
      console.error('Error getting duas:', error.message);
      throw error;
    }
  }

  getAllDuas(): Dua[] {
    try {
      const db = this.getDb();
      const duas = db.prepare('SELECT * FROM duas ORDER BY id').all() as Dua[];
      console.log(`Retrieved ${duas.length} total duas`);
      return duas;
    } catch (error: any) {
      console.error('Error getting all duas:', error.message);
      throw error;
    }
  }

  getDuaById(id: number): Dua | undefined {
    try {
      const db = this.getDb();
      const dua = db.prepare('SELECT * FROM duas WHERE id = ?').get(id) as Dua | undefined;
      console.log(`Retrieved dua with id ${id}:`, dua ? 'found' : 'not found');
      return dua;
    } catch (error: any) {
      console.error('Error getting dua by id:', error.message);
      throw error;
    }
  }

  close() {
    if (db) {
      db.close();
      db = null;
      console.log('Database connection closed');
    }
  }
}
