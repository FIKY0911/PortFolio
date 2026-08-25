/**
 * Postbuild script: Make CSS non-render-blocking.
 * Changes <link rel="stylesheet"> to media="print" onload="this.media='all'"
 * so the browser doesn't block rendering on CSS.
 */
const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'dist', 'index.html');
if (!fs.existsSync(htmlPath)) return;

let html = fs.readFileSync(htmlPath, 'utf-8');

// Replace render-blocking stylesheet with non-render-blocking version
const before = html;
html = html.replace(
  /<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)"[^>]*>/g,
  '<link rel="stylesheet" crossorigin href="$1" media="print" onload="this.media=\'all\'">'
);

if (html !== before) {
  fs.writeFileSync(htmlPath, html);
  console.log('✓ Made CSS non-render-blocking for performance');
} else {
  console.log('⚠ No render-blocking CSS found to fix');
}
