// src/lib/config/metadata.ts
import { Metadata } from 'next';

/**
 * Comprehensive application metadata configuration
 * Used globally across the entire application
 */
export const siteMetadata: Metadata = {
  // Basic metadata
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://juldd.com'),
  title: {
    default: 'JULDD Insta-Promo Pack Generator',
    template: '%s | JULDD Insta-Promo Pack Generator'
  },
  description: 'Generate stunning, branded social media promo packs in seconds. AI-powered images, captions, and PDFs for small businesses. Founded by Julie Todd, 2024.',
  applicationName: 'JULDD Insta-Promo Pack Generator',
  authors: [{ name: 'Julie Todd', url: 'https://juldd.com' }],
  generator: 'Next.js',
  keywords: ['JULDD', 'social media', 'promo pack', 'AI', 'branding', 'small business', 'image generation', 'PDF', 'SaaS'],
  referrer: 'origin-when-cross-origin',
  creator: 'Julie Todd',
  publisher: 'JULDD LLC',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  // Appearance
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0B3D2E' }
  ],
  colorScheme: 'dark',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },

  // Icons
  icons: {
    icon: [
      { url: '/juldd_favicon.png', sizes: 'any' },
      { url: '/juldd_logo.svg', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/juldd_favicon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      { rel: 'mask-icon', url: '/juldd_logo.svg', color: '#D4AF37' }
    ]
  },

  // AppLinks (deep linking)
  appleWebApp: {
    title: 'JULDD Insta-Promo Pack Generator',
    statusBarStyle: 'black-translucent',
    capable: true,
  },

  // Verification
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || 'google-site-verification',
    yandex: process.env.YANDEX_VERIFICATION || 'yandex-verification',
    yahoo: process.env.YAHOO_VERIFICATION || 'yahoo-verification',
    other: {
      'facebook-domain-verification': process.env.FACEBOOK_DOMAIN_VERIFICATION || 'facebook-domain-verification',
      'baidu-site-verification': process.env.BAIDU_SITE_VERIFICATION || 'baidu-site-verification',
      'bing-verification': process.env.BING_VERIFICATION || 'bing-verification'
    }
  },

  // Open Graph metadata
  openGraph: {
    type: 'website',
    siteName: 'JULDD Insta-Promo Pack Generator',
    title: 'JULDD Insta-Promo Pack Generator',
    description: 'Generate stunning, branded social media promo packs in seconds. AI-powered images, captions, and PDFs for small businesses.',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://juldd.com',
    images: [
      {
        url: '/juldd_logo.png', // Use your best wide logo or OG image
        width: 1200,
        height: 630,
        alt: 'JULDD Insta-Promo Pack Generator',
        type: 'image/png',
        secureUrl: '/juldd_logo.png',
      }
    ],
    countryName: 'United States',
    determiner: 'the',
    emails: ['julie@juldd.com'],
    phoneNumbers: [],
    faxNumbers: [],
  },

  // Twitter metadata
  twitter: {
    card: 'summary_large_image',
    site: 'https://x.com/JULDDLLC',
    creator: '@julddllc',
    title: 'JULDD Insta-Promo Pack Generator',
    description: 'Generate stunning, branded social media promo packs in seconds. AI-powered images, captions, and PDFs for small businesses.',
    images: {
      url: '/juldd_logo.png',
      alt: 'JULDD Insta-Promo Pack Generator',
    }
  },

  // SEO controls
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    }
  },

  // Alternate versions
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://juldd.com',
    languages: {
      'en-US': 'https://juldd.com/en-US',
    },
    media: {
      'only screen and (max-width: 600px)': 'https://juldd.com/mobile',
    },
    types: {
      'application/rss+xml': 'https://juldd.com/rss',
    }
  },

  // Other custom metadata
  other: {
    'msapplication-TileColor': '#0B3D2E',
    'msapplication-config': '/browserconfig.xml',
    'apple-itunes-app': '',
    'google-play-app': '',
    'application-name': 'JULDD Insta-Promo Pack Generator',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'JULDD Insta-Promo Pack Generator',
    'theme-color': '#0B3D2E',
    'format-detection': 'telephone=no',
    'pinterest': process.env.PINTEREST_VERIFICATION || 'pinterest-verification',
    'norton-safeweb-site-verification': process.env.NORTON_VERIFICATION || 'norton-verification',

    // Structured data (JSON-LD)
    'script:ld+json': JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'JULDD Insta-Promo Pack Generator',
      'url': process.env.NEXT_PUBLIC_SITE_URL || 'https://juldd.com',
      'description': 'Generate stunning, branded social media promo packs in seconds. AI-powered images, captions, and PDFs for small businesses.',
      'applicationCategory': 'MultimediaApplication, AIApplication',
      'operatingSystem': 'Web',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      },
      'author': {
        '@type': 'Organization',
        'name': 'JULDD LLC',
        'url': process.env.NEXT_PUBLIC_SITE_URL || 'https://juldd.com'
      },
      'potentialAction': {
        '@type': 'ViewAction',
        'target': [
          process.env.NEXT_PUBLIC_SITE_URL || 'https://juldd.com'
        ]
      },
      'sameAs': [
        'https://twitter.com/julddllc',
        'https://www.instagram.com/julddllc'
      ]
    })
  }
};
