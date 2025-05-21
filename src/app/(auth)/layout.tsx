// src/app/(auth)/layout.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate fixed positions for particles to prevent hydration mismatch
  const particlePositions = Array.from({ length: 15 }).map((_, i) => ({
    top: `${(i * 7) % 100}%`,
    left: `${(i * 9) % 100}%`,
    opacity: 0.3 + ((i % 5) * 0.1),
    size: `${Math.floor(Math.random() * 3) + 1}px`,
    animationDuration: `${10 + (i % 10)}s`,
    animationDelay: `${(i % 10) * 0.5}s`
  }));

  return (
    <div className="flex min-h-screen flex-col overflow-hidden relative font-sans">
      {/* Luxury deep blue/gold gradient background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-juldd-deep via-juldd-deepLight to-black" />

      {/* Optional: Subtle gold grid pattern (remove if not needed) */}
      {/* <div className="absolute inset-0 -z-10 bg-[url('/grid.svg')] bg-[length:10px_10px] bg-repeat opacity-5"></div> */}

      {/* Animated blurred gold/blue circles */}
      <div className="absolute top-[10%] left-[5%] w-[40vw] h-[40vw] rounded-full bg-juldd-gold/10 filter blur-[100px] animate-float" style={{ animationDuration: '30s' }}></div>
      <div className="absolute bottom-[20%] right-[10%] w-[30vw] h-[30vw] rounded-full bg-juldd-deepLight/20 filter blur-[100px] animate-float" style={{ animationDuration: '25s', animationDelay: '2s' }}></div>

      {/* Particles */}
      <div className="particles absolute inset-0 -z-10">
        {particlePositions.map((pos, i) => (
          <div
            key={i}
            className="particle absolute rounded-full bg-juldd-gold/30"
            style={{
              top: pos.top,
              left: pos.left,
              width: pos.size,
              height: pos.size,
              opacity: pos.opacity,
              animation: `float ${pos.animationDuration} linear infinite`,
              animationDelay: pos.animationDelay
            }}
          />
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
        <Link href="/" className="absolute top-8 left-8 flex items-center gap-3">
          <Image
            src="/julee_logo.png"
            alt="JULDD LLC Logo"
            width={48}
            height={48}
            className="logo"
            priority
          />
          <motion.span
            className="text-2xl font-serif font-bold gold-gradient-text tracking-wide"
            initial={mounted ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            JULDD LLC
          </motion.span>
        </Link>

        <AnimatePresence>
          {mounted && (
            <motion.div
              className="w-full max-w-md glass-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 text-center text-sm text-muted-foreground relative z-10">
        <p>
          © {new Date().getFullYear()} JULDD LLC. All rights reserved.
        </p>
      </div>
    </div>
  );
}
