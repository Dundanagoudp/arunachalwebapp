'use client';

import { usePathname } from 'next/navigation';
import Header from './layout/Header';
import Footer from './layout/Footer';

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginPage = pathname === '/login';

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && !isLoginPage && <Header />}
      <main className="flex-grow">
        {children}
      </main>
      {!isAdminRoute && !isLoginPage && <Footer />}
    </div>
  );
} 