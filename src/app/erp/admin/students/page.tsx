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
  Edit2,
  Trash2,
  ShieldAlert,
  MapPin,
  Bus,
  KeyRound,
  UserCheck,
} from 'lucide-react';
import { ErpLayout } from '@/components/erp/ErpLayout';
import { TableRowSkeleton } from '@/components/erp/Skeleton';
import { Pagination } from '@/components/erp/Pagination';

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [gradeFilter, setGradeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Modal States
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // New Student Form State
  const initialNewStudent = {
    name: '',
    email: '',
    phone: '',
    grade: 'Grade 10',
    section: 'A',
    customAdmissionNo: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    address: 'Regal Town, BHEL Bhopal',
    dob: '2011-05-15',
    bloodGroup: 'O+',
    gender: 'Male',
    busRoute: 'Route 4 - Regal Town / BHEL',
    rollNo: '',
    initialPassword: 'KasStudent@2026',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  };
  const [newStudent, setNewStudent] = useState(initialNewStudent);

  // Edit Student Form State
  const [editStudent, setEditStudent] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    grade: '',
    section: '',
    admissionNo: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    address: '',
    dob: '',
    bloodGroup: '',
    gender: '',
    busRoute: '',
    rollNo: '',
    newPassword: '',
    avatar: '',
  });

  const fetchStudents = async () => {
    setLoading(true);
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
    setCurrentPage(1);
    fetchStudents();
  }, [gradeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchStudents();
  };

  // Create Student
  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent),
      });
      const data = await res.json();

      if (res.ok) {
        setIsEnrollOpen(false);
        setMessage({ type: 'success', text: data.message });
        setNewStudent(initialNewStudent);
        fetchStudents();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to enroll student.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to enroll student.' });
    } finally {
      setSubmitting(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (st: any) => {
    setSelectedStudent(st);
    setEditStudent({
      id: st.id,
      name: st.name || '',
      email: st.email || '',
      phone: st.phone || st.profile?.parentPhone || '',
      grade: st.grade || 'Grade 10',
      section: st.section || 'A',
      admissionNo: st.admissionNo || '',
      parentName: st.profile?.parentName || '',
      parentPhone: st.profile?.parentPhone || '',
      parentEmail: st.profile?.parentEmail || '',
      address: st.profile?.address || '',
      dob: st.profile?.dob || '',
      bloodGroup: st.profile?.bloodGroup || 'O+',
      gender: st.profile?.gender || 'Male',
      busRoute: st.profile?.busRoute || '',
      rollNo: st.profile?.rollNo || '',
      newPassword: '',
      avatar: st.avatar || '',
    });
    setIsEditOpen(true);
  };

  // Update Student
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/students', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editStudent),
      });
      const data = await res.json();

      if (res.ok) {
        setIsEditOpen(false);
        setMessage({ type: 'success', text: data.message });
        fetchStudents();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update student.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to update student profile.' });
    } finally {
      setSubmitting(false);
    }
  };

  // Open Delete Modal
  const openDeleteModal = (st: any) => {
    setSelectedStudent(st);
    setIsDeleteOpen(true);
  };

  // Confirm Delete Student
  const handleDelete = async () => {
    if (!selectedStudent) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/students?id=${selectedStudent.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (res.ok) {
        setIsDeleteOpen(false);
        setSelectedStudent(null);
        setMessage({ type: 'success', text: data.message });
        fetchStudents();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to delete student record.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to remove student record.' });
    } finally {
      setSubmitting(false);
    }
  };

  const grades = ['all', 'Grade 10', 'Grade 9', 'Grade 8', 'Grade 7', 'Grade 6', 'Grade 5', 'Grade 4'];
  const paginatedStudents = students.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <ErpLayout requiredRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                Student Enrollment & Scholastic Registry
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Active student directory, admission credentials, parent emergency contacts, and class allocations.
            </p>
          </div>

          <button
            onClick={() => setIsEnrollOpen(true)}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center space-x-2 self-start cursor-pointer hover:scale-102"
          >
            <Plus className="w-4 h-4" />
            <span>+ Enroll New Student</span>
          </button>
        </div>

        {/* Status Alerts */}
        {message && (
          <div
            className={`p-4 rounded-xl text-xs flex items-center justify-between animate-in fade-in duration-200 ${
              message.type === 'success'
                ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-200'
                : 'bg-red-950/80 border border-red-500/50 text-red-200'
            }`}
          >
            <div className="flex items-center space-x-2">
              {message.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
            <button onClick={() => setMessage(null)} className="hover:text-white font-bold cursor-pointer">
              Dismiss
            </button>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {grades.map((g) => (
              <button
                key={g}
                onClick={() => setGradeFilter(g)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  gradeFilter === g
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {g === 'all' ? 'All Grades' : g}
              </button>
            ))}
          </div>

          <form onSubmit={handleSearchSubmit} className="w-full md:w-80 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search name, admission no, parent..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-hidden focus:border-amber-400"
            />
          </form>
        </div>

        {/* Students Table with Actions */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-800/60 text-slate-400 font-bold uppercase">
                  <th className="py-3.5 px-4">Student & Admission No</th>
                  <th className="py-3.5 px-4">Grade & Section</th>
                  <th className="py-3.5 px-4">Parent / Guardian</th>
                  <th className="py-3.5 px-4">Contact Phone & Bus</th>
                  <th className="py-3.5 px-4">Blood & Gender</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              {loading ? (
                <TableRowSkeleton cols={7} rows={5} />
              ) : students.length === 0 ? (
                <tbody>
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-slate-500 text-sm">
                      No enrolled students found.
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {paginatedStudents.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-800/60 transition-colors group">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={st.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                            alt={st.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-700 shadow-xs"
                          />
                          <div>
                            <p className="font-bold text-white text-sm">{st.name}</p>
                            <p className="text-[11px] text-amber-400 font-mono font-semibold">{st.admissionNo}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-blue-500/10 text-blue-300 border border-blue-500/30 px-2.5 py-1 rounded-md font-bold text-xs">
                          {st.grade} - {st.section}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-white">{st.profile?.parentName || 'Guardian'}</p>
                        <p className="text-[10px] text-slate-400 truncate max-w-[160px]">
                          {st.profile?.parentEmail || st.email}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-slate-200">{st.phone || st.profile?.parentPhone}</p>
                        <p className="text-[10px] text-slate-400 flex items-center mt-0.5">
                          <Bus className="w-3 h-3 text-amber-400 mr-1 shrink-0" />
                          <span>{st.profile?.busRoute || 'Self Transport'}</span>
                        </p>
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        <span className="font-semibold">{st.profile?.bloodGroup || 'O+'}</span> • {st.profile?.gender || 'Male'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase px-2 py-0.5 rounded-md">
                          Enrolled
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => openEditModal(st)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-600/30 text-blue-400 hover:text-blue-200 border border-slate-700 transition-colors cursor-pointer"
                            title="Edit Student Profile"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(st)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-600/30 text-red-400 hover:text-red-200 border border-slate-700 transition-colors cursor-pointer"
                            title="Remove Student Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>

          {/* Pagination Controls */}
          {!loading && students.length > 0 && (
            <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Showing {paginatedStudents.length} of {students.length} enrolled students</span>
              <Pagination
                currentPage={currentPage}
                totalItems={students.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>

        {/* 1. ENROLL NEW STUDENT MODAL */}
        {isEnrollOpen && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-white">Enroll New Student</h3>
                    <p className="text-[11px] text-slate-400">Institutional Admission & Credential Provisioning</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEnrollOpen(false)}
                  className="text-slate-400 hover:text-white cursor-pointer p-1 rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEnroll} className="space-y-4 text-xs">
                {/* Student Personal Info */}
                <div className="space-y-3 bg-slate-800/40 p-4 rounded-xl border border-slate-700/60">
                  <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">
                    1. Student Identity Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Student Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Aryan Sharma"
                        value={newStudent.name}
                        onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-hidden focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Institutional Student Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="student.name@kasinternationalschool.org"
                        value={newStudent.email}
                        onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-hidden focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Admission No (Auto or Custom)</label>
                      <input
                        type="text"
                        placeholder="e.g. KAS2026-1006 (leave blank for auto)"
                        value={newStudent.customAdmissionNo}
                        onChange={(e) => setNewStudent({ ...newStudent, customAdmissionNo: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-hidden focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        value={newStudent.dob}
                        onChange={(e) => setNewStudent({ ...newStudent, dob: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Gender</label>
                      <select
                        value={newStudent.gender}
                        onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Blood Group</label>
                      <select
                        value={newStudent.bloodGroup}
                        onChange={(e) => setNewStudent({ ...newStudent, bloodGroup: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                      >
                        <option value="O+">O+</option>
                        <option value="A+">A+</option>
                        <option value="B+">B+</option>
                        <option value="AB+">AB+</option>
                        <option value="O-">O-</option>
                        <option value="A-">A-</option>
                        <option value="B-">B-</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Academic & Class Allocation */}
                <div className="space-y-3 bg-slate-800/40 p-4 rounded-xl border border-slate-700/60">
                  <h4 className="font-bold text-blue-400 uppercase tracking-wider text-[11px]">
                    2. Academic & Class Allocation
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                        <option value="Grade 7">Grade 7</option>
                        <option value="Grade 6">Grade 6</option>
                        <option value="Grade 5">Grade 5</option>
                        <option value="Grade 4">Grade 4</option>
                        <option value="Grade 3">Grade 3</option>
                        <option value="Grade 2">Grade 2</option>
                        <option value="Grade 1">Grade 1</option>
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
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Initial Login Password</label>
                      <input
                        type="text"
                        value={newStudent.initialPassword}
                        onChange={(e) => setNewStudent({ ...newStudent, initialPassword: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Parent & Emergency Contacts */}
                <div className="space-y-3 bg-slate-800/40 p-4 rounded-xl border border-slate-700/60">
                  <h4 className="font-bold text-emerald-400 uppercase tracking-wider text-[11px]">
                    3. Parent / Guardian & Transport
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Parent / Guardian Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Sharma"
                        value={newStudent.parentName}
                        onChange={(e) => setNewStudent({ ...newStudent, parentName: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Parent Contact Phone *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98XXX XXXXX"
                        value={newStudent.parentPhone}
                        onChange={(e) => setNewStudent({ ...newStudent, parentPhone: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Parent Email</label>
                      <input
                        type="email"
                        placeholder="parent.email@gmail.com"
                        value={newStudent.parentEmail}
                        onChange={(e) => setNewStudent({ ...newStudent, parentEmail: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Bus Transport Route</label>
                      <input
                        type="text"
                        placeholder="e.g. Route 4 - Regal Town / BHEL"
                        value={newStudent.busRoute}
                        onChange={(e) => setNewStudent({ ...newStudent, busRoute: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-300 mb-1">Residential Address</label>
                      <input
                        type="text"
                        placeholder="Plot No., Regal Town, Awadhpuri, Bhopal"
                        value={newStudent.address}
                        onChange={(e) => setNewStudent({ ...newStudent, address: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsEnrollOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? 'Enrolling...' : 'Complete Enrollment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 2. EDIT STUDENT MODAL */}
        {isEditOpen && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold">
                    <Edit2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-white">Edit Student Profile</h3>
                    <p className="text-[11px] text-slate-400">Modify credentials, contacts, and class allocations</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="text-slate-400 hover:text-white cursor-pointer p-1 rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-4 text-xs">
                {/* Personal Info */}
                <div className="space-y-3 bg-slate-800/40 p-4 rounded-xl border border-slate-700/60">
                  <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">
                    1. Student Identity Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Student Full Name *</label>
                      <input
                        type="text"
                        required
                        value={editStudent.name}
                        onChange={(e) => setEditStudent({ ...editStudent, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Institutional Email *</label>
                      <input
                        type="email"
                        required
                        value={editStudent.email}
                        onChange={(e) => setEditStudent({ ...editStudent, email: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Admission Number</label>
                      <input
                        type="text"
                        value={editStudent.admissionNo}
                        onChange={(e) => setEditStudent({ ...editStudent, admissionNo: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Reset Password (Optional)</label>
                      <input
                        type="password"
                        placeholder="Leave blank to keep unchanged"
                        value={editStudent.newPassword}
                        onChange={(e) => setEditStudent({ ...editStudent, newPassword: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Gender</label>
                      <select
                        value={editStudent.gender}
                        onChange={(e) => setEditStudent({ ...editStudent, gender: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Blood Group</label>
                      <select
                        value={editStudent.bloodGroup}
                        onChange={(e) => setEditStudent({ ...editStudent, bloodGroup: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                      >
                        <option value="O+">O+</option>
                        <option value="A+">A+</option>
                        <option value="B+">B+</option>
                        <option value="AB+">AB+</option>
                        <option value="O-">O-</option>
                        <option value="A-">A-</option>
                        <option value="B-">B-</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Academic Info */}
                <div className="space-y-3 bg-slate-800/40 p-4 rounded-xl border border-slate-700/60">
                  <h4 className="font-bold text-blue-400 uppercase tracking-wider text-[11px]">
                    2. Class Allocation
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Grade Allocation</label>
                      <select
                        value={editStudent.grade}
                        onChange={(e) => setEditStudent({ ...editStudent, grade: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                      >
                        <option value="Grade 10">Grade 10</option>
                        <option value="Grade 9">Grade 9</option>
                        <option value="Grade 8">Grade 8</option>
                        <option value="Grade 7">Grade 7</option>
                        <option value="Grade 6">Grade 6</option>
                        <option value="Grade 5">Grade 5</option>
                        <option value="Grade 4">Grade 4</option>
                        <option value="Grade 3">Grade 3</option>
                        <option value="Grade 2">Grade 2</option>
                        <option value="Grade 1">Grade 1</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Section</label>
                      <select
                        value={editStudent.section}
                        onChange={(e) => setEditStudent({ ...editStudent, section: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                      >
                        <option value="A">Section A</option>
                        <option value="B">Section B</option>
                        <option value="C">Section C</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Parent Details */}
                <div className="space-y-3 bg-slate-800/40 p-4 rounded-xl border border-slate-700/60">
                  <h4 className="font-bold text-emerald-400 uppercase tracking-wider text-[11px]">
                    3. Parent Contacts & Transport
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Parent / Guardian Name</label>
                      <input
                        type="text"
                        value={editStudent.parentName}
                        onChange={(e) => setEditStudent({ ...editStudent, parentName: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Parent Phone</label>
                      <input
                        type="tel"
                        value={editStudent.parentPhone}
                        onChange={(e) => setEditStudent({ ...editStudent, parentPhone: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Parent Email</label>
                      <input
                        type="email"
                        value={editStudent.parentEmail}
                        onChange={(e) => setEditStudent({ ...editStudent, parentEmail: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Bus Transport Route</label>
                      <input
                        type="text"
                        value={editStudent.busRoute}
                        onChange={(e) => setEditStudent({ ...editStudent, busRoute: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-300 mb-1">Residential Address</label>
                      <input
                        type="text"
                        value={editStudent.address}
                        onChange={(e) => setEditStudent({ ...editStudent, address: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsEditOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? 'Saving Changes...' : 'Save Student Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 3. DELETE STUDENT CONFIRMATION MODAL */}
        {isDeleteOpen && selectedStudent && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center space-x-3 text-red-400">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">Confirm Student Deletion</h3>
                  <p className="text-[11px] text-slate-400">Remove from official school registry</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-200 leading-relaxed">
                Are you sure you want to delete <strong className="text-white">{selectedStudent.name}</strong> ({selectedStudent.admissionNo}) from Grade {selectedStudent.grade}-{selectedStudent.section}? This action removes their portal login credentials and scholastic records.
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsDeleteOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Deleting...' : 'Yes, Delete Student'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErpLayout>
  );
}
