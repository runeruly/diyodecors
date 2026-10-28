import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
const rootDir = path.resolve('.');

if (!fs.existsSync(distDir)) {
  console.error('dist directory not found. Run astro build first.');
  process.exit(1);
}

const files = fs.readdirSync(distDir);
let count = 0;

for (const file of files) {
  if (file.endsWith('.html')) {
    const srcPath = path.join(distDir, file);
    const destPath = path.join(rootDir, file);
    fs.copyFileSync(srcPath, destPath);
    count++;
  }
}

console.log(`Synced ${count} compiled HTML pages from dist/ to project root.`);
