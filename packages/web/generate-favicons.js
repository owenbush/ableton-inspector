import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple favicon generator using canvas (if available) or create basic files
function createFavicon(size, filename) {
  // For now, create a simple blue square favicon
  // This is a placeholder - in production you'd want proper favicon generation
  console.log(`Creating ${filename} (${size}x${size})`);

  // Create a simple SVG favicon
  const svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" fill="#3b82f6"/>
    <text x="${size/2}" y="${size/2 + size/8}" text-anchor="middle" fill="white" font-size="${size/2}" font-family="Arial">🎵</text>
  </svg>`;

  fs.writeFileSync(path.join(__dirname, 'public', filename), svg);
}

// Create favicon files
createFavicon(16, 'favicon-16x16.png');
createFavicon(32, 'favicon-32x32.png');
createFavicon(180, 'apple-touch-icon.png');

console.log('Favicon files created!');
