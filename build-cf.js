// cloudflare-build.js
const { execSync } = require('child_process');

console.log('🚀 Running custom Cloudflare Pages build script');

try {
  // 1. Run Next.js build using npm script
  console.log('1. Running next build using npm script');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Next.js build successful');

  // 2. Run the Cloudflare adapter
  console.log('2. Building edge functions with next-on-pages');
  execSync('npx @cloudflare/next-on-pages', { stdio: 'inherit' });
  console.log('✅ Cloudflare adapter successful');
  
  console.log('🎉 Build complete!');
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}

