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

// CRITICAL SAFEGUARD: Ensure .nojekyll always exists in the root directory.
// GitHub Pages runs Ruby Jekyll by default when deploying from the root branch.
// Without .nojekyll, Jekyll attempts to parse the `---` frontmatter in `src/**/*.astro`
// files as YAML and fails the "pages build and deployment" GitHub Actions run.
const nojekyllPath = path.join(rootDir, '.nojekyll');
if (!fs.existsSync(nojekyllPath)) {
  fs.writeFileSync(nojekyllPath, '');
  console.log('Recreated missing .nojekyll safeguard file in project root.');
}

console.log(`Synced ${count} compiled HTML pages from dist/ to project root (.nojekyll verified).`);
