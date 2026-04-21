/**
 * Favicon Generator Script
 * 
 * USAGE:
 *   node scripts/generate-favicon.js
 * 
 * This script resizes the heroimage.png to create various favicon sizes.
 * Requires: sharp (npm install sharp)
 * 
 * Alternative: Use online favicon generator at https://favicon.io/
 * and download the generated favicon.zip to public/
 */

import fs from 'fs';
import path from 'path';
// Uncomment if sharp is installed:
// import sharp from 'sharp';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const SOURCE_IMAGE = path.join(PUBLIC_DIR, 'heroimage.png');

// Sizes needed for favicons
const faviconSizes = [
  { name: 'favicon.ico', size: null, type: 'ico' },      // Multi-size icon
  { name: 'favicon-16x16.png', size: 16, type: 'png' },
  { name: 'favicon-32x32.png', size: 32, type: 'png' },
  { name: 'apple-touch-icon.png', size: 180, type: 'png' },
  { name: 'android-chrome-192x192.png', size: 192, type: 'png' },
  { name: 'android-chrome-512x512.png', size: 512, type: 'png' },
];

console.log('Favicon Generator');
console.log('=================');
console.log('');
console.log('This script creates favicon files from heroimage.png');
console.log('');

// Check if source exists
if (!fs.existsSync(SOURCE_IMAGE)) {
  console.error('❌ Error: heroimage.png not found in public/');
  console.error('   Please add your hero image to public/heroimage.png');
  process.exit(1);
}

console.log('✓ Source image found:', SOURCE_IMAGE);
console.log('');

// If sharp is available, generate optimized images
try {
  // Try to require sharp dynamically
  const sharp = require('sharp');
  
  console.log('Starting favicon generation with sharp...');
  
  faviconSizes.forEach(async (favicon) => {
    const outputPath = path.join(PUBLIC_DIR, favicon.name);
    
    try {
      if (favicon.type === 'ico') {
        // For ICO, create multiple sizes and convert
        // ICO needs multiple sizes, sharp doesn't directly create .ico
        // Use alternative: create PNGs and note that ICO needs special tool
        console.log('⚠️  Skipping favicon.ico - requires special ICO encoder');
        console.log('   Use online tool: https://favicon.io/');
      } else {
        await sharp(SOURCE_IMAGE)
          .resize(favicon.size, favicon.size, {
            fit: 'cover',
            position: 'center'
          })
          .png()
          .toFile(outputPath);
        console.log(`✓ Generated ${favicon.name} (${favicon.size}x${favicon.size})`);
      }
    } catch (err) {
      console.error(`❌ Failed to generate ${favicon.name}:`, err.message);
    }
  });
  
  console.log('');
  console.log('✅ Favicon generation complete!');
  
} catch (err) {
  // Sharp not available
  console.log('⚠️  Sharp library not installed.');
  console.log('');
  console.log('Option 1: Install sharp for automated generation:');
  console.log('  npm install --save-dev sharp');
  console.log('  npx node scripts/generate-favicon.js');
  console.log('');
  console.log('Option 2: Use online favicon generator:');
  console.log('  1. Go to https://favicon.io/ or https://realfavicongenerator.net/');
  console.log('  2. Upload public/heroimage.png');
  console.log('  3. Download the generated package');
  console.log('  4. Extract favicon files to public/');
  console.log('');
  console.log('Files needed in public/:');
  faviconSizes.forEach(f => console.log(`  - ${f.name}`));
  console.log('');
  console.log('Current fallback: Using heroimage.png as favicon');
  console.log('  (Browsers will work but may scale the image)');
}
