// build-cf.js
const { execSync } = require('child_process');

console.log('🚀 Running custom Cloudflare Pages build script');
console.log('1. Running next build');
execSync('npx next build', { stdio: 'inherit' }); // Changed to use npx
console.log('2. Building edge functions');
execSync('npx @cloudflare/next-on-pages', { stdio: 'inherit' });
console.log('✅ Build complete!');


