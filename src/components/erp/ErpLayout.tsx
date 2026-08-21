'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  CreditCard,
  Send,
  UserPlus,
  CalendarCheck,
  Award,
  Bell,
  Clock,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
  School,
  FileSpreadsheet,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function ErpLayout({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'faculty' | 'student';
}) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/login');
      } else if (requiredRole && user.role !== requiredRole) {
        // Redirect to their own dashboard
        router.push(`/erp/${user.role}/dashboard`);
      }
    }
  }, [user, loading, requiredRole, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400 text-sm">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-semibold text-xs text-amber-400">Authenticating ERP Session...</p>
        </div>
      </div>
    );
  }

  // Admin Navigation Links
  const adminLinks = [
    { name: 'Executive Dashboard', href: '/erp/admin/dashboard', icon: LayoutDashboard },
    { name: 'Admissions & Leads CRM', href: '/erp/admin/leads', icon: UserPlus },
    { name: 'Fee Ledger & Reminders', href: '/erp/admin/fees', icon: CreditCard },
    { name: 'Assessment & Report Cards', href: '/erp/admin/academics', icon: Award },
    { name: 'Master Class Timetable', href: '/erp/admin/timetable', icon: Clock },
    { name: 'Email Broadcast Center', href: '/erp/admin/broadcasts', icon: Send },
    { name: 'Student Roster', href: '/erp/admin/students', icon: Users },
    { name: 'Faculty Directory', href: '/erp/admin/faculty', icon: School },
    { name: 'Circulars & Notices', href: '/erp/admin/notices', icon: Bell },
  ];

  // Faculty Navigation Links
  const facultyLinks = [
    { name: 'Faculty Dashboard', href: '/erp/faculty/dashboard', icon: LayoutDashboard },
    { name: 'Mark Daily Attendance', href: '/erp/faculty/attendance', icon: CalendarCheck },
    { name: 'Academic Gradebook', href: '/erp/faculty/gradebook', icon: Award },
    { name: 'Class Timetable', href: '/erp/faculty/timetable', icon: Clock },
  ];

  // Student Navigation Links
  const studentLinks = [
    { name: 'Student Dashboard', href: '/erp/student/dashboard', icon: LayoutDashboard },
    { name: 'My Fee Invoices & Receipts', href: '/erp/student/fees', icon: CreditCard },
    { name: 'Attendance Record', href: '/erp/student/attendance', icon: CalendarCheck },
    { name: 'Digital Report Card', href: '/erp/student/report-card', icon: Award },
    { name: 'Class Timetable', href: '/erp/student/timetable', icon: Clock },
  ];

  const currentLinks =
    user.role === 'admin'
      ? adminLinks
      : user.role === 'faculty'
      ? facultyLinks
      : studentLinks;

  const roleColors = {
    admin: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    faculty: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    student: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  };

  // Mobile Bottom Quick Navigation
  const mobileBottomItems =
    user.role === 'admin'
      ? [
          { name: 'Overview', href: '/erp/admin/dashboard', icon: LayoutDashboard },
          { name: 'Leads', href: '/erp/admin/leads', icon: UserPlus },
          { name: 'Fees', href: '/erp/admin/fees', icon: CreditCard },
          { name: 'Academics', href: '/erp/admin/academics', icon: Award },
          { name: 'Menu', action: () => setMobileOpen(true), icon: Menu },
        ]
      : user.role === 'faculty'
      ? [
          { name: 'Overview', href: '/erp/faculty/dashboard', icon: LayoutDashboard },
          { name: 'Attendance', href: '/erp/faculty/attendance', icon: CalendarCheck },
          { name: 'Gradebook', href: '/erp/faculty/gradebook', icon: Award },
          { name: 'Routine', href: '/erp/faculty/timetable', icon: Clock },
          { name: 'Menu', action: () => setMobileOpen(true), icon: Menu },
        ]
      : [
          { name: 'Overview', href: '/erp/student/dashboard', icon: LayoutDashboard },
          { name: 'Fees', href: '/erp/student/fees', icon: CreditCard },
          { name: 'Attendance', href: '/erp/student/attendance', icon: CalendarCheck },
          { name: 'Report Card', href: '/erp/student/report-card', icon: Award },
          { name: 'Menu', action: () => setMobileOpen(true), icon: Menu },
        ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0A1D30] border-r border-slate-800 shrink-0">
        {/* Brand */}
        <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-md">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight text-white">K.A.S. ERP</h1>
            <p className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">Management System</p>
          </div>
        </div>

        {/* User Card */}
        <div className="p-4 mx-3 my-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center space-x-3">
          <img
            src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
            alt={user.name}
            className="w-10 h-10 rounded-lg object-cover border border-slate-700"
          />
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">{user.name}</p>
            <span
              className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border mt-0.5 ${
                roleColors[user.role]
              }`}
            >
              {user.role}
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto">
          {currentLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            className="flex items-center space-x-2 text-xs text-slate-400 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800/60 transition-colors"
          >
            <School className="w-4 h-4" />
            <span>Public School Portal</span>
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center space-x-2 text-xs text-red-400 hover:text-red-300 px-3 py-2 rounded-lg hover:bg-red-500/10 transition-colors font-semibold cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of ERP</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950">
        {/* Topbar */}
        <header className="h-16 bg-[#0F2942]/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-300 hover:bg-slate-800 border border-slate-700"
              aria-label="Open Navigation Drawer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs text-amber-400 font-bold tracking-wide">
                K.A.S. ERP <span className="hidden sm:inline">• Active Session</span>
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-white">{user.name}</p>
              <p className="text-[10px] text-slate-400">{user.email}</p>
            </div>
            <span
              className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-md border ${
                roleColors[user.role]
              }`}
            >
              {user.role}
            </span>
            <button
              onClick={logout}
              className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 font-bold transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-3.5 sm:p-8 pb-24 md:pb-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A1D30]/95 backdrop-blur-md border-t border-slate-800 py-1.5 px-2 flex items-center justify-around shadow-2xl safe-area-bottom">
          {mobileBottomItems.map((item: any, idx: number) => {
            const Icon = item.icon;
            const isActive = item.href && pathname === item.href;

            if (item.action) {
              return (
                <button
                  key={idx}
                  onClick={item.action}
                  className="flex flex-col items-center justify-center text-slate-400 hover:text-amber-400 py-1 px-2.5 cursor-pointer"
                >
                  <Icon className="w-4 h-4 mb-0.5 text-slate-300" />
                  <span className="text-[10px] font-semibold">{item.name}</span>
                </button>
              );
            }

            return (
              <Link
                key={idx}
                href={item.href}
                className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors ${
                  isActive ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span className="text-[10px]">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Full Mobile Side Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer Body */}
          <div className="relative mr-auto w-[85%] max-w-xs bg-[#0A1D30] h-full shadow-2xl flex flex-col justify-between overflow-y-auto z-10 animate-in slide-in-from-left duration-300 border-r border-slate-800">
            {/* Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-bold shadow-md">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">K.A.S. ERP</h3>
                  <p className="text-[10px] text-amber-400 font-semibold uppercase">Management Portal</p>
                </div>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Bio Card */}
            <div className="p-4 mx-3 my-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center space-x-3">
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                alt={user.name}
                className="w-10 h-10 rounded-lg object-cover border border-slate-700"
              />
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">{user.name}</p>
                <span
                  className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border mt-0.5 ${
                    roleColors[user.role]
                  }`}
                >
                  {user.role}
                </span>
              </div>
            </div>

            {/* Links List */}
            <div className="px-3 space-y-1.5 overflow-y-auto flex-1">
              {currentLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800 space-y-2 bg-[#061422]">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center space-x-2 text-xs text-slate-400 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <School className="w-4 h-4" />
                <span>Public School Website</span>
              </Link>
              <button
                onClick={logout}
                className="w-full flex items-center space-x-2 text-xs text-red-400 hover:text-red-300 px-3 py-2 rounded-lg hover:bg-red-500/10 transition-colors font-semibold cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
