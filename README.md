# Dua - Islamic Supplications Website

A modern, full-stack web application built with Next.js, TypeScript, Tailwind CSS, and SQLite for browsing, learning, and managing Islamic duas (supplications) and ruqyah.

## � Project Links

- **Figma Design**: [View Design on Figma](https://www.figma.com/design/ShgOsk7pKAOLqISlxkOGHN/Web-Dev-Task?node-id=1-2143&t=J7KdsrU3lFqGT620-0)
- **Reference Website**: [DuaRuqyah.com](https://duaruqyah.com/dua-categories/duas-importance)

## �🚀 Features

### User Features
- ✅ **Pixel-Perfect UI** - Cloned from Figma  design with exact spacing and layout
- ✅ **Fully Functional Categories Sidebar** - Dynamic category and subcategory navigation
- ✅ **Dua Cards** - Beautiful, responsive cards displaying duas with Arabic, transliteration, and translation
- ✅ **Context-Aware Duas** - Each dua includes contextual information about when and why to recite it
- ✅ **Fully Responsive** - Works seamlessly on mobile, tablet, and desktop
- ✅ **Settings Panel** - Customizable display preferences

### Admin Features
- ✅ **Admin Dashboard** - Complete CRUD operations for categories, subcategories, and duas
- ✅ **Content Management** - Add, edit, and delete Islamic content
- ✅ **Category Management** - Organize duas into categories and subcategories
- ✅ **Rich Data Entry** - Support for Arabic text, transliteration, translation, references, and context

### Technical Features
- ✅ **Backend API** - RESTful API built with Node.js, TypeScript, and SQLite
- ✅ **TypeScript** - Type-safe code throughout the application
- ✅ **Database Seeding** - Automated database population with authentic Islamic content
- ✅ **CORS Enabled** - Cross-origin resource sharing for API access

## 📋 Prerequisites

- Node.js 18 or higher
- npm or yarn
- Windows, macOS, or Linux

## 🛠️ Installation

1. **Clone the repository:**
```bash
git clone https://github.com/farhan-sadik247/Dua---Islamic-Supplications-Website.git
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. **Initialize and seed the database:**
```bash
npm run seed
```
This will create the SQLite database (`backend/duas.db`) and populate it with all categories, subcategories, and duas.

## 🚀 Running the Application

### Quick Start (Development Mode)

**Option 1: Using Two Terminals (Recommended)**

1. **Terminal 1 - Start the backend server:**
```bash
npm run backend
```
The backend API will be available at `http://localhost:5000`

2. **Terminal 2 - Start the Next.js frontend:**
```bash
npm run dev
```
The frontend will be available at `http://localhost:3000`

**Option 2: Using PowerShell (Single Terminal)**
```powershell
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run backend"
npm run dev
```

### Accessing the Application

- **Main App:** http://localhost:3000
- **Admin Dashboard:** http://localhost:3000/admin
- **Backend API:** http://localhost:5000/api

### Production Mode

1. **Build the backend:**
```bash
npm run backend:build
```

2. **Build the Next.js application:**
```bash
npm run build
```

3. **Start the servers:**
```bash
# Terminal 1: Start backend
npm run backend:start

# Terminal 2: Start frontend
npm start
```

## 🎨 Features Implementation

### ✅ Fully Functional Features
- **Categories Sidebar**: Fully integrated with backend API
- **Dua Cards**: Dynamic data rendering with real-time updates
- **Responsive Design**: Mobile-first approach with collapsible sidebars
- **Admin Dashboard**: Complete CRUD operations for all content
- **Content Management**: Add, edit, and delete categories, subcategories, and duas
- **Context-Aware Display**: Each dua includes contextual information
- **Settings Context**: Global state management with React Context API


## 🗄️ Database Schema

### Categories Table
```sql
CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  duaCount INTEGER DEFAULT 0
);
```

### Subcategories Table
```sql
CREATE TABLE subcategories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  categoryId INTEGER NOT NULL,
  name TEXT NOT NULL,
  duaCount INTEGER DEFAULT 0,
  FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE CASCADE
);
```

### Duas Table
```sql
CREATE TABLE duas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subcategoryId INTEGER NOT NULL,
  name TEXT NOT NULL,
  context TEXT,
  arabic TEXT NOT NULL,
  transliteration TEXT NOT NULL,
  translation TEXT NOT NULL,
  reference TEXT,
  FOREIGN KEY (subcategoryId) REFERENCES subcategories(id) ON DELETE CASCADE
);
```

### Database Features
- **Auto-incrementing IDs** for all tables
- **Foreign key constraints** with cascade delete
- **Context field** to provide guidance on when/why to recite each dua
- **Automatic dua counts** updated through triggers

## 🎯 Technologies Used

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library with hooks and context
- **TypeScript 5** - Type safety and enhanced developer experience
- **Tailwind CSS 3** - Utility-first CSS framework
- **Axios** - HTTP client for API requests

### Backend
- **Node.js** - JavaScript runtime
- **Express 4** - Web application framework
- **TypeScript 5** - Type safety for backend code
- **SQLite3** - Embedded relational database
- **CORS** - Cross-origin resource sharing middleware

### Development Tools
- **ts-node-dev** - TypeScript execution with hot reload
- **ESLint** - Code linting and quality assurance
- **PostCSS** - CSS processing
- **Autoprefixer** - Automatic CSS vendor prefixing

## 📱 Responsive Breakpoints

- **Mobile**: < 768px (Single column, collapsible sidebar)
- **Tablet**: 768px - 1024px (Optimized layout)
- **Desktop**: > 1024px (Full sidebar, multi-column layout)

## 🔥 Performance Optimizations

- Client-side rendering with React 18
- Efficient database queries with indexed columns
- Lazy loading for large content
- Optimized API responses
- TypeScript for compile-time error detection

## 🎨 Tailwind Configuration

### Custom Colors
```js
colors: {
  primary: '#1FA45B',      // Green for Islamic theme
  secondary: '#868686',    // Gray for text
  background: '#F7F8FA',   // Light gray background
}
```

### Custom Spacing and Typography
- Custom font sizes for Arabic text
- Responsive padding and margins
- Custom line heights for readability

## 📝 Available Scripts

```bash
# Development
npm run dev              # Start Next.js development server (port 3000)
npm run backend          # Start backend development server with hot reload (port 5000)

# Production
npm run build            # Build Next.js for production
npm run start            # Start Next.js production server
npm run backend:build    # Compile TypeScript backend to JavaScript
npm run backend:start    # Start backend production server

# Database
npm run seed             # Initialize and seed database with all content

# Code Quality
npm run lint             # Run ESLint for code quality checks
```


## �📄 License

This project is created as part of a technical assessment for IRD Foundation.

## 👤 Author

Developed as part of Web Skill Test - Intern position

---
