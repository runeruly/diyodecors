import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://diyodecors.com',
  output: 'static',
  publicDir: './src/public',
  compressHTML: false,
  build: {
    format: 'file'
  }
});
