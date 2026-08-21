'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  CreditCard,
  CalendarCheck,
  Award,
  Clock,
  Bell,
  ArrowRight,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { ErpLayout } from '@/components/erp/ErpLayout';
import { useAuth } from '@/context/AuthContext';

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const [feeInvoices, setFeeInvoices] = useState<any[]>([]);
  const [attendanceStats, setAttendanceStats] = useState<any>(null);
  const [latestReport, setLatestReport] = useState<any>(null);
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/fees').then((r) => r.json()),
      fetch('/api/attendance').then((r) => r.json()),
      fetch('/api/grades').then((r) => r.json()),
      fetch('/api/notices?audience=students').then((r) => r.json()),
    ])
      .then(([feesData, attData, gradeData, noticesData]) => {
        if (feesData.records) setFeeInvoices(feesData.records);
        if (attData.stats) setAttendanceStats(attData.stats);
        if (gradeData.records && gradeData.records.length > 0) setLatestReport(gradeData.records[0]);
        if (noticesData.notices) setNotices(noticesData.notices.slice(0, 3));
      })
      .catch((err) => console.error('Student dashboard error:', err))
      .finally(() => setLoading(false));
  }, []);

  const pendingFee = feeInvoices.find((f) => f.status === 'overdue' || f.status === 'pending');

  return (
    <ErpLayout requiredRole="student">
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider bg-blue-400/10 border border-blue-400/30 px-2.5 py-1 rounded-md">
              Student & Parent Scholar Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5">
              Welcome, {user?.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Admission No: <strong className="text-amber-400 font-mono">{user?.admissionNo || 'KAS2026-1001'}</strong> • {user?.grade}-{user?.section}
            </p>
          </div>

          <Link
            href="/erp/student/report-card"
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center space-x-2 self-start"
          >
            <Award className="w-4 h-4" />
            <span>View Digital Report Card</span>
          </Link>
        </div>

        {/* Pending Fee Alert if applicable */}
        {pendingFee && (
          <div className="p-4 rounded-2xl bg-amber-950/70 border border-amber-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center space-x-3">
              <CreditCard className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <p className="text-xs font-bold text-amber-200">
                  Upcoming Term Fee Due: {pendingFee.term} (₹{new Intl.NumberFormat('en-IN').format(pendingFee.totalAmount)})
                </p>
                <p className="text-[11px] text-amber-400/80">
                  Payment Due Date: {pendingFee.dueDate}. Settle balance via online portal or Bursar desk.
                </p>
              </div>
            </div>
            <Link
              href="/erp/student/fees"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 self-start sm:self-auto"
            >
              Pay / View Invoice &rarr;
            </Link>
          </div>
        )}

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
              <span>Attendance Rate</span>
              <CalendarCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-3xl font-extrabold text-white">
              {attendanceStats?.percentage || 95}%
            </p>
            <p className="text-[11px] text-emerald-400 font-semibold">
              {attendanceStats?.presentDays || 13} Days Present of {attendanceStats?.totalDays || 14} Recorded
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
              <span>Term Academic GPA</span>
              <Award className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-3xl font-extrabold text-amber-400">
              {latestReport?.overallGrade || 'A1'} ({latestReport?.percentage || 92.0}%)
            </p>
            <p className="text-[11px] text-slate-400">
              Class Standing Rank: #{latestReport?.rankInClass || 2}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
              <span>Fee Invoices Status</span>
              <CreditCard className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-3xl font-extrabold text-white">
              {feeInvoices.filter((f) => f.status === 'paid').length} Paid
            </p>
            <p className="text-[11px] text-blue-400 font-semibold">
              {feeInvoices.length} Total Statement Records
            </p>
          </div>
        </div>

        {/* 2-Column: Quick Access & Recent Notices */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Quick Access */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-4">
            <h3 className="font-bold text-base text-white">Student Scholastic Portals</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/erp/student/fees"
                className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:bg-slate-800 hover:border-amber-400/40 transition-all space-y-1 group"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold mb-2">
                  <CreditCard className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-white group-hover:text-amber-400">Fee Ledger & Receipts</h4>
                <p className="text-[11px] text-slate-400">Download digital payment vouchers & invoices</p>
              </Link>

              <Link
                href="/erp/student/attendance"
                className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:bg-slate-800 hover:border-emerald-400/40 transition-all space-y-1 group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold mb-2">
                  <CalendarCheck className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-white group-hover:text-emerald-400">Monthly Attendance</h4>
                <p className="text-[11px] text-slate-400">View daily presence, leave slips, and trends</p>
              </Link>

              <Link
                href="/erp/student/report-card"
                className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:bg-slate-800 hover:border-blue-400/40 transition-all space-y-1 group"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold mb-2">
                  <Award className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-white group-hover:text-blue-400">Digital Report Card</h4>
                <p className="text-[11px] text-slate-400">Cumulative marks, teacher remarks & GPA</p>
              </Link>

              <Link
                href="/erp/student/timetable"
                className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:bg-slate-800 hover:border-purple-400/40 transition-all space-y-1 group"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold mb-2">
                  <Clock className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-white group-hover:text-purple-400">Class Timetable</h4>
                <p className="text-[11px] text-slate-400">Daily period routine & lab allocations</p>
              </Link>
            </div>
          </div>

          {/* Recent Circulars */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white flex items-center">
                <Bell className="w-4 h-4 mr-2 text-amber-400" />
                Student Circulars & Notices
              </h3>
              <Link href="/notices" className="text-xs text-amber-400 hover:text-amber-300 font-semibold">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {notices.map((n) => (
                <div key={n._id} className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-1 text-xs">
                  <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span className="bg-blue-500/20 text-blue-300 font-bold uppercase px-2 py-0.5 rounded-md">
                      {n.category}
                    </span>
                    <span>{n.publishedDate}</span>
                  </div>
                  <h4 className="font-bold text-white text-xs">{n.title}</h4>
                  <p className="text-slate-400 truncate">{n.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ErpLayout>
  );
}
