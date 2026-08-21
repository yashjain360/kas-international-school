'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  GraduationCap,
  CreditCard,
  UserPlus,
  CalendarCheck,
  Bell,
  Mail,
  AlertTriangle,
  ArrowUpRight,
  Send,
  RefreshCw,
} from 'lucide-react';
import { ErpLayout } from '@/components/erp/ErpLayout';
import { MetricCardSkeleton } from '@/components/erp/Skeleton';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reminding, setReminding] = useState(false);
  const [reminderMessage, setReminderMessage] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      if (data.stats) setStats(data.stats);
    } catch (err) {
      console.error('Stats error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleTriggerFeeReminders = async () => {
    setReminding(true);
    setReminderMessage(null);
    try {
      const res = await fetch('/api/fees/remind', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'all_overdue' }),
      });
      const data = await res.json();
      if (res.ok) {
        setReminderMessage(data.message || 'Fee reminder emails successfully dispatched.');
      } else {
        setReminderMessage(data.error || 'Failed to dispatch reminders.');
      }
    } catch {
      setReminderMessage('Network error triggering reminders.');
    } finally {
      setReminding(false);
    }
  };

  return (
    <ErpLayout requiredRole="admin">
      <div className="space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Executive Control & KPIs</h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Real-time scholastic enrollments, daily attendance averages, CRM admissions, and fee ledger analytics.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={fetchStats}
              disabled={loading}
              className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
              title="Refresh Analytics"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleTriggerFeeReminders}
              disabled={reminding}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center space-x-2 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{reminding ? 'Dispatching SMTP...' : 'Trigger Bulk Fee Reminders'}</span>
            </button>
          </div>
        </div>

        {reminderMessage && (
          <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-200 text-xs flex items-center justify-between">
            <span>{reminderMessage}</span>
            <button onClick={() => setReminderMessage(null)} className="text-emerald-400 hover:text-white font-bold ml-4">
              Dismiss
            </button>
          </div>
        )}

        {/* 6 Key Performance Metric Cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <MetricCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                <span>Active Scholars</span>
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-3xl font-extrabold text-white">{stats?.totalStudents || 5}</p>
              <p className="text-[11px] text-blue-400 font-semibold">Pre-K through Class X Enrolled</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                <span>Faculty & Mentors</span>
                <GraduationCap className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-3xl font-extrabold text-white">{stats?.totalFaculty || 5}</p>
              <p className="text-[11px] text-amber-400 font-semibold">1:18 Teacher-Scholar Ratio</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                <span>Active CRM Leads</span>
                <UserPlus className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-3xl font-extrabold text-white">{stats?.activeLeads || 4}</p>
              <p className="text-[11px] text-purple-400 font-semibold">Inquiries In Pipeline</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                <span>Fee Collections</span>
                <CreditCard className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-3xl font-extrabold text-emerald-400">
                ₹{new Intl.NumberFormat('en-IN').format(stats?.totalCollected || 250000)}
              </p>
              <p className="text-[11px] text-emerald-500 font-semibold">Settled Term Invoices</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                <span>Overdue Balance</span>
                <AlertTriangle className="w-4 h-4 text-red-400" />
              </div>
              <p className="text-3xl font-extrabold text-red-400">
                ₹{new Intl.NumberFormat('en-IN').format(stats?.totalOverdue || 61000)}
              </p>
              <p className="text-[11px] text-red-400 font-semibold">Pending Automated Notice</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                <span>Average Attendance</span>
                <CalendarCheck className="w-4 h-4 text-teal-400" />
              </div>
              <p className="text-3xl font-extrabold text-white">{stats?.attendanceRate || 96}%</p>
              <p className="text-[11px] text-teal-400 font-semibold">Consistent Daily Presence</p>
            </div>
          </div>
        )}

        {/* Quick ERP Shortcuts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/erp/admin/leads"
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-400/40 transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between text-amber-400">
              <UserPlus className="w-6 h-6" />
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
            <h3 className="font-bold text-base text-white">Admissions CRM Pipeline</h3>
            <p className="text-xs text-slate-400">Review prospective parent inquiries, schedule tours, and track enrollment notes.</p>
          </Link>

          <Link
            href="/erp/admin/fees"
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-400/40 transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between text-blue-400">
              <CreditCard className="w-6 h-6" />
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
            <h3 className="font-bold text-base text-white">Fee Ledger & Automated Reminders</h3>
            <p className="text-xs text-slate-400">Create new installment invoices, verify UPI/cash payments, and trigger 1-click email reminders.</p>
          </Link>

          <Link
            href="/erp/admin/broadcasts"
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-400/40 transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between text-purple-400">
              <Mail className="w-6 h-6" />
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
            <h3 className="font-bold text-base text-white">Multi-Channel Email Broadcast</h3>
            <p className="text-xs text-slate-400">Send immediate circular announcements to all students, faculty, or leads via official SMTP.</p>
          </Link>
        </div>
      </div>
    </ErpLayout>
  );
}
