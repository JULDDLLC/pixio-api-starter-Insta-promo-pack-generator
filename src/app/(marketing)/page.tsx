'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useSpring,
  useInView,
  AnimatePresence
} from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { PRICING_TIERS, PricingTier, getTierByPriceId } from '@/lib/config/pricing';
import { Check, ExternalLink, ArrowRight, Star, Sparkles, Zap, Instagram } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { Subscription } from '@/types/db_types';
import { Footer } from '@/components/shared/footer';

// Define prop types for components
interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}

// --- MouseTrackCard with Border Glow ---
const MouseTrackCard: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Springs for animation - always initialize them
  const springConfig = { stiffness: 150, damping: 20 };
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);

  // Always create the motion template regardless of hover state
  const transform = useMotionTemplate`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isHovered ? 1.02 : 1})`;

  // Client-side effect
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !isHovered) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateXValue = ((y - centerY) / centerY) * -8;
    const rotateYValue = ((x - centerX) / centerX) * 8;

    setMousePosition({ x: rotateYValue, y: rotateXValue });
  };

  // Update spring animations
  useEffect(() => {
    if (isHovered) {
      rotateX.set(mousePosition.y);
      rotateY.set(mousePosition.x);
    } else {
      rotateX.set(0);
      rotateY.set(0);
    }
  }, [mousePosition, isHovered, rotateX, rotateY]);

  return (
    <motion.div
      ref={cardRef}
      className={`relative ${className || ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ transformStyle: "preserve-3d", transform }}
    >
      {/* Border Glow effect - visible when mounted and hovered */}
      <motion.div
        className="absolute -inset-0.5 rounded-[inherit] z-[-1]"
        style={{
          // Apply a box shadow for the glow effect
          boxShadow: isMounted && isHovered
            ? '0 0 15px 3px oklch(var(--primary) / 0.5)' // Use primary color with alpha
            : 'none',
          opacity: isMounted && isHovered ? 1 : 0, // Control visibility
          transition: 'box-shadow 0.3s ease-in-out, opacity 0.3s ease-in-out', // Smooth transition
        }}
      />
      {children}
    </motion.div>
  );
};


// Fixed Animated Background to prevent hydration mismatch
const AnimatedBackground = () => {
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Only run on client side
  useEffect(() => {
    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate mouse position relative to viewport center
      const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      const y = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1

      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Use consistent deterministic values for server rendering
  // Generate fixed positions for particles to prevent hydration mismatch
  const particlePositions = Array.from({ length: 20 }).map((_, i) => ({
    top: `${(i * 5) % 100}%`,
    left: `${(i * 7) % 100}%`,
    opacity: 0.3 + ((i % 5) * 0.1),
    animationDuration: `${10 + (i % 10)}s`,
    animationDelay: `${(i % 10) * 0.5}s`
  }));

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient - using JULDD colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-juldd-gold/10 via-juldd-deep/20 to-juldd-greenDark/10" />

      {/* Grid pattern - only add mousemove effect after mount */}
      <div
        className="absolute inset-0 bg-[url('/grid.svg')] bg-[length:10px_10px] bg-repeat opacity-5"
        style={mounted ? {
          transform: `translateX(${mousePosition.x * -5}px) translateY(${mousePosition.y * -5}px)`,
          transition: "transform 1s cubic-bezier(0.075, 0.82, 0.165, 1)"
        } : {}}
      />

      {/* Moving circles - large ones with conditional transforms */}
      <div
        className="absolute top-[10%] left-[5%] w-[40vw] h-[40vw] rounded-full bg-juldd-gold/5 filter blur-[100px] animate-float"
        style={{
          animationDuration: '30s',
          transform: mounted ? `translateX(${mousePosition.x * -30}px) translateY(${mousePosition.y * -30}px)` : 'none'
        }}
      />
      <div
        className="absolute top-[40%] right-[10%] w-[35vw] h-[35vw] rounded-full bg-juldd-greenDark/5 filter blur-[100px] animate-float"
        style={{
          animationDuration: '25s',
          animationDelay: '2s',
          transform: mounted ? `translateX(${mousePosition.x * -20}px) translateY(${mousePosition.y * -20}px)` : 'none'
        }}
      />
      <div
        className="absolute bottom-[15%] left-[20%] w-[30vw] h-[30vw] rounded-full bg-juldd-deep/5 filter blur-[100px] animate-float"
        style={{
          animationDuration: '28s',
          animationDelay: '1s',
          transform: mounted ? `translateX(${mousePosition.x * -25}px) translateY(${mousePosition.y * -25}px)` : 'none'
        }}
      />

      {/* Moving circles - medium ones */}
      <div className="absolute top-[30%] left-[25%] w-[20vw] h-[20vw] rounded-full bg-juldd-gold/10 filter blur-[80px] animate-float" style={{ animationDuration: '20s', animationDelay: '3s' }}></div>
      <div className="absolute top-[60%] right-[25%] w-[25vw] h-[25vw] rounded-full bg-juldd-greenDark/10 filter blur-[80px] animate-float" style={{ animationDuration: '22s', animationDelay: '2.5s' }}></div>

      {/* Moving circles - small ones */}
      <div className="absolute top-[15%] right-[30%] w-[10vw] h-[10vw] rounded-full bg-juldd-deep/10 filter blur-[50px] animate-float" style={{ animationDuration: '18s', animationDelay: '1.5s' }}></div>
      <div className="absolute bottom-[25%] right-[15%] w-[15vw] h-[15vw] rounded-full bg-juldd-gold/10 filter blur-[60px] animate-float" style={{ animationDuration: '15s', animationDelay: '1s' }}></div>
      <div className="absolute bottom-[45%] left-[10%] w-[12vw] h-[12vw] rounded-full bg-juldd-greenDark/10 filter blur-[60px] animate-float" style={{ animationDuration: '17s', animationDelay: '0.5s' }}></div>

      {/* Animated particles with fixed positions to prevent hydration mismatch */}
      <div className="particles absolute inset-0 z-0">
        {particlePositions.map((pos, i) => (
          <div
            key={i}
            className="particle absolute w-1 h-1 rounded-full bg-white/40"
            style={{
              top: pos.top,
              left: pos.left,
              opacity: pos.opacity,
              animation: `float ${pos.animationDuration} linear infinite`,
              animationDelay: pos.animationDelay
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Fixed MagneticButton - similar approach to MouseTrackCard
const MagneticButton: React.FC<{
  children: React.ReactNode,
  className?: string,
  onClick?: () => void,
  disabled?: boolean; // Added disabled prop
}> = ({ children, className, onClick, disabled }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Always initialize the springs
  const xMotion = useSpring(0, { damping: 20, stiffness: 200 });
  const yMotion = useSpring(0, { damping: 20, stiffness: 200 });

  // Client-side effect
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current || !isHovered || disabled) return; // Ignore if disabled

    const rect = buttonRef.current.getBoundingClientRect();
    // Calculate distance from center
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);

    // Scale down movement for subtlety (maximum 10px movement)
    setPosition({
      x: x * 0.2,
      y: y * 0.2
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setPosition({ x: 0, y: 0 });
  };

  // Update springs in useEffect
  useEffect(() => {
    if (isMounted && !disabled) { // Only update if not disabled
      xMotion.set(position.x);
      yMotion.set(position.y);
    } else { // Reset if disabled
      xMotion.set(0);
      yMotion.set(0);
    }
  }, [position, xMotion, yMotion, isMounted, disabled]);

  return (
    <motion.button
      ref={buttonRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => !disabled && setIsHovered(true)} // Only hover if not disabled
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      disabled={disabled} // Pass disabled prop
      style={{
        x: xMotion,
        y: yMotion,
        transition: "transform 0.1s ease"
      }}
    >
      {children}
    </motion.button>
  );
};

// Enhanced underlined heading with gradient
const GradientHeading: React.FC<{
  children: React.ReactNode,
  className?: string,
  from?: string,
  via?: string,
  to?: string
}> = ({ children, className, from = "from-juldd-gold", via = "via-juldd-gold/70", to = "to-juldd-gold/50" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <motion.div
      ref={ref}
      className={`relative inline-block ${className || ''} group`}
      initial={isMounted ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
      animate={isMounted && isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <h2 className={`text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${from} ${via} ${to} hover:scale-105 transition-transform duration-300`}>
        {children}
      </h2>
      {isMounted && (
        <motion.div
          className={`absolute -bottom-2 left-0 h-1 bg-gradient-to-r ${from} ${via} ${to} rounded-full`}
          initial={{ width: "0%" }}
          animate={isInView ? { width: "100%" } : { width: "0%" }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        />
      )}
    </motion.div>
  );
};

// Feature card component
const FeatureCard = ({ title, description, icon, index }: FeatureCardProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <MouseTrackCard className="h-full">
      <Card className="glass-card h-full backdrop-blur-lg border border-white/20 dark:border-white/10 hover:shadow-lg hover:shadow-juldd-gold/10 dark:hover:shadow-juldd-gold/20 transition-all duration-300 overflow-hidden">
        <motion.div
          initial={isMounted ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
          whileInView={isMounted ? { opacity: 1, y: 0 } : {}}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 * index }}
          className="h-full flex flex-col"
        >
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xl">
              {icon}
              <span>{title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 flex-grow">
            <CardDescription className="text-sm text-foreground/80">{description}</CardDescription>
          </CardContent>
        </motion.div>
      </Card>
    </MouseTrackCard>
  );
};

// --- Pricing section integrated for the homepage ---
interface PricingSectionProps {
  userTierId: string;
  isAuthenticated: boolean;
}

const PricingSection = ({ userTierId, isAuthenticated }: PricingSectionProps) => {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');
  const [isMounted, setIsMounted] = useState(false);
  const switchRef = useRef<HTMLButtonElement>(null);
  const toggleAnimation = useRef(false);
  const [isLoading, setIsLoading] = useState<string | null>(null); // State for button loading

  // Set mounted state
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Animate the toggle switch on initial render - only on client
  useEffect(() => {
    if (isMounted && !toggleAnimation.current && switchRef.current) {
      setTimeout(() => {
        setBillingInterval('yearly');
        setTimeout(() => {
          setBillingInterval('monthly');
          toggleAnimation.current = true;
        }, 1500);
      }, 1000);
    }
  }, [isMounted]);

  // Function to handle subscription with redirect checkout
  const handleSubscribe = async (priceId: string) => {
    // This should only be called if isAuthenticated is true
    if (!isAuthenticated) return;

    setIsLoading(priceId);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        window.location.href = data.url; // Redirect to Stripe Checkout
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      toast.error(error.message || 'Something went wrong');
      setIsLoading(null);
    }
  };

  // Custom pricing tiers for JULDD
  const JULDD_PRICING_TIERS = [
    {
      id: 'free',
      name: 'Free',
      description: 'Perfect for trying out our platform',
      popular: false,
      features: [
        '5 promo packs per month',
        'Basic templates',
        'Standard image quality',
        'JULDD watermark',
        'Email support'
      ],
      pricing: {
        monthly: { amount: 0, priceId: null },
        yearly: { amount: 0, priceId: null, discount: 0 }
      }
    },
    {
      id: 'basic',
      name: 'Basic',
      description: 'For small businesses with regular needs',
      popular: true,
      features: [
        '30 promo packs per month',
        'All templates included',
        'High-quality images',
        'No watermarks',
        'Priority email support',
        'Social media scheduling'
      ],
      pricing: {
        monthly: { amount: 1999, priceId: 'price_basic_monthly' },
        yearly: { amount: 19190, priceId: 'price_basic_yearly', discount: 20 }
      }
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'For businesses with high-volume needs',
      popular: false,
      features: [
        'Unlimited promo packs',
        'Premium templates',
        'Ultra-high quality images',
        'Priority generation',
        'Phone & email support',
        'Advanced analytics',
        'Custom branding options'
      ],
      pricing: {
        monthly: { amount: 3999, priceId: 'price_premium_monthly' },
        yearly: { amount: 38390, priceId: 'price_premium_yearly', discount: 20 }
      }
    }
  ];

  return (
    <>
      <div className="text-center mb-12">
        <GradientHeading className="mb-4 justify-center mx-auto text-center">
          Simple, Transparent Pricing
        </GradientHeading>
        <motion.p
          className="text-lg text-muted-foreground mb-8"
          initial={isMounted ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
          whileInView={isMounted ? { opacity: 1, y: 0 } : {}}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Choose the perfect plan for your promotional content needs. No complex credit systems or hidden fees.
        </motion.p>

        {/* Billing toggle */}
        <motion.div
          className="flex items-center justify-center space-x-4 mb-8"
          initial={isMounted ? { opacity: 0 } : { opacity: 1 }}
          whileInView={isMounted ? { opacity: 1 } : {}}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <span className={`text-sm ${billingInterval === 'monthly' ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
            Monthly
          </span>
          <button
            ref={switchRef}
            type="button"
            className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-juldd-gold/20 backdrop-blur-sm transition-colors duration-300 ease-spring focus:outline-none focus:ring-2 focus:ring-juldd-gold/30 focus:ring-offset-2 group"
            role="switch"
            aria-checked={billingInterval === 'yearly'}
            onClick={() => setBillingInterval(billingInterval === 'monthly' ? 'yearly' : 'monthly')}
          >
            <motion.span
              aria-hidden="true"
              className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition-all duration-300"
              animate={isMounted ? {
                x: billingInterval === 'yearly' ? 20 : 0
              } : {}}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
            />
            <span className="sr-only">{billingInterval === 'monthly' ? 'Switch to yearly billing' : 'Switch to monthly billing'}</span>

            {/* Particle effects on toggle - client-side only */}
            {isMounted && (
              <AnimatePresence>
                {billingInterval === 'yearly' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute right-0 top-0"
                  >
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute h-1 w-1 rounded-full bg-juldd-gold/50"
                        initial={{
                          x: 0,
                          y: 0,
                          opacity: 1,
                          scale: 0.5 + (i * 0.1)
                        }}
                        animate={{
                          x: ((i % 3) - 1) * 10,
                          y: ((i % 3) - 1) * 10,
                          opacity: 0,
                          scale: 0
                        }}
                        transition={{
                          duration: 0.4 + (i * 0.1),
                          ease: "easeOut"
                        }}
                        style={{
                          top: `${(i * 20) + 10}%`,
                          right: `${(i * 10) + 10}%`
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </button>
          <span className={`text-sm flex items-center gap-1.5 ${billingInterval === 'yearly' ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
            Yearly
            <motion.span
              className="inline-block px-1.5 py-0.5 text-xs rounded-full bg-juldd-gold/10 text-juldd-gold/90 font-medium backdrop-blur-sm"
              animate={isMounted ? {
                scale: billingInterval === 'yearly' ? [1, 1.1, 1] : 1
              } : {}}
              transition={{
                duration: 0.4,
                times: [0, 0.5, 1],
                ease: "easeInOut"
              }}
            >
              Save 20%
            </motion.span>
          </span>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {JULDD_PRICING_TIERS.map((tier, index) => {
          const price = tier.pricing[billingInterval];
          const isCurrentPlan = userTierId === tier.id;

          // Determine button content and action based on authentication state
          let buttonContent: React.ReactNode;
          let buttonAction: (() => void) | undefined;
          let buttonLink: string | undefined;
          let buttonDisabled = false;
          let buttonStyleClass = tier.popular
            ? 'bg-gradient-to-r from-juldd-gold/90 to-juldd-gold/70 text-juldd-deep hover:opacity-90'
            : 'glass-button bg-white/10 hover:bg-white/20 text-foreground';

          if (!isAuthenticated) {
            // --- Unauthenticated User Logic ---
            buttonContent = "Sign up";
            buttonLink = "/signup";
            buttonStyleClass = 'glass-button bg-white/10 hover:bg-white/20 text-foreground'; // Consistent style for signup
          } else {
            // --- Authenticated User Logic ---
            if (price.priceId) {
              // Paid Tier
              if (isCurrentPlan) {
                buttonContent = "Current Plan";
                buttonDisabled = true;
                buttonStyleClass += ' cursor-not-allowed opacity-60';
              } else {
                buttonContent = isLoading === price.priceId ? 'Processing...' : 'Subscribe';
                buttonAction = () => handleSubscribe(price.priceId!);
                buttonDisabled = isLoading === price.priceId;
              }
            } else {
              // Free Tier
              if (isCurrentPlan) {
                buttonContent = "Current Plan";
                buttonDisabled = true;
                buttonStyleClass += ' cursor-not-allowed opacity-60';
              } else {
                buttonContent = "Get Started";
                buttonLink = "/dashboard"; // Authenticated users go to dashboard from free tier
              }
            }
          }

          return (
            <MouseTrackCard key={tier.id} className="h-full">
              <motion.div
                initial={isMounted ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
                whileInView={isMounted ? { opacity: 1, y: 0 } : {}}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
                className="h-full"
              >
                <Card className={`glass-card backdrop-blur-lg border relative overflow-hidden h-full flex flex-col
                  ${tier.popular ? 'border-juldd-gold/30 shadow-lg shadow-juldd-gold/10 dark:shadow-juldd-gold/20' : 'border-white/20 dark:border-white/10'}
                  hover:shadow-xl hover:shadow-juldd-gold/10 dark:hover:shadow-juldd-gold/20 transition-all duration-300`}
                >
                  {tier.popular && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-juldd-gold/90 to-juldd-gold/70 text-juldd-deep text-xs px-3 py-1 rounded-bl-lg flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      <span>Popular</span>
                    </div>
                  )}

                  <CardHeader>
                    <CardTitle className={`text-xl ${tier.popular ? "text-juldd-gold" : ""}`}>{tier.name}</CardTitle>
                    <CardDescription>{tier.description}</CardDescription>
                    <div className="mt-4">
                      {price.amount ? (
                        <div className="flex items-end">
                          <motion.span
                            className="text-3xl font-bold"
                            key={`${price.amount}-${billingInterval}`}
                            initial={isMounted ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
                            animate={isMounted ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.3 }}
                          >
                            {formatPrice(price.amount)}
                          </motion.span>
                          <span className="text-muted-foreground ml-1 mb-1">/{billingInterval === 'monthly' ? 'mo' : 'yr'}</span>
                        </div>
                      ) : (
                        <span className="text-3xl font-bold">Free</span>
                      )}

                      {isMounted && billingInterval === 'yearly' && tier.pricing.yearly.discount && (
                        <motion.p
                          className="text-sm text-juldd-gold/90 mt-1"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          key="yearly-discount"
                          transition={{ duration: 0.3, delay: 0.1 }}
                        >
                          Save {tier.pricing.yearly.discount}% with annual billing
                        </motion.p>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="pb-0 flex-grow">
                    <ul className="space-y-2">
                      {tier.features.map((feature, i) => (
                        <motion.li
                          key={i}
                          className="flex items-start gap-2"
                          initial={isMounted ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                          whileInView={isMounted ? { opacity: 1, x: 0 } : {}}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: 0.05 * i }}
                        >
                          <Check className="h-5 w-5 text-juldd-gold shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="pt-6 mt-6">
                    <MagneticButton
                      onClick={buttonAction}
                      disabled={buttonDisabled}
                      className={`w-full rounded-md py-2 px-4 font-medium ${buttonStyleClass}`}
                    >
                      {buttonLink ? (
                        <Link href={buttonLink} className="flex items-center justify-center w-full h-full">
                          {buttonContent}
                        </Link>
                      ) : (
                        buttonContent
                      )}
                    </MagneticButton>
                  </CardFooter>
                </Card>
              </motion.div>
            </MouseTrackCard>
          );
        })}
      </div>
    </>
  );
};


// --- Main Landing Page Component ---
export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.8]);
  const heroY = useTransform(scrollYProgress, [0, 0.1], [0, -50]);
  const progressBarScaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // State for user and subscription data
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userTierId, setUserTierId] = useState<string>('free'); // Default to free

  // Fetch user and subscription data on client-side
  useEffect(() => {
    setMounted(true);

    const checkAuthAndSubscription = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);

      if (user) {
        // Fetch subscription if user is logged in
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('*, prices(id, products(*))')
          .eq('user_id', user.id)
          .in('status', ['trialing', 'active'])
          .maybeSingle();

        if (subscription) {
          const priceId = subscription.prices?.id;
          const { tier } = getTierByPriceId(priceId);
 if (tier) {
            setUserTierId(tier.id);
          }
        } else {
          setUserTierId('free'); // User is logged in but has no active subscription
        }
      } else {
        setUserTierId('free'); // User is not logged in
      }
    };

    checkAuthAndSubscription();
  }, []);

  return (
    <>
      {/* Progress bar - only on client */}
      {mounted && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-juldd-gold via-juldd-gold/70 to-juldd-gold/50 z-50 origin-left"
          style={{ scaleX: progressBarScaleX }}
        />
      )}

      {/* Animated background */}
      <AnimatedBackground />

      {/* Hero section */}
      <motion.section
        className="relative py-36 md:py-48 z-10 overflow-hidden"
        style={mounted ? { opacity: heroOpacity, y: heroY } : {}}
      >
        <div className="absolute inset-0">
          <Image
            src="/hero-bg.jpg" // Replace with your own hero image path
            alt="JULDD Promo Generator"
            layout="fill"
            objectFit="cover"
            quality={75}
            className="opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-juldd-deep/70 to-juldd-greenDark/70"></div>
        </div>
        <div className="container mx-auto px-4 relative">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={mounted ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-block mb-4 px-4 py-1.5 bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-full text-foreground/90 text-sm border border-white/20 shadow-lg"
              initial={mounted ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-juldd-gold/80" />
                Unleash Your Brand's Potential
              </span>
            </motion.div>

            <motion.div
              initial={mounted ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight text-white drop-shadow-lg">
                JULDD Insta-Promo Pack Generator
              </h1>
            </motion.div>

            <motion.p
              className="text-xl sm:text-2xl text-white/80 mb-8 leading-relaxed drop-shadow-md"
              initial={mounted ? { opacity: 0 } : { opacity: 1 }}
              animate={mounted ? { opacity: 1 } : {}}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              AI-powered promotional content creation for small businesses and startups.
              Generate stunning social media posts, captions, and downloadable materials in seconds.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={mounted ? { opacity: 0 } : { opacity: 1 }}
              animate={mounted ? { opacity: 1 } : {}}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <MagneticButton className="bg-gradient-to-r from-juldd-gold/90 to-juldd-gold/70 hover:from-juldd-gold/95 hover:to-juldd-gold/75 text-juldd-deep rounded-md py-3 px-6 font-medium shadow-md hover:shadow-lg transition-shadow text-xl">
                <Link href="/dashboard" className="flex items-center">
                  <Instagram className="mr-2 h-5 w-5" />
                  Create Your First Promo
                </Link>
              </MagneticButton>

              <MagneticButton
                className="glass-button bg-white/10 hover:bg-white/20 text-white rounded-md py-3 px-6 font-medium text-xl"
                onClick={() => {
                  if (mounted) {
                    const pricingSection = document.getElementById('pricing');
                    if (pricingSection) {
                      pricingSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                }}
              >
                View Plans
              </MagneticButton>
            </motion.div>
          </motion.div>
        </div>

        {/* Bouncing arrow indicator - client-side only */}
        {mounted && (
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{
              y: [0, 10, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop"
            }}
          >
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-juldd-gold/70"
              whileHover={{ scale: 1.2 }}
            >
              <path d="M12 5v14M5 12l7 7 7-7"/>
            </motion.svg>
          </motion.div>
        )}
      </motion.section>

      {/* Features section */}
      <section className="py-20 z-10 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <GradientHeading className="mx-auto justify-center">
              Powerful Features for Small Businesses
            </GradientHeading>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <MouseTrackCard>
              <motion.div
                className="glass-card rounded-xl p-6 backdrop-blur-lg border border-white/20 dark:border-white/10 h-full"
                initial={mounted ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
                whileInView={mounted ? { opacity: 1, y: 0 } : {}}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="w-12 h-12 bg-juldd-gold/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-juldd-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-juldd-gold">AI Image Generation</h3>
                <p className="text-foreground/80">
                  Create stunning promotional visuals tailored to your business type and brand identity with our advanced AI.
                </p>
              </motion.div>
            </MouseTrackCard>

            {/* Feature 2 */}
            <MouseTrackCard>
              <motion.div
                className="glass-card rounded-xl p-6 backdrop-blur-lg border border-white/20 dark:border-white/10 h-full"
                initial={mounted ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
                whileInView={mounted ? { opacity: 1, y: 0 } : {}}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="w-12 h-12 bg-juldd-gold/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-juldd-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-juldd-gold">Smart Caption Creator</h3>
                <p className="text-foreground/80">
                  Generate compelling captions with strong calls-to-action that drive customer engagement and conversions.
                </p>
              </motion.div>
            </MouseTrackCard>

            {/* Feature 3 */}
            <MouseTrackCard>
              <motion.div
                className="glass-card rounded-xl p-6 backdrop-blur-lg border border-white/20 dark:border-white/10 h-full"
                initial={mounted ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
                whileInView={mounted ? { opacity: 1, y: 0 } : {}}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="w-12 h-12 bg-juldd-gold/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-juldd-gold/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-juldd-gold/90">Insta-PDF Generator</h3>
                <p className="text-foreground/80">
                  Create matching downloadable materials like menus, price lists, or event flyers that complement your social posts.
                </p>
              </motion.div>
            </MouseTrackCard>
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section className="py-20 z-10 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <GradientHeading className="mx-auto justify-center" from="from-juldd-gold/90" via="via-juldd-gold/70" to="to-juldd-gold/50">
              How It Works - From Idea to Promo in 60 Seconds
            </GradientHeading>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection line with animated gradient - client-side only */}
            {mounted && (
              <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-1 overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-juldd-gold via-juldd-gold/70 to-juldd-gold/50"
                  animate={{
                    x: ["-100%", "100%"]
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </div>
            )}

            {/* Step 1 */}
            <MouseTrackCard>
              <motion.div
                className="relative glass-card p-6 text-center backdrop-blur-lg border border-white/20 dark:border-white/10 h-full"
                initial={mounted ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
                whileInView={mounted ? { opacity: 1, y: 0 } : {}}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="bg-gradient-to-r from-juldd-gold to-juldd-gold/70 text-juldd-deep w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 z-10 relative">
                  {mounted ? (
                    <motion.span
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      1
                    </motion.span>
                  ) : (
                    <span>1</span>
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-2">Enter Business Details</h3>
                <p className="text-foreground/80">
                  Simply enter your business type and the promotion you want to create.
                </p>
              </motion.div>
            </MouseTrackCard>

            {/* Step 2 */}
            <MouseTrackCard>
              <motion.div
                className="relative glass-card p-6 text-center backdrop-blur-lg border border-white/20 dark:border-white/10 h-full"
                initial={mounted ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
                whileInView={mounted ? { opacity: 1, y: 0 } : {}}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="bg-gradient-to-r from-juldd-gold/70 to-juldd-gold/50 text-juldd-deep w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 z-10 relative">
                  {mounted ? (
                    <motion.span
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                    >
                      2
                    </motion.span>
                  ) : (
                    <span>2</span>
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-2">Select Template</h3>
                <p className="text-foreground/80">
                  Choose from industry-specific templates or customize to match your brand.
                </p>
              </motion.div>
            </MouseTrackCard>

            {/* Step 3 */}
            <MouseTrackCard>
              <motion.div
                className="relative glass-card p-6 text-center backdrop-blur-lg border border-white/20 dark:border-white/10 h-full"
                initial={mounted ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
                whileInView={mounted ? { opacity: 1, y: 0 } : {}}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="bg-gradient-to-r from-juldd-gold/50 to-juldd-gold text-juldd-deep w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 z-10 relative">
                  {mounted ? (
                    <motion.span
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1.2 }}
                    >
                      3
                    </motion.span>
                  ) : (
                    <span>3</span>
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-2">Generate & Publish</h3>
                <p className="text-foreground/80">
                  Get your complete promo pack with images, captions, and downloadable materials ready to share.
                </p>
              </motion.div>
            </MouseTrackCard>
          </div>
        </div>
      </section>

      {/* Business types section */}
      <section className="py-20 z-10 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <GradientHeading className="mx-auto justify-center" from="from-juldd-gold" to="to-juldd-gold/50">
              Specialized for Your Business
            </GradientHeading>
            
            <motion.p
              className="text-center text-foreground/80 mt-6 max-w-3xl mx-auto"
              initial={mounted ? { opacity: 0 } : { opacity: 1 }}
              whileInView={mounted ? { opacity: 1 } : {}}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Industry-specific templates designed for small businesses like yours
            </motion.p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: "Restaurants & Cafés", icon: "🍽️" },
              { name: "Retail Shops", icon: "🛍️" },
              { name: "Beauty & Wellness", icon: "💆" },
              { name: "Fitness Studios", icon: "🏋️" },
              { name: "Professional Services", icon: "👔" },
              { name: "Home Services", icon: "🔧" },
              { name: "Event Planners", icon: "🎉" },
              { name: "Local Artisans", icon: "🎨" },
            ].map((business, index) => (
              <MouseTrackCard key={business.name}>
                <motion.div
                  className="glass-card p-4 text-center backdrop-blur-lg border border-white/20 dark:border-white/10 h-full"
                  initial={mounted ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                  whileInView={mounted ? { opacity: 1, y: 0 } : {}}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                >
                  <div className="text-center">
                    <div className="h-12 flex items-center justify-center mb-2">
                      <div className="text-3xl">
                        {business.icon}
                      </div>
                    </div>
                    <p className="font-medium">{business.name}</p>
                  </div>
                </motion.div>
              </MouseTrackCard>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing section - Pass user data */}
      <section className="py-20 z-10 relative" id="pricing">
        <div className="container mx-auto px-4">
          <PricingSection userTierId={userTierId} isAuthenticated={isAuthenticated} />
        </div>
      </section>

      {/* Testimonials section */}
      <motion.section
        className="py-20 z-10 relative bg-juldd-deep"
        initial={mounted ? { opacity: 0 } : { opacity: 1 }}
        whileInView={mounted ? { opacity: 1 } : {}}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <GradientHeading className="mx-auto justify-center" from="from-juldd-gold" via="via-juldd-gold/70" to="to-juldd-gold/50">
              What Small Business Owners Say
            </GradientHeading>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "I used to spend hours creating promotional content. Now I can generate a complete promo pack in under a minute!",
                author: "Sarah T.",
                business: "Café Owner"
              },
              {
                quote: "The templates are perfect for my boutique. My Instagram engagement has increased by 45% since I started using JULDD.",
                author: "Michael R.",
                business: "Retail Shop Owner"
              },
              {
                quote: "As a solo entrepreneur, I don't have time for marketing. This tool has been a game-changer for my business.",
                author: "Jessica L.",
                business: "Fitness Instructor"
              }
            ].map((testimonial, index) => (
              <MouseTrackCard key={index}>
                <motion.div
                  className="glass-card p-6 backdrop-blur-lg border border-white/20 dark:border-white/10 h-full text-white"
                  initial={mounted ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                  whileInView={mounted ? { opacity: 1, y: 0 } : {}}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 * index }}
                >
                  <div className="flex flex-col h-full">
                    <div className="text-juldd-gold/80 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-juldd-gold">
                        <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
                        <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
                      </svg>
                    </div>
                    <p className="text-white/90 mb-4 flex-grow">{testimonial.quote}</p>
                    <div className="mt-auto">
                      <p className="font-semibold text-juldd-gold">{testimonial.author}</p>
                      <p className="text-sm text-white/70">{testimonial.business}</p>
                    </div>
                  </div>
                </motion.div>
              </MouseTrackCard>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA section */}
      <motion.section
        className="py-20 z-10 relative"
        initial={mounted ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
        whileInView={mounted ? { opacity: 1, y: 0 } : {}}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.div
            className="glass-card p-8 max-w-4xl mx-auto border border-white/20 dark:border-white/10 backdrop-blur-lg relative overflow-hidden rounded-xl"
            initial={mounted ? { opacity: 0, scale: 0.95 } : { opacity: 1, scale: 1 }}
            whileInView={mounted ? { opacity: 1, scale: 1 } : {}}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Animated highlights - client-side only */}
            {mounted && (
              <>
                <div className="absolute -top-40 -left-40 w-80 h-80 bg-juldd-gold/20 rounded-full blur-3xl animate-pulse opacity-70"></div>
                <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-juldd-gold/20 rounded-full blur-3xl animate-pulse opacity-70" style={{ animationDelay: '1s' }}></div>
              </>
            )}

            <motion.div
              className="relative z-10"
              initial={mounted ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="text-4xl font-bold mb-4 text-juldd-gold">
                Ready to Transform Your Promotions?
              </h2>
              <p className="text-lg text-foreground/80 mb-8">
                Join hundreds of small businesses using JULDD to create stunning promotional content effortlessly.
              </p>
              <MagneticButton className="bg-gradient-to-r from-juldd-gold/90 to-juldd-gold/70 hover:from-juldd-gold/95 hover:to-juldd-gold/75 text-juldd-deep rounded-md py-3 px-6 font-semibold shadow-lg hover:shadow-xl transition-shadow">
                <Link href="/signup" className="flex items-center gap-2">
                  Get Started Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </MagneticButton>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <Footer />
    </>
  );
}



