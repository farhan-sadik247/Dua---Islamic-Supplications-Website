import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';

const dbPath = path.join(__dirname, 'duas.db');

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

export class DatabaseService {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err);
      } else {
        console.log('Connected to SQLite database');
        this.initializeDatabase();
      }
    });
  }

  private initializeDatabase() {
    this.db.serialize(() => {
      // Create Categories table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          icon TEXT,
          duaCount INTEGER DEFAULT 0
        )
      `);

      // Create Subcategories table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS subcategories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          categoryId INTEGER NOT NULL,
          name TEXT NOT NULL,
          duaCount INTEGER DEFAULT 0,
          FOREIGN KEY (categoryId) REFERENCES categories(id)
        )
      `);

      // Create Duas table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS duas (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          subcategoryId INTEGER NOT NULL,
          name TEXT NOT NULL,
          context TEXT,
          arabic TEXT NOT NULL,
          transliteration TEXT,
          translation TEXT NOT NULL,
          reference TEXT,
          FOREIGN KEY (subcategoryId) REFERENCES subcategories(id)
        )
      `, () => {
        this.seedDatabase();
      });
    });
  }

  private seedDatabase() {
    this.db.get('SELECT COUNT(*) as count FROM categories', (err, row: any) => {
      if (!err && row.count === 0) {
        console.log(' Seeding database with sample data...');

        // Insert Categories
        const categories = [
          { name: 'Dua\'s Importance', icon: '📿', duaCount: 5 },
          { name: 'All Dua\'s', icon: '📖', duaCount: 15 },
          { name: 'Memorize & Learn', icon: '🧠', duaCount: 10 },
          { name: 'Dua of the Day', icon: '⭐', duaCount: 1 },
          { name: 'Ruqyah', icon: '🕌', duaCount: 8 },
          { name: 'Morning Azkar', icon: '🌅', duaCount: 12 },
          { name: 'Evening Azkar', icon: '🌙', duaCount: 10 },
          { name: 'Sleep & Wake Up', icon: '😴', duaCount: 6 },
        ];

        categories.forEach((cat) => {
          this.db.run(
            'INSERT INTO categories (name, icon, duaCount) VALUES (?, ?, ?)',
            [cat.name, cat.icon, cat.duaCount]
          );
        });

        // Insert Subcategories
        const subcategories = [
          { categoryId: 2, name: 'The servant is dependent on his Lord', duaCount: 3 },
          { categoryId: 2, name: 'Conditions for Dua to be successful', duaCount: 4 },
          { categoryId: 2, name: 'When a dua is accepted', duaCount: 2 },
          { categoryId: 5, name: 'Protection from Evil Eye', duaCount: 3 },
          { categoryId: 5, name: 'Protection from Jinn', duaCount: 2 },
          { categoryId: 5, name: 'Healing Ruqyah', duaCount: 3 },
        ];

        subcategories.forEach((subcat) => {
          this.db.run(
            'INSERT INTO subcategories (categoryId, name, duaCount) VALUES (?, ?, ?)',
            [subcat.categoryId, subcat.name, subcat.duaCount]
          );
        });

        // Insert Duas
        const duas = [
          {
            subcategoryId: 1,
            name: 'The Servant\'s Dependency on Allah',
            context: '',
            arabic: 'يَا أَيُّهَا النَّاسُ أَنتُمُ الْفُقَرَاءُ إِلَى اللَّهِ ۖ وَاللَّهُ هُوَ الْغَنِيُّ الْحَمِيدُ',
            transliteration: 'Ya ayyuha an-nasu antumu al-fuqara\'u ila Allahi wa Allahu huwa al-ghaniyyu al-hamid',
            translation: 'O mankind, you are those in need of Allah, while Allah is the Free of need, the Praiseworthy.',
            reference: 'Quran 35:15'
          },
          {
            subcategoryId: 1,
            name: 'Seeking Help from Allah',
            context: '',
            arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
            transliteration: 'Iyyaka na\'budu wa iyyaka nasta\'in',
            translation: 'It is You we worship and You we ask for help.',
            reference: 'Quran 1:5'
          },
          {
            subcategoryId: 2,
            name: 'Sincerity in Dua',
            context: '',
            arabic: 'فَادْعُوا اللَّهَ مُخْلِصِينَ لَهُ الدِّينَ',
            transliteration: 'Fad\'u Allaha mukhlisina lahu ad-din',
            translation: 'So invoke Allah, being sincere to Him in religion.',
            reference: 'Quran 40:14'
          },
          {
            subcategoryId: 2,
            name: 'Calling Upon Allah with His Beautiful Names',
            context: '',
            arabic: 'وَلِلَّهِ الْأَسْمَاءُ الْحُسْنَىٰ فَادْعُوهُ بِهَا',
            transliteration: 'Wa lillahi al-asma\'u al-husna fad\'uhu biha',
            translation: 'And to Allah belong the best names, so invoke Him by them.',
            reference: 'Quran 7:180'
          },
          {
            subcategoryId: 4,
            name: 'Seeking Protection from Evil Eye',
            context: '',
            arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
            transliteration: 'A\'udhu bi kalimatillahi at-tammati min sharri ma khalaq',
            translation: 'I seek refuge in the perfect words of Allah from the evil of what He has created.',
            reference: 'Sahih Muslim'
          },
          {
            subcategoryId: 4,
            name: 'Protection with Ayatul Kursi',
            context: '',
            arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
            transliteration: 'Allahu la ilaha illa huwa al-hayyu al-qayyum',
            translation: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence.',
            reference: 'Quran 2:255'
          },
          {
            subcategoryId: 6,
            name: 'General Healing Dua',
            context: '',
            arabic: 'اللَّهُمَّ رَبَّ النَّاسِ أَذْهِبِ الْبَأْسَ اشْفِ أَنْتَ الشَّافِي',
            transliteration: 'Allahumma rabba an-nasi adhhib al-ba\'sa ishfi anta ash-shafi',
            translation: 'O Allah, Lord of mankind, remove the harm and heal, You are the Healer.',
            reference: 'Sahih Bukhari'
          },
        ];

        duas.forEach((dua) => {
          this.db.run(
            'INSERT INTO duas (subcategoryId, name, context, arabic, transliteration, translation, reference) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [dua.subcategoryId, dua.name, dua.context, dua.arabic, dua.transliteration, dua.translation, dua.reference]
          );
        });

        console.log('Database seeded successfully!');
      }
    });
  }

  // Query methods
  async getCategories(): Promise<Category[]> {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM categories', (err, rows) => {
        if (err) reject(err);
        else resolve(rows as Category[]);
      });
    });
  }

  async getSubcategories(categoryId: number): Promise<Subcategory[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM subcategories WHERE categoryId = ?',
        [categoryId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows as Subcategory[]);
        }
      );
    });
  }

  async getDuas(subcategoryId: number): Promise<Dua[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM duas WHERE subcategoryId = ?',
        [subcategoryId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows as Dua[]);
        }
      );
    });
  }

  async getAllDuas(): Promise<Dua[]> {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM duas', (err, rows) => {
        if (err) reject(err);
        else resolve(rows as Dua[]);
      });
    });
  }

  async getDuaById(id: number): Promise<Dua | null> {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM duas WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve((row as Dua) || null);
      });
    });
  }
}
