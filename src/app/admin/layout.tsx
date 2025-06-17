import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Admin Dashboard - Arunachal Literature',
  description: 'Admin dashboard for managing Arunachal Literature content',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
        <main className="flex-1 p-8">
          {children}
        </main>
    </div>
  );
} 