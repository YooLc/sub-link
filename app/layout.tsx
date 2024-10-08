import type { Metadata } from 'next';
import './globals.css';

import { ThemeProvider } from 'next-themes';
import { Inter } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from 'react-hot-toast';
import { NextUIProvider } from '@nextui-org/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sublink',
  description: 'Create short link via subdomain',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SpeedInsights />
      <Analytics />
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextUIProvider>
            <div className="fixed inset-0 flex items-center justify-center bg-blue-100 w-full h-full">
              <div className="bg-white shadow-xl rounded-xl  w-11/12 h-5/6 sm:w-3/4 sm:h-3/4 md:w-2/3 md:h-2/3 transition-all duration-300 overflow-hidden">
                {children}
              </div>
            </div>
            <Toaster position="top-center" reverseOrder={false} />
          </NextUIProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
