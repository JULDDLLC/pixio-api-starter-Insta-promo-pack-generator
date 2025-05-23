//fix: ensure npm run build is used in build-cf.js
//This is a test comment to force another rebuild    
// // This is a test comment to force a rebuild
// const { execSync } = require('child_process');

console.log('🚀 Running custom Cloudflare Pages build script');
try {
  // Use npm run build, NOT next build directly!
 console.log('🟢 About to run npm run build in build-cf.js');
execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Next.js build successful');

  console.log('2. Building edge functions with next-on-pages');
  execSync('npx @cloudflare/next-on-pages', { stdio: 'inherit' });
  console.log('✅ Cloudflare adapter successful');
  
  console.log('🎉 Build complete!');
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}

