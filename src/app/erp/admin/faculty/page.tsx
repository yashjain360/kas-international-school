'use client';

import React, { useState, useEffect } from 'react';
import {
  School,
  Search,
  Award,
  BookOpen,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  Plus,
  Edit,
  Trash2,
  X,
  Phone,
  Mail,
  Lock,
  Layers,
  Sparkles,
} from 'lucide-react';
import { ErpLayout } from '@/components/erp/ErpLayout';
import { CardSkeleton } from '@/components/erp/Skeleton';
import { Pagination } from '@/components/erp/Pagination';

export default function AdminFacultyPage() {
  const [faculty, setFaculty] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<any | null>(null);

  // Add Faculty Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    employeeId: '',
    designation: 'Senior PGT Faculty',
    department: 'Science & STEM',
    qualifications: 'M.Sc., B.Ed.',
    experienceYears: 6,
    assignedClasses: 'Grade 10, Grade 9',
    subjects: 'Physics, Chemistry',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    password: 'KasFaculty@2026',
  });

  const fetchFaculty = () => {
    setLoading(true);
    fetch('/api/faculty')
      .then((res) => res.json())
      .then((data) => {
        if (data.faculty) setFaculty(data.faculty);
      })
      .catch((err) => console.error('Faculty error:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  const handleCreateFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/faculty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          assignedClasses: formData.assignedClasses.split(',').map((s) => s.trim()),
          subjects: formData.subjects.split(',').map((s) => s.trim()),
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setIsAddOpen(false);
        setMessage(data.message || 'Faculty member created successfully.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          employeeId: '',
          designation: 'Senior PGT Faculty',
          department: 'Science & STEM',
          qualifications: 'M.Sc., B.Ed.',
          experienceYears: 6,
          assignedClasses: 'Grade 10, Grade 9',
          subjects: 'Physics, Chemistry',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
          password: 'KasFaculty@2026',
        });
        fetchFaculty();
      } else {
        setMessage(data.error || 'Failed to create faculty member.');
      }
    } catch {
      setMessage('Failed to create faculty member.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaculty) return;
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/faculty', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingFaculty.id,
          name: editingFaculty.name,
          email: editingFaculty.email,
          phone: editingFaculty.phone,
          employeeId: editingFaculty.employeeId,
          designation: editingFaculty.designation,
          department: editingFaculty.department,
          qualifications: editingFaculty.qualifications,
          experienceYears: editingFaculty.experienceYears,
          assignedClasses: typeof editingFaculty.assignedClasses === 'string'
            ? editingFaculty.assignedClasses.split(',').map((s: string) => s.trim())
            : editingFaculty.assignedClasses,
          subjects: typeof editingFaculty.subjects === 'string'
            ? editingFaculty.subjects.split(',').map((s: string) => s.trim())
            : editingFaculty.subjects,
          avatar: editingFaculty.avatar,
          newPassword: editingFaculty.newPassword || undefined,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setEditingFaculty(null);
        setMessage(data.message || 'Faculty member updated successfully.');
        fetchFaculty();
      } else {
        setMessage(data.error || 'Failed to update faculty member.');
      }
    } catch {
      setMessage('Failed to update faculty member.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFaculty = async (id: string, name: string) => {
    if (!confirm(`Are you sure you wish to permanently delete the faculty profile for ${name}?`)) return;

    try {
      const res = await fetch(`/api/faculty?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || 'Faculty profile removed.');
        fetchFaculty();
      } else {
        setMessage(data.error || 'Failed to delete faculty member.');
      }
    } catch {
      setMessage('Failed to delete faculty.');
    }
  };

  const departments = ['all', ...Array.from(new Set(faculty.map((f) => f.department)))];

  const filtered = faculty.filter((f) => {
    const matchSearch =
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.designation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDept = selectedDept === 'all' || f.department === selectedDept;
    return matchSearch && matchDept;
  });

  const paginatedFaculty = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <ErpLayout requiredRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider bg-amber-400/10 border border-amber-400/30 px-2.5 py-0.5 rounded-md">
                Faculty Personnel Management
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1">Faculty & Teaching Mentors Directory</h1>
            <p className="text-xs text-slate-400">
              Create, edit, reassign, and manage teacher records, department allocations, subject specializations, and login credentials.
            </p>
          </div>

          <div className="flex items-center space-x-3 self-start">
            <span className="bg-purple-400/10 border border-purple-400/30 text-purple-400 font-mono text-xs font-bold px-3 py-2 rounded-xl">
              Total Faculty: {faculty.length}
            </span>
            <button
              onClick={() => setIsAddOpen(true)}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Faculty Mentor</span>
            </button>
          </div>
        </div>

        {message && (
          <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-200 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{message}</span>
            </div>
            <button onClick={() => setMessage(null)} className="text-emerald-400 hover:text-white font-bold cursor-pointer">
              Dismiss
            </button>
          </div>
        )}

        {/* Search & Department Filter Bar */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-80 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search faculty name, department, ID..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs pl-9 pr-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-hidden"
            />
          </div>

          {/* Department Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => {
                  setSelectedDept(dept);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedDept === dept
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {dept === 'all' ? 'All Departments' : dept}
              </button>
            ))}
          </div>
        </div>

        {/* Faculty Grid */}
        {loading ? (
          <CardSkeleton count={6} />
        ) : filtered.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 p-12 rounded-2xl text-center text-slate-500 text-sm">
            No faculty members found matching your search.
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedFaculty.map((fac) => (
                <div
                  key={fac.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3.5">
                        <img
                          src={fac.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80'}
                          alt={fac.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                        />
                        <div>
                          <h3 className="font-bold text-sm text-white">{fac.name}</h3>
                          <p className="text-[11px] text-amber-400 font-semibold">{fac.designation}</p>
                          <span className="text-[10px] font-mono text-slate-400">ID: {fac.employeeId}</span>
                        </div>
                      </div>

                      {/* Action Menu Buttons */}
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() =>
                            setEditingFaculty({
                              ...fac,
                              assignedClasses: Array.isArray(fac.assignedClasses)
                                ? fac.assignedClasses.join(', ')
                                : fac.assignedClasses,
                              subjects: Array.isArray(fac.subjects)
                                ? fac.subjects.join(', ')
                                : fac.subjects,
                            })
                          }
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition-colors cursor-pointer"
                          title="Edit Faculty Record"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteFaculty(fac.id, fac.name)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950 text-red-400 border border-slate-700 transition-colors cursor-pointer"
                          title="Delete Faculty Profile"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-300 pt-3 border-t border-slate-800">
                      <p><strong className="text-slate-400">Department:</strong> {fac.department}</p>
                      <p><strong className="text-slate-400">Qualifications:</strong> {fac.qualifications}</p>
                      <p><strong className="text-slate-400">Experience:</strong> {fac.experienceYears} Years</p>
                      <p className="truncate"><strong className="text-slate-400">Email:</strong> {fac.email}</p>
                      {fac.phone && <p><strong className="text-slate-400">Phone:</strong> {fac.phone}</p>}
                      <p><strong className="text-slate-400">Assigned Classes:</strong> {Array.isArray(fac.assignedClasses) ? fac.assignedClasses.join(', ') : fac.assignedClasses}</p>
                    </div>

                    {fac.subjects && (
                      <div className="pt-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Subject Portfolio</p>
                        <div className="flex flex-wrap gap-1">
                          {(Array.isArray(fac.subjects) ? fac.subjects : [fac.subjects]).map((sub: string, i: number) => (
                            <span key={i} className="bg-slate-800 text-amber-300 text-[10px] font-medium px-2 py-0.5 rounded-md border border-slate-700">
                              {sub}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {filtered.length > pageSize && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <Pagination
                  currentPage={currentPage}
                  totalItems={filtered.length}
                  pageSize={pageSize}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        )}

        {/* Modal 1: Add Faculty Member */}
        {isAddOpen && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl text-xs max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="font-bold text-base text-white">Add New Faculty Mentor</h3>
                  <p className="text-[11px] text-slate-400">Register new teacher profile, department allocation, and institutional ERP login.</p>
                </div>
                <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateFaculty} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Raghavendra Singh"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Official Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="faculty.name@kasinternationalschool.org"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Employee ID</label>
                    <input
                      type="text"
                      placeholder="e.g. KAS-FAC-108"
                      value={formData.employeeId}
                      onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Phone Number</label>
                    <input
                      type="text"
                      placeholder="+91 94259 92209"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Experience (Years)</label>
                    <input
                      type="number"
                      value={formData.experienceYears}
                      onChange={(e) => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Designation *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Senior PGT Mathematics & HOD"
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Department *</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white cursor-pointer"
                    >
                      <option value="Science & STEM">Science & STEM</option>
                      <option value="Mathematics & Logic">Mathematics & Logic</option>
                      <option value="Languages & Literature">Languages & Literature</option>
                      <option value="Humanities & Social Sciences">Humanities & Social Sciences</option>
                      <option value="Computer Science & AI">Computer Science & AI</option>
                      <option value="Physical Education & Sports">Physical Education & Sports</option>
                      <option value="Performing Arts & Music">Performing Arts & Music</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Assigned Classes (Comma separated)</label>
                    <input
                      type="text"
                      placeholder="Grade 10, Grade 9, Grade 8"
                      value={formData.assignedClasses}
                      onChange={(e) => setFormData({ ...formData, assignedClasses: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Subject Specialization (Comma separated)</label>
                    <input
                      type="text"
                      placeholder="Physics, Astronomy, STEM Lab"
                      value={formData.subjects}
                      onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Academic Qualifications</label>
                    <input
                      type="text"
                      placeholder="M.Sc. Physics, B.Ed., Ph.D."
                      value={formData.qualifications}
                      onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Initial Password</label>
                    <input
                      type="text"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Avatar Image URL</label>
                  <input
                    type="text"
                    value={formData.avatar}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-[11px]"
                  />
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsAddOpen(false)}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {saving ? 'Creating Record...' : 'Create Faculty Member'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal 2: Edit Faculty Member */}
        {editingFaculty && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl text-xs max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="font-bold text-base text-white">Edit Faculty Member: {editingFaculty.name}</h3>
                  <p className="text-[11px] text-slate-400">Modify designation, assigned classes, subjects, and credentials.</p>
                </div>
                <button onClick={() => setEditingFaculty(null)} className="text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateFaculty} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={editingFaculty.name}
                      onChange={(e) => setEditingFaculty({ ...editingFaculty, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={editingFaculty.email}
                      onChange={(e) => setEditingFaculty({ ...editingFaculty, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Employee ID</label>
                    <input
                      type="text"
                      value={editingFaculty.employeeId}
                      onChange={(e) => setEditingFaculty({ ...editingFaculty, employeeId: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={editingFaculty.phone}
                      onChange={(e) => setEditingFaculty({ ...editingFaculty, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Experience (Years)</label>
                    <input
                      type="number"
                      value={editingFaculty.experienceYears}
                      onChange={(e) => setEditingFaculty({ ...editingFaculty, experienceYears: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Designation</label>
                    <input
                      type="text"
                      value={editingFaculty.designation}
                      onChange={(e) => setEditingFaculty({ ...editingFaculty, designation: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Department</label>
                    <select
                      value={editingFaculty.department}
                      onChange={(e) => setEditingFaculty({ ...editingFaculty, department: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white cursor-pointer"
                    >
                      <option value="Science & STEM">Science & STEM</option>
                      <option value="Mathematics & Logic">Mathematics & Logic</option>
                      <option value="Languages & Literature">Languages & Literature</option>
                      <option value="Humanities & Social Sciences">Humanities & Social Sciences</option>
                      <option value="Computer Science & AI">Computer Science & AI</option>
                      <option value="Physical Education & Sports">Physical Education & Sports</option>
                      <option value="Performing Arts & Music">Performing Arts & Music</option>
                      <option value="Academic Instruction">Academic Instruction</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Assigned Classes (Comma separated)</label>
                    <input
                      type="text"
                      value={editingFaculty.assignedClasses}
                      onChange={(e) => setEditingFaculty({ ...editingFaculty, assignedClasses: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Subject Specialization (Comma separated)</label>
                    <input
                      type="text"
                      value={editingFaculty.subjects}
                      onChange={(e) => setEditingFaculty({ ...editingFaculty, subjects: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Academic Qualifications</label>
                    <input
                      type="text"
                      value={editingFaculty.qualifications}
                      onChange={(e) => setEditingFaculty({ ...editingFaculty, qualifications: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Reset Password (Leave blank to keep current)</label>
                    <input
                      type="text"
                      placeholder="New password..."
                      value={editingFaculty.newPassword || ''}
                      onChange={(e) => setEditingFaculty({ ...editingFaculty, newPassword: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Avatar Image URL</label>
                  <input
                    type="text"
                    value={editingFaculty.avatar}
                    onChange={(e) => setEditingFaculty({ ...editingFaculty, avatar: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-[11px]"
                  />
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setEditingFaculty(null)}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {saving ? 'Updating...' : 'Save Faculty Changes'}
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
