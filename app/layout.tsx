// app/layout.tsx
import type { Metadata } from 'next';
import ClientToastContainer from './components/client-toast-container';
import { Providers } from './utils/providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Leavesync HRMS - Smart Leave Management for Corporates',
  description: 'Comprehensive leave management system by RCS Solutions. Streamline employee leave requests, approvals, and tracking for modern corporate environments.',
  keywords: [
    'HRMS',
    'Leave Management',
    'Employee Leave Tracking',
    'Corporate HR Software',
    'Attendance Management',
    'HR Automation',
    'RCS Solutions',
    'Workforce Management',
    'Paid Time Off',
    'Sick Leave Management',
    'Annual Leave Tracking',
    'Employee Portal'
  ],
  authors: [
    { name: 'RCS Solutions' },
    { name: 'RCS Solutions Team', url: 'https://rcs-solutions.com' }
  ],
  creator: 'RCS Solutions',
  publisher: 'RCS Solutions',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://your-domain.com'), // Replace with your actual domain
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
    },
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a1a' },
  ],
  category: 'Business Software',

  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://your-domain.com', // Replace with your actual domain
    title: 'Leavesync HRMS - Smart Leave Management for Corporates',
    description: 'Streamline employee leave requests, approvals, and tracking with RCS Solutions\' comprehensive HR management system.',
    siteName: 'Leavesync HRMS',
    images: [
      {
        url: '/og-image.png', // Replace with your OG image path
        width: 1200,
        height: 630,
        alt: 'Leavesync HRMS Dashboard Preview',
      },
    ],
  },

  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'Leavesync HRMS - Smart Leave Management for Corporates',
    description: 'Streamline employee leave requests, approvals, and tracking with RCS Solutions.',
    images: ['/twitter-image.png'], // Replace with your Twitter image path
    creator: '@rcssolutions',
    site: '@rcssolutions',
  },

  // Robots
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
    },
  },

  // Icons
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
      { url: '/apple-icon.png', type: 'image/png', sizes: '180x180' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#3b82f6',
      },
    ],
  },

  // Manifest
  manifest: '/site.webmanifest', // Optional: if you have a webmanifest

  // Additional meta tags
  other: {
    'application-name': 'Leavesync HRMS',
    'apple-mobile-web-app-title': 'Leavesync',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#3b82f6',
    'msapplication-config': '/browserconfig.xml', // Optional
    'fb:app_id': 'YOUR_FACEBOOK_APP_ID', // Optional: if you have Facebook integration
    'google-site-verification': 'YOUR_GOOGLE_SITE_VERIFICATION', // Optional: for Google Search Console
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Additional font links or scripts can go here */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <Providers>
          {children}
          <ClientToastContainer />
        </Providers>
      </body>
    </html>
  );
}