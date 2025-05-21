'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Custom404() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-juldd-deep text-white px-6">
      <motion.h1
        className="text-9xl font-extrabold mb-6 select-none"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        404
      </motion.h1>
      <motion.p
        className="text-2xl md:text-3xl font-semibold mb-8 max-w-xl text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        Oops! The page you’re looking for doesn’t exist or has been moved.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <Link
          href="/"
          className="inline-block bg-gradient-to-r from-juldd-gold/90 to-juldd-gold/70 text-juldd-deep font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          Go Back Home
        </Link>
      </motion.div>
      <motion.div
        className="mt-12 w-full max-w-md h-48 bg-juldd-gold/20 rounded-lg backdrop-blur-lg shadow-inner animate-pulse"
        initial={{ opacity: 0.3 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
      />
    </main>
  );
}
