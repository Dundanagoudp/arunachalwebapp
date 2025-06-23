'use client';

import { usePathname } from 'next/navigation';
import Header from './layout/Header';
import Footer from './layout/Footer';
import LoadingProgress from './LoadingProgress';
import { useEffect, useState } from 'react';

export default function AdminLayoutWrapper({
  children,
  showHeaderFooter,
}: {
  children: React.ReactNode;
  showHeaderFooter: boolean;
}) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [isLoginPage, setIsLoginPage] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsAdminRoute(pathname.startsWith('/admin'));
    setIsLoginPage(pathname === '/login');
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      {showHeaderFooter && !isAdminRoute && !isLoginPage && <LoadingProgress />}
      {showHeaderFooter && !isAdminRoute && !isLoginPage && <Header />}
      <main className="flex-grow">
        {children}
      </main>
      {showHeaderFooter && !isAdminRoute && !isLoginPage && <Footer />}
    </div>
  );
} 