import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { AosProvider } from '@/components/AosProvider';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'K.A.S. International School | Bhopal - Premier CBSE Aligned Education',
  description:
    'Official Portal of K.A.S. International School, Bhopal (Khajuri Kalan, Regal Town, BHEL). Delivering world-class holistic education, state-of-the-art STEM labs, smart classrooms, and character-building K-12 schooling.',
  keywords: [
    'KAS International School',
    'KAS International School Bhopal',
    'Best CBSE School in Bhopal',
    'Regal Town BHEL Bhopal School',
    'School Admissions Bhopal 2026',
    'School Management ERP Bhopal',
  ],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script src="https://accounts.google.com/gsi/client" strategy="beforeInteractive" />
      </head>
      <body className="min-h-screen flex flex-col antialiased text-slate-900 bg-slate-50">
        <AuthProvider>
          <AosProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </AosProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
