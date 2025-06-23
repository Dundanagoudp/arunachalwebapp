'use client';

import { usePathname } from 'next/navigation';
import Header from './layout/Header';
import Footer from './layout/Footer';
import LoadingProgress from './LoadingProgress';
import { useEffect, useState } from 'react';

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
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
      {mounted && !isAdminRoute && !isLoginPage && <LoadingProgress />}
      {mounted && !isAdminRoute && !isLoginPage && <Header />}
      <main className="flex-grow">
        {children}
      </main>
      {mounted && !isAdminRoute && !isLoginPage && <Footer />}
    </div>
  );
} 