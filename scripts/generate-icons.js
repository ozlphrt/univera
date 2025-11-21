// Script to generate proper PWA icons from SVG
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '..', 'public');
const svg192Path = path.join(publicDir, 'pwa-192x192.svg');
const svg512Path = path.join(publicDir, 'pwa-512x512.svg');

async function generateIcons() {
  try {
    // Generate 192x192 PNG from SVG
    if (fs.existsSync(svg192Path)) {
      await sharp(svg192Path)
        .resize(192, 192)
        .png()
        .toFile(path.join(publicDir, 'pwa-192x192.png'));
      console.log('✅ Generated pwa-192x192.png');
    } else {
      // Fallback: create minimal valid PNG
      const minimalPNG = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        'base64'
      );
      fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), minimalPNG);
      console.log('⚠️  Created minimal placeholder pwa-192x192.png (replace with proper icon)');
    }

    // Generate 512x512 PNG from SVG
    if (fs.existsSync(svg512Path)) {
      await sharp(svg512Path)
        .resize(512, 512)
        .png()
        .toFile(path.join(publicDir, 'pwa-512x512.png'));
      console.log('✅ Generated pwa-512x512.png');
    } else {
      // Fallback: create minimal valid PNG
      const minimalPNG = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        'base64'
      );
      fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), minimalPNG);
      console.log('⚠️  Created minimal placeholder pwa-512x512.png (replace with proper icon)');
    }

    console.log('\n✅ PWA icons ready!');
    console.log('⚠️  Note: Replace with proper branded icons before production deployment.');
  } catch (error) {
    console.error('Error generating icons:', error.message);
    // Fallback to minimal PNGs
    const minimalPNG = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );
    fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), minimalPNG);
    fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), minimalPNG);
    console.log('⚠️  Created minimal placeholder PNGs (replace with proper icons)');
  }
}

generateIcons();
