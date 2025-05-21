// src/components/shared/footer.tsx
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="py-8 mt-auto bg-gradient-to-t from-juldd-deep/80 via-transparent to-transparent backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link href="/" className="text-lg font-serif font-bold gold-gradient-text tracking-wide">
              JULDD LLC
            </Link>
            <p className="text-muted-foreground mt-2 text-sm">
              AI-powered social content for modern brands
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-sm">
            <Link href="/pricing" className="hover:text-juldd-gold transition">
              Pricing
            </Link>
            <Link href="/login" className="hover:text-juldd-gold transition">
              Login
            </Link>
            <Link href="/signup" className="hover:text-juldd-gold transition">
              Sign up
            </Link>
            <Link href="#" className="hover:text-juldd-gold transition">
              Terms
            </Link>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-juldd-gold/10">
          <p className="text-xs text-center text-muted-foreground">
            © {new Date().getFullYear()} JULDD LLC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
