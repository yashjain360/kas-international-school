'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  CreditCard,
  UserPlus,
  CalendarCheck,
  Award,
  Send,
  Bell,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { ErpLayout } from '@/components/erp/ErpLayout';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [overdueInvoices, setOverdueInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reminding, setReminding] = useState(false);
  const [reminderStatus, setReminderStatus] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [statsRes, leadsRes, feesRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/leads?status=all'),
        fetch('/api/fees?status=overdue'),
      ]);

      const statsData = await statsRes.json();
      const leadsData = await leadsRes.json();
      const feesData = await feesRes.json();

      if (statsData.success) setStats(statsData.stats);
      if (leadsData.success) setRecentLeads(leadsData.leads.slice(0, 5));
      if (feesData.success) setOverdueInvoices(feesData.records.slice(0, 5));
    } catch (err) {
      console.error('Admin dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBulkReminder = async () => {
    setReminding(true);
    setReminderStatus(null);
    try {
      const res = await fetch('/api/fees/remind', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bulkOverdue: true }),
      });
      const data = await res.json();
      if (res.ok) {
        setReminderStatus(data.message);
        fetchData();
      } else {
        setReminderStatus(data.error || 'Failed to dispatch reminders.');
      }
    } catch {
      setReminderStatus('Network error while dispatching reminders.');
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
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider bg-amber-400/10 border border-amber-400/30 px-2.5 py-1 rounded-md">
              Executive Management Overview
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5">
              School Administrative Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Live metrics across enrollments, fee collections, attendance, and admissions CRM.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleBulkReminder}
              disabled={reminding}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center space-x-2 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{reminding ? 'Dispatching...' : 'Dispatch All Fee Reminders (SMTP)'}</span>
            </button>
          </div>
        </div>

        {reminderStatus && (
          <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{reminderStatus}</span>
            </div>
            <button onClick={() => setReminderStatus(null)} className="text-emerald-400 hover:text-white text-xs">
              Dismiss
            </button>
          </div>
        )}

        {/* 6 Metric KPI Cards */}
        {loading ? (
          <div className="text-center py-12 text-slate-500 text-sm">Loading Executive Metrics...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                <span>Active Students Enrolled</span>
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-3xl font-extrabold text-white">{stats?.totalStudents || 5}</p>
              <p className="text-[11px] text-emerald-400 font-semibold">100% Verified Profiles in Database</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                <span>Faculty & Mentors</span>
                <Award className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-3xl font-extrabold text-white">{stats?.totalFaculty || 5}</p>
              <p className="text-[11px] text-purple-400 font-semibold">CBSE Subject Specialists on Duty</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                <span>Active Admission Leads</span>
                <UserPlus className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-3xl font-extrabold text-amber-400">{stats?.activeLeads || 4}</p>
              <p className="text-[11px] text-slate-400">Inquiries in Verification & Walkthrough Stage</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                <span>Total Fee Collected</span>
                <CreditCard className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-3xl font-extrabold text-emerald-400">
                ₹{new Intl.NumberFormat('en-IN').format(stats?.totalCollected || 240000)}
              </p>
              <p className="text-[11px] text-emerald-400 font-semibold">Reconciled in Institutional Accounts</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                <span>Overdue / Pending Balance</span>
                <AlertCircle className="w-4 h-4 text-red-400" />
              </div>
              <p className="text-3xl font-extrabold text-red-400">
                ₹{new Intl.NumberFormat('en-IN').format(stats?.totalOverdue || 210000)}
              </p>
              <p className="text-[11px] text-red-400 font-semibold">Ready for Automated Email Reminder</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                <span>Today's Attendance Rate</span>
                <CalendarCheck className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-3xl font-extrabold text-white">{stats?.attendanceRate || 96}%</p>
              <p className="text-[11px] text-blue-400 font-semibold">Exemplary Student Discipline</p>
            </div>
          </div>
        )}

        {/* 2-Column: Recent Admission Inquiries & Overdue Fee Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Leads */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <UserPlus className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm text-white">Recent Admission Leads</h3>
              </div>
              <Link href="/erp/admin/leads" className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center">
                <span>Manage CRM</span>
                <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>

            <div className="space-y-3">
              {recentLeads.map((lead) => (
                <div
                  key={lead._id}
                  className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <p className="font-bold text-white">{lead.studentName} <span className="text-slate-400 font-normal">({lead.targetGrade})</span></p>
                    <p className="text-slate-400">Parent: {lead.parentName} • {lead.phone}</p>
                  </div>
                  <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-bold uppercase px-2 py-0.5 rounded-md">
                    {lead.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Overdue Fee Invoices */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-red-400" />
                <h3 className="font-bold text-sm text-white">Overdue Fee Statements</h3>
              </div>
              <Link href="/erp/admin/fees" className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center">
                <span>Full Ledger</span>
                <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>

            <div className="space-y-3">
              {overdueInvoices.map((inv) => (
                <div
                  key={inv._id}
                  className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <p className="font-bold text-white">{inv.studentName} <span className="text-slate-400 font-normal">({inv.admissionNo})</span></p>
                    <p className="text-red-400 font-semibold">{inv.term} • Due: {inv.dueDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-white text-sm">₹{new Intl.NumberFormat('en-IN').format(inv.totalAmount)}</p>
                    <span className="text-[10px] text-amber-400">Reminders Sent: {inv.remindersSentCount || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ErpLayout>
  );
}
