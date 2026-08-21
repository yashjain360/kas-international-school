'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  UserCheck,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Award,
  BookOpen,
  Send,
  MessageCircle,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  const isErpPage = pathname?.startsWith('/erp');
  if (isErpPage) return null; // ERP uses its dedicated executive sidebar

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navLinks = [
    { name: 'Home', href: '/', icon: GraduationCap },
    { name: 'About', href: '/about', icon: ShieldCheck },
    { name: 'Academics', href: '/academics', icon: BookOpen },
    { name: 'Admissions', href: '/admissions', icon: Sparkles, highlight: true },
    { name: 'Fee Structure', href: '/fee-structure', icon: Calendar },
    { name: 'Faculty', href: '/faculty', icon: Award },
    { name: 'Campus Life', href: '/gallery', icon: Sparkles },
    { name: 'Notices', href: '/notices', icon: Send },
    { name: 'Contact', href: '/contact', icon: MapPin },
  ];

  return (
    <>
      <header className="w-full sticky top-0 z-50 bg-white/98 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
        {/* Top Notification & Secretariat Bar */}
        <div className="bg-[#0A1D30] text-slate-200 text-xs py-1.5 sm:py-2 px-3 sm:px-8 border-b border-slate-800">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            {/* Left: Admissions Announcement */}
            <div className="flex items-center space-x-3 sm:space-x-6 text-[11px] sm:text-xs overflow-hidden">
              <span className="flex items-center text-amber-400 font-semibold whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse mr-1.5 shrink-0"></span>
                <span className="hidden xs:inline">Admissions Open 2026–27 (Pre-Primary to Grade 10)</span>
                <span className="xs:hidden">Admissions 2026–27 Open</span>
              </span>
              <span className="hidden lg:flex items-center text-slate-300 whitespace-nowrap">
                <MapPin className="w-3.5 h-3.5 mr-1 text-amber-400 shrink-0" />
                Khajuri Kalan Rd, Regal Town, BHEL Bhopal
              </span>
            </div>

            {/* Right: Helpline & Admissions Email */}
            <div className="flex items-center space-x-3 sm:space-x-4 text-[11px] sm:text-xs whitespace-nowrap shrink-0">
              <a
                href="tel:+919425992209"
                className="hover:text-amber-400 flex items-center transition-colors font-semibold text-amber-300 sm:text-slate-200"
              >
                <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 text-amber-400 shrink-0" />
                <span>+91 94259 92209</span>
              </a>
              <span className="text-slate-600 hidden md:inline">|</span>
              <a
                href="mailto:admissions@kasinternationalschool.org"
                className="hover:text-amber-400 hidden md:flex items-center transition-colors font-medium text-slate-200"
              >
                <Mail className="w-3.5 h-3.5 mr-1 text-amber-400 shrink-0" />
                admissions@kasinternationalschool.org
              </a>
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-2 lg:gap-4">
            {/* Brand Logo & Title */}
            <Link href="/" className="flex items-center space-x-2.5 sm:space-x-3 group shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-linear-to-br from-[#0F2942] to-[#1E3A8A] flex items-center justify-center text-amber-400 shadow-md group-hover:scale-105 transition-transform shrink-0">
                <GraduationCap className="w-5 h-5 sm:w-7 sm:h-7" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-1 sm:space-x-1.5">
                  <span className="font-extrabold text-base sm:text-xl tracking-tight text-[#0F2942] whitespace-nowrap">
                    K.A.S.
                  </span>
                  <span className="font-bold text-base sm:text-xl tracking-tight text-blue-900 whitespace-nowrap">
                    INTERNATIONAL
                  </span>
                  <span className="hidden sm:inline-block text-amber-600 font-extrabold text-[10px] bg-amber-100/90 border border-amber-200 px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap">
                    Bhopal
                  </span>
                </div>
                <p className="text-[9px] sm:text-[11px] font-semibold text-slate-500 tracking-wide uppercase truncate hidden xs:block">
                  Holistic Excellence • CBSE Aligned
                </p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center space-x-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-xl text-[13px] font-semibold whitespace-nowrap transition-all ${
                      link.highlight
                        ? 'text-amber-800 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/40 shadow-xs'
                        : isActive
                        ? 'text-blue-950 bg-blue-100/70 font-bold shadow-xs'
                        : 'text-slate-700 hover:text-[#0F2942] hover:bg-slate-100/80'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Medium Desktop Compact Nav (lg to xl) */}
            <nav className="hidden lg:flex xl:hidden items-center space-x-1">
              {navLinks.slice(0, 6).map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      link.highlight
                        ? 'text-amber-800 bg-amber-500/10 border border-amber-400/40'
                        : isActive
                        ? 'text-blue-950 bg-blue-100/70 font-bold'
                        : 'text-slate-700 hover:text-[#0F2942] hover:bg-slate-100'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <Link
                href="/notices"
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 whitespace-nowrap"
              >
                More
              </Link>
            </nav>

            {/* ERP Login Button (Desktop) */}
            <div className="hidden md:flex items-center space-x-3 shrink-0">
              {user ? (
                <Link
                  href={
                    user.role === 'admin'
                      ? '/erp/admin/dashboard'
                      : user.role === 'faculty'
                      ? '/erp/faculty/dashboard'
                      : '/erp/student/dashboard'
                  }
                  className="flex items-center space-x-2 bg-[#0F2942] hover:bg-[#1A365D] text-amber-400 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all whitespace-nowrap"
                >
                  <UserCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>ERP Portal ({user.role.toUpperCase()})</span>
                </Link>
              ) : (
                <Link
                  href="/auth/login"
                  className="flex items-center space-x-2 bg-[#0F2942] hover:bg-[#1A365D] text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all whitespace-nowrap group"
                >
                  <UserCheck className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
                  <span>School ERP Login</span>
                </Link>
              )}
            </div>

            {/* Mobile Actions: ERP Quick Icon + Menu Burger */}
            <div className="flex lg:hidden items-center space-x-1.5 sm:space-x-2">
              <Link
                href={user ? `/erp/${user.role}/dashboard` : '/auth/login'}
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#0F2942] text-amber-400 text-xs font-bold flex items-center space-x-1.5 shadow-sm"
              >
                <UserCheck className="w-4 h-4" />
                <span className="hidden sm:inline">ERP</span>
              </Link>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors shrink-0"
                aria-label="Toggle Navigation Menu"
              >
                {isOpen ? <X className="w-5 h-5 text-red-500" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Full Screen Slide Drawer with Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop Blur Overlay */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Slide-in Drawer Container */}
          <div className="relative ml-auto w-[85%] max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto z-10 animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-200 bg-[#0F2942] text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">K.A.S. INTERNATIONAL</h3>
                  <p className="text-[10px] text-amber-400 font-semibold uppercase">Bhopal • CBSE Aligned</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav Items List */}
            <div className="p-4 space-y-1 overflow-y-auto flex-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      link.highlight
                        ? 'text-amber-900 bg-amber-500/15 font-bold border border-amber-400/50 shadow-xs'
                        : isActive
                        ? 'text-blue-950 bg-blue-100/70 font-bold shadow-xs'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-4 h-4 ${link.highlight ? 'text-amber-600' : isActive ? 'text-blue-900' : 'text-slate-400'}`} />
                      <span>{link.name}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                );
              })}
            </div>

            {/* Quick Contact & Action Drawer Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
              <Link
                href={user ? `/erp/${user.role}/dashboard` : '/auth/login'}
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center space-x-2 bg-[#0F2942] hover:bg-[#1A365D] text-white py-3 rounded-xl font-bold shadow-md text-sm transition-all"
              >
                <UserCheck className="w-4 h-4 text-amber-400" />
                <span>{user ? `Go to ${user.role.toUpperCase()} ERP Portal` : 'School ERP Login'}</span>
              </Link>

              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <a
                  href="tel:+919425992209"
                  className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-bold flex items-center justify-center space-x-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-600" />
                  <span>Call Helpline</span>
                </a>
                <a
                  href="https://api.whatsapp.com/send?phone=919425992209&text=Hello%20KAS%20International%20School%2C%20I%20would%20like%20to%20inquire%20about%20admissions."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold flex items-center justify-center space-x-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Quick Action Dock for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A1D30]/95 backdrop-blur-md border-t border-slate-800 py-2 px-3 flex items-center justify-around shadow-2xl safe-area-bottom">
        <a
          href="tel:+919425992209"
          className="flex flex-col items-center justify-center text-slate-300 hover:text-amber-400 py-1 px-2"
        >
          <Phone className="w-4 h-4 text-amber-400 mb-0.5" />
          <span className="text-[10px] font-semibold">Call Desk</span>
        </a>

        <Link
          href="/admissions"
          className="flex flex-col items-center justify-center text-amber-300 py-1 px-3 bg-amber-500/20 border border-amber-400/40 rounded-xl"
        >
          <Sparkles className="w-4 h-4 text-amber-400 mb-0.5" />
          <span className="text-[10px] font-bold">Apply 26-27</span>
        </Link>

        <a
          href="https://api.whatsapp.com/send?phone=919425992209&text=Hello%20KAS%20International%20School%20Bhopal%2C%20I%20would%20like%20to%20inquire%20about%20admissions."
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center text-slate-300 hover:text-emerald-400 py-1 px-2"
        >
          <MessageCircle className="w-4 h-4 text-emerald-400 mb-0.5" />
          <span className="text-[10px] font-semibold">WhatsApp</span>
        </a>

        <Link
          href={user ? `/erp/${user.role}/dashboard` : '/auth/login'}
          className="flex flex-col items-center justify-center text-slate-300 hover:text-white py-1 px-2"
        >
          <UserCheck className="w-4 h-4 text-blue-400 mb-0.5" />
          <span className="text-[10px] font-semibold">ERP Portal</span>
        </Link>
      </div>
    </>
  );
}
