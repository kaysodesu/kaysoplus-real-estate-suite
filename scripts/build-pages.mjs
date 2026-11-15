// Builds the browser-only demo for GitHub Pages into dist-pages/.
// Publish it with:  git subtree push --prefix dist-pages origin gh-pages  (or see README)
import { execSync } from 'node:child_process';
import { copyFileSync, writeFileSync } from 'node:fs';

const base = '/kaysoplus-real-estate-suite/';
execSync('npx vite build --outDir dist-pages --emptyOutDir', { stdio: 'inherit', env: { ...process.env, PAGES_BASE: base } });
copyFileSync('dist-pages/index.html', 'dist-pages/404.html'); // deep links fall back to the app
writeFileSync('dist-pages/.nojekyll', '');
console.log(`Built demo for ${base} in dist-pages/`);
