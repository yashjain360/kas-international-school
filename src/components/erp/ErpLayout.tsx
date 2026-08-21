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
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-400 text-sm">
        Authenticating ERP Session...
      </div>
    );
  }

  // Admin Navigation Links
  const adminLinks = [
    { name: 'Executive Dashboard', href: '/erp/admin/dashboard', icon: LayoutDashboard },
    { name: 'Admissions & Leads CRM', href: '/erp/admin/leads', icon: UserPlus },
    { name: 'Fee Ledger & Reminders', href: '/erp/admin/fees', icon: CreditCard },
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
    admin: 'bg-purple-100 text-purple-900 border-purple-300',
    faculty: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    student: 'bg-blue-100 text-blue-900 border-blue-300',
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
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
            className="w-full flex items-center space-x-2 text-xs text-red-400 hover:text-red-300 px-3 py-2 rounded-lg hover:bg-red-500/10 transition-colors font-semibold"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of ERP</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950">
        {/* Topbar */}
        <header className="h-16 bg-[#0F2942]/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-slate-300 hover:bg-slate-800"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <span className="text-xs text-amber-400 font-semibold hidden sm:inline">
              K.A.S. International School • ERP Active Session
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-white">{user.name}</p>
              <p className="text-[10px] text-slate-400">{user.email}</p>
            </div>
            <button
              onClick={logout}
              className="md:hidden text-xs text-red-400 hover:text-red-300 font-bold p-2"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="md:hidden bg-[#0A1D30] border-b border-slate-800 p-4 space-y-2">
            {currentLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-semibold ${
                    pathname === link.href ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
            <div className="pt-3 border-t border-slate-800 flex justify-between">
              <Link href="/" className="text-xs text-slate-400">Public Portal</Link>
              <button onClick={logout} className="text-xs text-red-400 font-bold">Sign Out</button>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
