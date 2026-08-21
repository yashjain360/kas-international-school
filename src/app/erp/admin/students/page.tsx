'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Plus,
  Filter,
  Phone,
  Mail,
  GraduationCap,
  Calendar,
  X,
  CheckCircle2,
} from 'lucide-react';
import { ErpLayout } from '@/components/erp/ErpLayout';

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [gradeFilter, setGradeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // New Student State
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    grade: 'Grade 10',
    section: 'A',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    address: 'Bhopal, Madhya Pradesh',
    bloodGroup: 'O+',
    gender: 'Male',
    busRoute: 'Route 4 - Regal Town',
  });

  const fetchStudents = async () => {
    try {
      const res = await fetch(`/api/students?grade=${gradeFilter}&search=${encodeURIComponent(searchTerm)}`);
      const data = await res.json();
      if (data.success) setStudents(data.students);
    } catch (err) {
      console.error('Students fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [gradeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStudents();
  };

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent),
      });
      const data = await res.json();

      if (res.ok) {
        setIsEnrollOpen(false);
        setMessage(data.message);
        setNewStudent({
          name: '',
          email: '',
          grade: 'Grade 10',
          section: 'A',
          parentName: '',
          parentPhone: '',
          parentEmail: '',
          address: 'Bhopal, Madhya Pradesh',
          bloodGroup: 'O+',
          gender: 'Male',
          busRoute: 'Route 4 - Regal Town',
        });
        fetchStudents();
      } else {
        setMessage(data.error || 'Failed to enroll student.');
      }
    } catch {
      setMessage('Failed to enroll student.');
    }
  };

  const grades = ['all', 'Grade 10', 'Grade 9', 'Grade 8', 'Grade 6', 'Grade 4'];

  return (
    <ErpLayout requiredRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Student Enrollment & Scholastic Registry</h1>
            <p className="text-xs text-slate-400">
              Active student directory, admission credentials, parent emergency contacts, and class allocations.
            </p>
          </div>

          <button
            onClick={() => setIsEnrollOpen(true)}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center space-x-2 self-start"
          >
            <Plus className="w-4 h-4" />
            <span>Enroll New Student</span>
          </button>
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

        {/* Filter Bar */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {grades.map((g) => (
              <button
                key={g}
                onClick={() => setGradeFilter(g)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  gradeFilter === g
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {g === 'all' ? 'All Grades' : g}
              </button>
            ))}
          </div>

          <form onSubmit={handleSearchSubmit} className="w-full md:w-72 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search name, admission no, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-hidden"
            />
          </form>
        </div>

        {/* Students Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="text-center py-16 text-slate-500 text-sm">Loading Student Roster...</div>
          ) : students.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-sm">No students found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-800/60 text-slate-400 font-bold uppercase">
                    <th className="py-3 px-4">Student & Admission No</th>
                    <th className="py-3 px-4">Grade & Section</th>
                    <th className="py-3 px-4">Parent / Guardian</th>
                    <th className="py-3 px-4">Contact Phone & Bus</th>
                    <th className="py-3 px-4">Blood & Gender</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {students.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-800/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={st.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                            alt={st.name}
                            className="w-9 h-9 rounded-lg object-cover border border-slate-700"
                          />
                          <div>
                            <p className="font-bold text-white text-sm">{st.name}</p>
                            <p className="text-[11px] text-amber-400 font-mono">{st.admissionNo}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-200">
                        {st.grade}-{st.section}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-white">{st.profile?.parentName || 'Guardian'}</p>
                        <p className="text-[10px] text-slate-400">{st.profile?.parentEmail || st.email}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-slate-300">{st.phone || st.profile?.parentPhone}</p>
                        <p className="text-[10px] text-slate-400">{st.profile?.busRoute || 'Self Transport'}</p>
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {st.profile?.bloodGroup || 'O+'} • {st.profile?.gender || 'Male'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase px-2 py-0.5 rounded-md">
                          Enrolled
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Enroll Student Modal */}
        {isEnrollOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-bold text-base text-white">Enroll New Student</h3>
                <button onClick={() => setIsEnrollOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEnroll} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Student Full Name *</label>
                    <input
                      type="text"
                      required
                      value={newStudent.name}
                      onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Student Email *</label>
                    <input
                      type="email"
                      required
                      value={newStudent.email}
                      onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Grade Allocation *</label>
                    <select
                      value={newStudent.grade}
                      onChange={(e) => setNewStudent({ ...newStudent, grade: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                    >
                      <option value="Grade 10">Grade 10</option>
                      <option value="Grade 9">Grade 9</option>
                      <option value="Grade 8">Grade 8</option>
                      <option value="Grade 6">Grade 6</option>
                      <option value="Grade 4">Grade 4</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Section *</label>
                    <select
                      value={newStudent.section}
                      onChange={(e) => setNewStudent({ ...newStudent, section: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                    >
                      <option value="A">Section A</option>
                      <option value="B">Section B</option>
                      <option value="C">Section C</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Parent Name *</label>
                    <input
                      type="text"
                      required
                      value={newStudent.parentName}
                      onChange={(e) => setNewStudent({ ...newStudent, parentName: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Parent Phone *</label>
                    <input
                      type="tel"
                      required
                      value={newStudent.parentPhone}
                      onChange={(e) => setNewStudent({ ...newStudent, parentPhone: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsEnrollOpen(false)}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold shadow-md"
                  >
                    Complete Enrollment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ErpLayout>
  );
}
