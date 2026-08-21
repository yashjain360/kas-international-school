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
  Award,
  BookOpen,
  Calendar,
  Layers,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  const isErpPage = pathname?.startsWith('/erp');
  if (isErpPage) return null; // ERP uses its own sidebar layout

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About School', href: '/about' },
    { name: 'Academics', href: '/academics' },
    { name: 'Admissions 2026-27', href: '/admissions', highlight: true },
    { name: 'Fee Schedule', href: '/fee-structure' },
    { name: 'Faculty & Mentors', href: '/faculty' },
    { name: 'Campus Life', href: '/gallery' },
    { name: 'Circulars & Notices', href: '/notices' },
    { name: 'Contact & Campus Map', href: '/contact' },
  ];

  return (
    <header className="w-full sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-xs transition-all">
      {/* Top Emergency & Info Banner */}
      <div className="bg-[#0F2942] text-slate-200 text-xs py-2 px-4 sm:px-8 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-6">
            <span className="flex items-center text-amber-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse mr-2"></span>
              Admissions Open for Session 2026–27 (Pre-Primary to Grade 10)
            </span>
            <span className="hidden md:flex items-center text-slate-300">
              <MapPin className="w-3.5 h-3.5 mr-1 text-amber-400" />
              Khajuri Kalan Rd, Regal Town, BHEL Bhopal
            </span>
          </div>
          <div className="flex items-center space-x-5">
            <a href="tel:+919425992209" className="hover:text-amber-400 flex items-center transition-colors">
              <Phone className="w-3.5 h-3.5 mr-1" />
              +91 94259 92209
            </a>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <a href="mailto:info@thewebvale.com" className="hover:text-amber-400 flex items-center transition-colors">
              <Mail className="w-3.5 h-3.5 mr-1" />
              admissions@kasinternationalschool.org
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#0F2942] to-[#1E3A8A] flex items-center justify-center text-amber-400 shadow-md group-hover:scale-105 transition-transform">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-xl tracking-tight text-[#0F2942]">K.A.S.</span>
              <span className="font-bold text-xl tracking-tight text-blue-900">INTERNATIONAL</span>
              <span className="text-amber-600 font-bold text-xs bg-amber-100 px-2 py-0.5 rounded-full uppercase tracking-wider">Bhopal</span>
            </div>
            <p className="text-[11px] font-semibold text-slate-500 tracking-wider uppercase">
              Holistic Excellence • CBSE Aligned Curriculum
            </p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-[13.5px] font-medium transition-all ${
                  link.highlight
                    ? 'text-amber-700 bg-amber-50 hover:bg-amber-100 font-semibold border border-amber-200'
                    : isActive
                    ? 'text-blue-900 bg-blue-50 font-semibold'
                    : 'text-slate-700 hover:text-blue-900 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* ERP Login Button */}
        <div className="hidden md:flex items-center space-x-3">
          {user ? (
            <Link
              href={
                user.role === 'admin'
                  ? '/erp/admin/dashboard'
                  : user.role === 'faculty'
                  ? '/erp/faculty/dashboard'
                  : '/erp/student/dashboard'
              }
              className="flex items-center space-x-2 bg-[#0F2942] hover:bg-blue-900 text-amber-400 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all"
            >
              <UserCheck className="w-4 h-4" />
              <span>ERP Portal ({user.role})</span>
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="flex items-center space-x-2 bg-[#0F2942] hover:bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all"
            >
              <UserCheck className="w-4 h-4 text-amber-400" />
              <span>School ERP Login</span>
            </Link>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
          aria-label="Toggle Navigation"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                link.highlight
                  ? 'text-amber-800 bg-amber-50 font-bold'
                  : pathname === link.href
                  ? 'text-blue-900 bg-blue-50 font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-slate-100">
            <Link
              href={user ? `/erp/${user.role}/dashboard` : '/auth/login'}
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center space-x-2 bg-[#0F2942] text-white py-2.5 rounded-lg font-semibold"
            >
              <UserCheck className="w-4 h-4 text-amber-400" />
              <span>{user ? `Go to ${user.role.toUpperCase()} ERP` : 'School ERP Login'}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
