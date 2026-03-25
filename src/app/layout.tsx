import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/providers/QueryProvider';
import { MockDataProvider } from '@/providers/MockDataProvider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ClassesBA - Exercise Classes in Buenos Aires',
  description:
    'Discover and book exercise classes across Buenos Aires. Yoga, HIIT, Pilates, Boxing, and more.',
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <MockDataProvider>
            <TooltipProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <Toaster position="bottom-right" />
            </TooltipProvider>
          </MockDataProvider>
        </QueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
