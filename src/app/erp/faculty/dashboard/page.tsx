'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CalendarCheck,
  Award,
  Clock,
  Users,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { ErpLayout } from '@/components/erp/ErpLayout';
import { useAuth } from '@/context/AuthContext';

export default function FacultyDashboardPage() {
  const { user } = useAuth();
  const [timetable, setTimetable] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/timetables?grade=Grade 10&section=A')
      .then((res) => res.json())
      .then((data) => {
        if (data.timetables && data.timetables.length > 0) {
          setTimetable(data.timetables[0].periods || []);
        }
      })
      .catch((err) => console.error('Timetable error:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ErpLayout requiredRole="faculty">
      <div className="space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider bg-emerald-400/10 border border-emerald-400/30 px-2.5 py-1 rounded-md">
              Academic Faculty Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5">
              Welcome, {user?.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              {user?.designation || 'Faculty Member'} • K.A.S. International School Bhopal
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/erp/faculty/attendance"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center space-x-2"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Mark Today's Attendance</span>
            </Link>
          </div>
        </div>

        {/* Quick Action Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Link
            href="/erp/faculty/attendance"
            className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3 hover:border-emerald-500/40 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white group-hover:text-emerald-400 transition-colors">
              Daily Class Attendance
            </h3>
            <p className="text-xs text-slate-400">
              Record daily presence, absences, and late entries for your assigned classes.
            </p>
          </Link>

          <Link
            href="/erp/faculty/gradebook"
            className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3 hover:border-amber-500/40 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white group-hover:text-amber-400 transition-colors">
              Scholastic Gradebook
            </h3>
            <p className="text-xs text-slate-400">
              Enter term assessment marks, subject GPAs, and qualitative student remarks.
            </p>
          </Link>

          <Link
            href="/erp/faculty/timetable"
            className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3 hover:border-blue-500/40 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white group-hover:text-blue-400 transition-colors">
              Academic Timetable
            </h3>
            <p className="text-xs text-slate-400">
              Check daily lecture periods, laboratory slots, and room allocations.
            </p>
          </Link>
        </div>

        {/* Today's Schedule Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-base text-white">Today's Class Schedule (Grade 10-A)</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">Monday Routine</span>
          </div>

          {loading ? (
            <div className="text-center py-8 text-slate-500 text-xs">Loading schedule...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {timetable.map((p, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1 text-xs">
                  <div className="flex items-center justify-between text-amber-400 font-mono font-bold text-[11px]">
                    <span>Period {p.periodNo}</span>
                    <span>{p.timeSlot}</span>
                  </div>
                  <h4 className="font-bold text-white text-sm">{p.subject}</h4>
                  <p className="text-slate-400">Teacher: {p.teacherName}</p>
                  <p className="text-[10px] text-slate-500">{p.roomNo}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ErpLayout>
  );
}
