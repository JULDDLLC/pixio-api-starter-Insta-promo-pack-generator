import CustomCursor from '@/components/CustomCursor';
import ThemeToggle from '@/components/ThemeToggle';
import '@/app/globals.css';
import { Toaster } from 'sonner';
import { Inter } from 'next/font/google';
import { siteMetadata } from '@/lib/config/metadata';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-juldd-deep min-h-screen text-white">
        <CustomCursor />
        {/* Navbar */}
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-juldd-deep/90 border-b border-juldd-greenDark/40 flex justify-between items-center px-8 py-4 shadow-lg">
          <div className="text-2xl font-serif font-bold text-juldd-gold select-none">
            JULDD Insta-Promo Pack Generator
          </div>
          <nav className="flex items-center space-x-6">
            <a href="#features" className="hover:text-juldd-gold transition">Features</a>
            <a href="#pricing" className="hover:text-juldd-gold transition">Pricing</a>
            <a href="#about" className="hover:text-juldd-gold transition">About</a>
            <ThemeToggle />
          </nav>
        </header>

        {/* Main content */}
        <main className="flex-grow pt-24 container mx-auto px-6 max-w-5xl">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-juldd-greenDark text-juldd-gold py-6 mt-12">
          <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm">
            <p>© {new Date().getFullYear()} JULDD LLC. All rights reserved.</p>
            <div className="space-x-4 mt-2 md:mt-0">
              <a href="/privacy" className="hover:underline">Privacy Policy</a>
              <a href="/terms" className="hover:underline">Terms of Service</a>
              <a href="mailto:support@juldd.com" className="hover:underline">Contact</a>
            </div>
          </div>
        </footer>

        <Analytics />
        <SpeedInsights />
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
