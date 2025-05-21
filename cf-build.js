// cf-build.js
const { execSync } = require('child_process');
const path = require('path');

// Log the environment for debugging
console.log('🔍 Current directory:', process.cwd());
console.log('🔍 Node version:', process.version);
console.log('🔍 PATH:', process.env.PATH);

// Use absolute paths to the binaries in node_modules
const nextBin = path.resolve('./node_modules/.bin/next');
const cfAdapterBin = path.resolve('./node_modules/.bin/@cloudflare/next-on-pages');

try {
  console.log('🚀 Running Next.js build directly using path:', nextBin);
  execSync(`${nextBin} build`, { stdio: 'inherit' });
  
  console.log('✅ Next.js build successful');
  console.log('🚀 Running Cloudflare adapter');
  
  // If direct path doesn't work, try npm-based approach
  execSync('npx --no-install @cloudflare/next-on-pages', { stdio: 'inherit' });
  
  console.log('✅ Build complete!');
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}

