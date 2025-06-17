'use client';

import Link from 'next/link';
import { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/schedule', label: 'Schedule' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/workshop', label: 'Workshop' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="bg-white ">
   Header
    </header>
  );
};

export default Header; 