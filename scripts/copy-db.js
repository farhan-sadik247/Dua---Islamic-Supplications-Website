const fs = require('fs');
const path = require('path');

console.log('Copying database file to build output...');

const sourceDb = path.join(__dirname, '..', 'backend', 'duas.db');
const destinations = [
  path.join(__dirname, '..', '.next', 'server', 'backend', 'duas.db'),
  path.join(__dirname, '..', '.next', 'standalone', 'backend', 'duas.db'),
];

if (!fs.existsSync(sourceDb)) {
  console.error('ERROR: Source database not found at:', sourceDb);
  process.exit(1);
}

console.log('Source database found:', sourceDb);
console.log('Database size:', fs.statSync(sourceDb).size, 'bytes');

let copied = 0;
destinations.forEach(dest => {
  try {
    const destDir = path.dirname(dest);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
      console.log('Created directory:', destDir);
    }
    
    // Copy the database file
    fs.copyFileSync(sourceDb, dest);
    console.log('✓ Database copied to:', dest);
    copied++;
  } catch (error) {
    console.log('Note: Could not copy to', dest, '- This is normal if the directory doesn\'t exist yet');
  }
});

if (copied > 0) {
  console.log(`\n✓ Successfully copied database to ${copied} location(s)`);
} else {
  console.log('\nWarning: Database was not copied to any locations');
}
