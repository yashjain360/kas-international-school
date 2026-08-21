'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  const isErpPage = pathname?.startsWith('/erp');
  if (isErpPage) return null; // ERP uses its dedicated executive sidebar

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Academics', href: '/academics' },
    { name: 'Admissions', href: '/admissions', highlight: true },
    { name: 'Fee Structure', href: '/fee-structure' },
    { name: 'Faculty', href: '/faculty' },
    { name: 'Campus Life', href: '/gallery' },
    { name: 'Notices', href: '/notices' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="w-full sticky top-0 z-50 bg-white/98 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      {/* Top Notification & Secretariat Bar */}
      <div className="bg-[#0A1D30] text-slate-200 text-xs py-2 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Left: Admissions & Campus Location */}
          <div className="flex items-center space-x-4 lg:space-x-6 text-[11px] sm:text-xs">
            <span className="flex items-center text-amber-400 font-semibold whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse mr-2"></span>
              Admissions Open 2026–27 (Pre-Primary to Grade 10)
            </span>
            <span className="hidden lg:flex items-center text-slate-300 whitespace-nowrap">
              <MapPin className="w-3.5 h-3.5 mr-1 text-amber-400 shrink-0" />
              Khajuri Kalan Rd, Regal Town, BHEL Bhopal
            </span>
          </div>

          {/* Right: Helpline & Admissions Email */}
          <div className="flex items-center space-x-4 text-[11px] sm:text-xs whitespace-nowrap">
            <a
              href="tel:+919425992209"
              className="hover:text-amber-400 flex items-center transition-colors font-medium text-slate-200"
            >
              <Phone className="w-3.5 h-3.5 mr-1.5 text-amber-400 shrink-0" />
              +91 94259 92209
            </a>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <a
              href="mailto:admissions@kasinternationalschool.org"
              className="hover:text-amber-400 hidden sm:flex items-center transition-colors font-medium text-slate-200"
            >
              <Mail className="w-3.5 h-3.5 mr-1.5 text-amber-400 shrink-0" />
              admissions@kasinternationalschool.org
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-2 lg:gap-4">
          {/* Brand Logo & Title */}
          <Link href="/" className="flex items-center space-x-3 group shrink-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-linear-to-br from-[#0F2942] to-[#1E3A8A] flex items-center justify-center text-amber-400 shadow-md group-hover:scale-105 transition-transform shrink-0">
              <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-[#0F2942] whitespace-nowrap">
                  K.A.S.
                </span>
                <span className="font-bold text-lg sm:text-xl tracking-tight text-blue-900 whitespace-nowrap">
                  INTERNATIONAL
                </span>
                <span className="hidden sm:inline-block text-amber-600 font-extrabold text-[10px] bg-amber-100/90 border border-amber-200 px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap">
                  Bhopal
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 tracking-wide uppercase truncate hidden sm:block">
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors shrink-0"
            aria-label="Toggle Navigation"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-1.5 shadow-xl animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  link.highlight
                    ? 'text-amber-900 bg-amber-500/10 font-bold border border-amber-300/60'
                    : isActive
                    ? 'text-blue-950 bg-blue-50 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{link.name}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            );
          })}

          <div className="pt-4 border-t border-slate-100">
            <Link
              href={user ? `/erp/${user.role}/dashboard` : '/auth/login'}
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center space-x-2 bg-[#0F2942] text-white py-3 rounded-xl font-bold shadow-md text-sm"
            >
              <UserCheck className="w-4 h-4 text-amber-400" />
              <span>{user ? `Go to ${user.role.toUpperCase()} ERP Dashboard` : 'School ERP Login'}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
