'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import AOS from 'aos';
import 'aos/dist/aos.css';

export function AosProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    try {
      AOS.init({
        duration: 700,
        once: true,
        easing: 'ease-out-cubic',
        offset: 40,
        delay: 50,
      });
    } catch (err) {
      console.warn('AOS initialization warning:', err);
    }
  }, []);

  useEffect(() => {
    try {
      AOS.refresh();
    } catch (err) {
      console.warn('AOS refresh warning:', err);
    }
  }, [pathname]);

  return <>{children}</>;
}
