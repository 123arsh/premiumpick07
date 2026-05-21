import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: {
    default: process.env.NEXT_PUBLIC_SITE_NAME || 'Premium Picks',
    template: `%s | ${process.env.NEXT_PUBLIC_SITE_NAME || 'Premium Picks'}`,
  },
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    'Curated affiliate product recommendations — premium picks at the best prices.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://your-project.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Instrument+Serif:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-screen font-sans"
        style={
          {
            '--font-geist-sans': '"DM Sans", system-ui, sans-serif',
            '--font-display': '"Instrument Serif", Georgia, serif',
          } as React.CSSProperties
        }
      >
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            className: 'dark:!bg-zinc-800 dark:!text-white',
            duration: 4000,
          }}
        />
      </body>
    </html>
  );
}
