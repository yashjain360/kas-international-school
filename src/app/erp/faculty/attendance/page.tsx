'use client';

import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Calendar,
  Save,
  CheckCircle2,
  AlertCircle,
  Users,
  Check,
  X,
  Clock,
} from 'lucide-react';
import { ErpLayout } from '@/components/erp/ErpLayout';
import { TableRowSkeleton } from '@/components/erp/Skeleton';
import { Pagination } from '@/components/erp/Pagination';

export default function FacultyAttendancePage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedGrade, setSelectedGrade] = useState('Grade 10');
  const [selectedSection, setSelectedSection] = useState('A');
  const [roster, setRoster] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const fetchRoster = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/attendance?date=${selectedDate}&grade=${encodeURIComponent(selectedGrade)}&section=${selectedSection}`
      );
      const data = await res.json();
      if (data.success) {
        setRoster(data.roster || []);
      }
    } catch (err) {
      console.error('Fetch attendance error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchRoster();
  }, [selectedDate, selectedGrade, selectedSection]);

  const handleStatusChange = (studentId: string, newStatus: string) => {
    const updated = roster.map((r) =>
      r.studentId === studentId ? { ...r, status: newStatus } : r
    );
    setRoster(updated);
  };

  const handleRemarksChange = (studentId: string, remark: string) => {
    const updated = roster.map((r) =>
      r.studentId === studentId ? { ...r, remarks: remark } : r
    );
    setRoster(updated);
  };

  const handleMarkAllPresent = () => {
    const updated = roster.map((r) => ({ ...r, status: 'present' }));
    setRoster(updated);
  };

  const handleSaveAttendance = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate,
          grade: selectedGrade,
          section: selectedSection,
          entries: roster,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || 'Attendance saved successfully.');
      } else {
        setMessage(data.error || 'Failed to save attendance.');
      }
    } catch {
      setMessage('Failed to save attendance.');
    } finally {
      setSaving(false);
    }
  };

  const paginatedRoster = roster.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <ErpLayout requiredRole="faculty">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Daily Class Attendance Tracker</h1>
            <p className="text-xs text-slate-400">
              Mark student presence, tardiness, and verified medical leaves for institutional records.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleMarkAllPresent}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Mark All Present
            </button>
            <button
              onClick={handleSaveAttendance}
              disabled={saving}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Recording...' : 'Save & Submit Attendance'}</span>
            </button>
          </div>
        </div>

        {message && (
          <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-200 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{message}</span>
            </div>
            <button onClick={() => setMessage(null)} className="text-emerald-400 hover:text-white">
              Dismiss
            </button>
          </div>
        )}

        {/* Filter Controls */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center gap-4 text-xs">
          <div>
            <label className="block text-slate-400 font-bold mb-1">Attendance Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-medium focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1">Grade</label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-medium cursor-pointer"
            >
              <option value="Grade 10">Grade 10</option>
              <option value="Grade 9">Grade 9</option>
              <option value="Grade 8">Grade 8</option>
              <option value="Grade 6">Grade 6</option>
              <option value="Grade 4">Grade 4</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1">Section</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-medium cursor-pointer"
            >
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>
          </div>
        </div>

        {/* Attendance Roster Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-800/60 text-slate-400 font-bold uppercase">
                  <th className="py-3 px-4">Student & Admission No</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Attendance Status</th>
                  <th className="py-3 px-4">Teacher Remark / Note</th>
                </tr>
              </thead>
              {loading ? (
                <TableRowSkeleton cols={4} rows={5} />
              ) : roster.length === 0 ? (
                <tbody>
                  <tr>
                    <td colSpan={4} className="text-center py-16 text-slate-500 text-sm">
                      No students enrolled in {selectedGrade}-{selectedSection}.
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {paginatedRoster.map((st) => (
                    <tr key={st.studentId} className="hover:bg-slate-800/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-white text-sm">{st.name}</p>
                        <p className="text-[10px] text-amber-400 font-mono">{st.admissionNo}</p>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-300">
                        {st.grade}-{st.section}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-2">
                          {(['present', 'absent', 'late', 'excused'] as const).map((status) => (
                            <button
                              key={status}
                              type="button"
                              onClick={() => handleStatusChange(st.studentId, status)}
                              className={`px-2.5 py-1 rounded-md font-bold uppercase text-[10px] border transition-all cursor-pointer ${
                                st.status === status
                                  ? status === 'present'
                                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-xs'
                                    : status === 'absent'
                                    ? 'bg-red-500 text-white border-red-400 shadow-xs'
                                    : status === 'late'
                                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                                    : 'bg-purple-500 text-white border-purple-400 shadow-xs'
                                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                              }`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <input
                          type="text"
                          placeholder="e.g. Medical leave slip provided"
                          value={st.remarks || ''}
                          onChange={(e) => handleRemarksChange(st.studentId, e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 rounded-md bg-slate-800 border border-slate-700 text-white focus:outline-hidden"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>

          {/* Pagination Controls */}
          {!loading && roster.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalItems={roster.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
    </ErpLayout>
  );
}
