'use client';

import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export function AosProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic',
      offset: 60,
      delay: 50,
    });

    const handleRouteChange = () => {
      AOS.refresh();
    };

    window.addEventListener('load', handleRouteChange);
    return () => {
      window.removeEventListener('load', handleRouteChange);
    };
  }, []);

  return <>{children}</>;
}
