'use client';

import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { ErpLayout } from '@/components/erp/ErpLayout';

export default function StudentAttendancePage() {
  const [records, setRecords] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/attendance')
      .then((res) => res.json())
      .then((data) => {
        if (data.records) setRecords(data.records);
        if (data.stats) setStats(data.stats);
      })
      .catch((err) => console.error('Student attendance error:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ErpLayout requiredRole="student">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">My Attendance Calendar & Records</h1>
            <p className="text-xs text-slate-400">
              Official day-by-day presence log, tardiness records, and cumulative attendance percentage.
            </p>
          </div>
        </div>

        {/* Stats Row */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Overall Attendance</span>
              <p className="text-2xl font-extrabold text-emerald-400">{stats.percentage}%</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Working Days Recorded</span>
              <p className="text-2xl font-extrabold text-white">{stats.totalDays}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Days Present</span>
              <p className="text-2xl font-extrabold text-emerald-400">{stats.presentDays}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Days Absent</span>
              <p className="text-2xl font-extrabold text-red-400">{stats.absentDays}</p>
            </div>
          </div>
        )}

        {/* Day-by-Day Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="text-center py-16 text-slate-500 text-sm">Loading Attendance Records...</div>
          ) : records.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-sm">No attendance records found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-800/60 text-slate-400 font-bold uppercase">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Marked By</th>
                    <th className="py-3 px-4">Teacher Remark</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {records.map((r) => (
                    <tr key={r._id} className="hover:bg-slate-800/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-white flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-2 text-slate-400" />
                        {r.date}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-300">
                        {r.grade}-{r.section}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${
                            r.status === 'present'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : r.status === 'absent'
                              ? 'bg-red-500/20 text-red-300 border-red-500/30'
                              : r.status === 'late'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400">{r.markedBy}</td>
                      <td className="py-3 px-4 text-slate-400 italic">{r.remarks || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </ErpLayout>
  );
}
