/** @type {import('next').NextConfig} */
const path = require('path');
const fs = require('fs');

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
    ]
  },
  webpack: (config, { isServer, dev }) => {
    // Copy database file to the build output for Vercel
    if (isServer && !dev) {
      config.externals.push({
        'better-sqlite3': 'commonjs better-sqlite3'
      });
      
      // Copy database to .next/standalone if it exists
      config.plugins.push({
        apply: (compiler) => {
          compiler.hooks.afterEmit.tap('CopyDatabasePlugin', () => {
            const dbSource = path.join(__dirname, 'backend', 'duas.db');
            const dbDest = path.join(__dirname, '.next', 'server', 'backend', 'duas.db');
            
            try {
              // Ensure destination directory exists
              const destDir = path.dirname(dbDest);
              if (!fs.existsSync(destDir)) {
                fs.mkdirSync(destDir, { recursive: true });
              }
              
              // Copy database file
              if (fs.existsSync(dbSource)) {
                fs.copyFileSync(dbSource, dbDest);
                console.log('✓ Database copied to build output:', dbDest);
              }
            } catch (error) {
              console.error('Error copying database:', error);
            }
          });
        }
      });
    }
    return config;
  },
  // Ensure database file is included in the output
  outputFileTracing: true,
}

module.exports = nextConfig
