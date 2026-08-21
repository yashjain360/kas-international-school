'use client';

import React, { useState, useEffect } from 'react';
import {
  Award,
  Calendar,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Printer,
  FileText,
  X,
  Sparkles,
  Layers,
  ChevronRight,
  UserCheck,
  Edit,
  Trash2,
  GraduationCap,
} from 'lucide-react';
import { ErpLayout } from '@/components/erp/ErpLayout';
import { TableRowSkeleton, CardSkeleton } from '@/components/erp/Skeleton';
import { Pagination } from '@/components/erp/Pagination';

export default function AdminAcademicsPage() {
  const [sessions, setSessions] = useState<string[]>(['2026-2027', '2025-2026']);
  const [selectedSession, setSelectedSession] = useState<string>('2026-2027');
  const [terms, setTerms] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTermFilter, setSelectedTermFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  // Modals
  const [isAddTermOpen, setIsAddTermOpen] = useState(false);
  const [isIssueReportOpen, setIsIssueReportOpen] = useState(false);
  const [activeReportModal, setActiveReportModal] = useState<any | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // New Term Form State
  const [newTerm, setNewTerm] = useState({
    session: '2026-2027',
    code: 'FA1',
    title: 'Formative Assessment 1 (FA-1)',
    startDate: '2026-07-15',
    endDate: '2026-07-25',
    weightagePercentage: 10,
    status: 'active',
    description: 'First quarter unit evaluation covering foundational chapters.',
  });

  // Issue Report Card Form State
  const [issueForm, setIssueForm] = useState({
    admissionNo: 'KAS2026-1001',
    session: '2026-2027',
    termCode: 'SA1',
    examName: 'Summative Assessment 1 (Half-Yearly Examination)',
    attendancePercentage: 96,
    facultyRemarks: 'Exceptional scholastic focus and consistent analytical performance.',
    principalRemarks: 'Promoted with academic distinction and honor roll status.',
    subjects: [
      { name: 'Mathematics', maxMarks: 100, marksObtained: 94, remarks: 'Strong algebraic reasoning' },
      { name: 'Science & STEM', maxMarks: 100, marksObtained: 91, remarks: 'Outstanding experimental precision' },
      { name: 'English Language', maxMarks: 100, marksObtained: 89, remarks: 'Eloquent articulation and vocabulary' },
      { name: 'Social Studies', maxMarks: 100, marksObtained: 92, remarks: 'Good grasp of historical timelines' },
      { name: 'Computer Applications', maxMarks: 100, marksObtained: 97, remarks: 'Exceptional coding and logic skills' },
    ],
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [termsRes, gradesRes, studentsRes] = await Promise.all([
        fetch(`/api/terms?session=${selectedSession}`).then((r) => r.json()),
        fetch(`/api/grades?session=${selectedSession}&termCode=${selectedTermFilter}`).then((r) => r.json()),
        fetch('/api/students?grade=all').then((r) => r.json()),
      ]);

      if (termsRes.terms) setTerms(termsRes.terms);
      if (termsRes.sessions) setSessions(termsRes.sessions);
      if (gradesRes.records) setReports(gradesRes.records);
      if (studentsRes.students) setStudents(studentsRes.students);
    } catch (err) {
      console.error('Academics fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchData();
  }, [selectedSession, selectedTermFilter]);

  const handleCreateTerm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/terms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newTerm, session: selectedSession }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsAddTermOpen(false);
        setMessage(data.message || 'Assessment term added successfully.');
        fetchData();
      } else {
        setMessage(data.error || 'Failed to add assessment term.');
      }
    } catch {
      setMessage('Failed to add assessment term.');
    }
  };

  const handleIssueReport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/grades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...issueForm, session: selectedSession }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsIssueReportOpen(false);
        setMessage(data.message || 'Report card issued successfully.');
        fetchData();
      } else {
        setMessage(data.error || 'Failed to issue report card.');
      }
    } catch {
      setMessage('Failed to issue report card.');
    }
  };

  const handleUpdateTermStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/terms', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setMessage('Assessment timeline status updated.');
        fetchData();
      }
    } catch (err) {
      console.error('Status update error:', err);
    }
  };

  const handleDeleteTerm = async (id: string) => {
    if (!confirm('Are you sure you wish to delete this evaluation timeline?')) return;
    try {
      const res = await fetch(`/api/terms?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage('Assessment timeline removed.');
        fetchData();
      }
    } catch (err) {
      console.error('Delete term error:', err);
    }
  };

  const handleSubjectMarkChange = (idx: number, field: string, val: any) => {
    const updated = [...issueForm.subjects];
    (updated[idx] as any)[field] = val;
    setIssueForm({ ...issueForm, subjects: updated });
  };

  const filteredReports = reports.filter((r) => {
    const matchSearch =
      r.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.admissionNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.termCode?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
  });

  const paginatedReports = filteredReports.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <ErpLayout requiredRole="admin">
      <div className="space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider bg-amber-400/10 border border-amber-400/30 px-2.5 py-0.5 rounded-md">
                Evaluation Timelines & Marksheet Engine
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1">
              Assessment Timelines & Report Card Center
            </h1>
            <p className="text-xs text-slate-400">
              Manage academic sessions, evaluation windows (FA1, FA2, SA1, SA2, etc.), and issue digital report cards visible to scholars.
            </p>
          </div>

          {/* Session Switcher & Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 self-start">
            <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 p-1.5 rounded-xl">
              <span className="text-[11px] text-slate-400 font-bold uppercase pl-2">Session:</span>
              <select
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-amber-400 font-mono font-bold text-xs rounded-lg px-2.5 py-1 focus:outline-hidden cursor-pointer"
              >
                {sessions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setIsAddTermOpen(true)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Add Assessment Term</span>
            </button>

            <button
              onClick={() => setIsIssueReportOpen(true)}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center space-x-1.5 cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>Issue Report Card</span>
            </button>
          </div>
        </div>

        {message && (
          <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-200 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{message}</span>
            </div>
            <button onClick={() => setMessage(null)} className="text-emerald-400 hover:text-white font-bold">
              Dismiss
            </button>
          </div>
        )}

        {/* 1. Evaluation Timelines / Assessment Sections Manager */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-base text-white flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-amber-400" />
                Assessment Timelines for Academic Session {selectedSession}
              </h3>
              <p className="text-xs text-slate-400">
                Evaluation windows, weightage allocation, and active examination milestones.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg">
              {terms.length} Active Terms Configured
            </span>
          </div>

          {loading ? (
            <CardSkeleton count={3} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {terms.map((term) => (
                <div
                  key={term._id}
                  className="bg-slate-800/60 border border-slate-700/70 rounded-xl p-4 space-y-3 flex flex-col justify-between hover:border-slate-600 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="bg-amber-500 text-slate-950 font-mono font-extrabold text-xs px-2.5 py-0.5 rounded-md">
                        {term.code}
                      </span>
                      <select
                        value={term.status}
                        onChange={(e) => handleUpdateTermStatus(term._id, e.target.value)}
                        className={`text-[10px] font-bold uppercase rounded-md px-2 py-0.5 border cursor-pointer ${
                          term.status === 'published'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : term.status === 'active'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : term.status === 'evaluating'
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                            : 'bg-slate-700 text-slate-300 border-slate-600'
                        }`}
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="active">Active Exam</option>
                        <option value="evaluating">Evaluating Marks</option>
                        <option value="published">Published</option>
                        <option value="closed">Closed / Archived</option>
                      </select>
                    </div>

                    <h4 className="font-bold text-sm text-white">{term.title}</h4>
                    <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2">
                      {term.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-700/60 space-y-1 text-[11px]">
                    <div className="flex justify-between text-slate-300">
                      <span>Timeline Window:</span>
                      <span className="font-mono text-amber-300">{term.startDate} to {term.endDate}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Annual Weightage:</span>
                      <span className="font-bold text-emerald-400">{term.weightagePercentage}%</span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-slate-500">Classes: {term.gradesApplicable?.length || 5} Wings</span>
                      <button
                        onClick={() => handleDeleteTerm(term._id)}
                        className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                        title="Remove term"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 2. Master Report Cards Issued Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between">
          <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-white">Issued Report Cards & Marks Registry</h3>
              <p className="text-xs text-slate-400">
                Official marks verified and published for student scholar portal access.
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center space-x-1 bg-slate-800 rounded-lg p-1 border border-slate-700">
                <button
                  onClick={() => setSelectedTermFilter('all')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                    selectedTermFilter === 'all'
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  All Terms
                </button>
                {['FA1', 'FA2', 'SA1', 'FA3', 'SA2'].map((tc) => (
                  <button
                    key={tc}
                    onClick={() => setSelectedTermFilter(tc)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                      selectedTermFilter === tc
                        ? 'bg-amber-500 text-slate-950'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {tc}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search student or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="text-xs pl-8 pr-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-800/60 text-slate-400 font-bold uppercase">
                  <th className="py-3 px-4">Student Scholar</th>
                  <th className="py-3 px-4">Session & Term</th>
                  <th className="py-3 px-4">Exam Title</th>
                  <th className="py-3 px-4">Total Marks</th>
                  <th className="py-3 px-4">Percentage</th>
                  <th className="py-3 px-4">Letter Grade</th>
                  <th className="py-3 px-4">Issued By</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              {loading ? (
                <TableRowSkeleton cols={8} rows={5} />
              ) : filteredReports.length === 0 ? (
                <tbody>
                  <tr>
                    <td colSpan={8} className="text-center py-16 text-slate-500 text-sm">
                      No report cards issued for Session {selectedSession} ({selectedTermFilter}).
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {paginatedReports.map((r) => (
                    <tr key={r._id} className="hover:bg-slate-800/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-white text-sm">{r.studentName}</p>
                        <p className="text-[10px] text-amber-400 font-mono">
                          {r.admissionNo} • {r.grade}-{r.section}
                        </p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="bg-amber-400/20 text-amber-300 font-mono font-bold text-[11px] px-2 py-0.5 rounded-md">
                          {r.session || selectedSession} • {r.termCode}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-200">{r.examName}</p>
                        <p className="text-[10px] text-slate-400">{r.subjects?.length || 5} Subjects Evaluated</p>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-white">
                        {r.totalMarksObtained} / {r.totalMaxMarks}
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-amber-400 text-sm">
                        {r.percentage}%
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="bg-blue-500/20 text-blue-300 font-bold px-2.5 py-0.5 rounded-md">
                          {r.overallGrade}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="text-slate-300">{r.issuedBy || 'Faculty Cell'}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{r.issueDate || '2026-08-20'}</p>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setActiveReportModal(r)}
                          className="bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 px-3 py-1.5 rounded-md font-bold transition-all inline-flex items-center space-x-1 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Official Marksheet</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>

          {/* Pagination Controls */}
          {!loading && filteredReports.length > pageSize && (
            <Pagination
              currentPage={currentPage}
              totalItems={filteredReports.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          )}
        </div>

        {/* Modal 1: Add Assessment Term / Section */}
        {isAddTermOpen && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-bold text-base text-white">Add Assessment Term / Timeline</h3>
                <button onClick={() => setIsAddTermOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTerm} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Academic Session *</label>
                    <input
                      type="text"
                      required
                      value={newTerm.session}
                      onChange={(e) => setNewTerm({ ...newTerm, session: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Term Code (e.g. FA1, SA1) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. FA1, FA2, SA1, SA2"
                      value={newTerm.code}
                      onChange={(e) => setNewTerm({ ...newTerm, code: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Full Evaluation Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Formative Assessment 1 (FA-1)"
                    value={newTerm.title}
                    onChange={(e) => setNewTerm({ ...newTerm, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Start Date *</label>
                    <input
                      type="date"
                      required
                      value={newTerm.startDate}
                      onChange={(e) => setNewTerm({ ...newTerm, startDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">End Date *</label>
                    <input
                      type="date"
                      required
                      value={newTerm.endDate}
                      onChange={(e) => setNewTerm({ ...newTerm, endDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Weightage % in Annual Result</label>
                    <input
                      type="number"
                      value={newTerm.weightagePercentage}
                      onChange={(e) => setNewTerm({ ...newTerm, weightagePercentage: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Initial Status</label>
                    <select
                      value={newTerm.status}
                      onChange={(e) => setNewTerm({ ...newTerm, status: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white cursor-pointer"
                    >
                      <option value="active">Active Exam</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="evaluating">Evaluating Marks</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Section / Term Description</label>
                  <textarea
                    rows={3}
                    value={newTerm.description}
                    onChange={(e) => setNewTerm({ ...newTerm, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  />
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsAddTermOpen(false)}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold shadow-md cursor-pointer"
                  >
                    Save Term Timeline
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal 2: Issue Report Card */}
        {isIssueReportOpen && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-4 shadow-2xl text-xs max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-bold text-base text-white">Direct Admin Report Card Issuance</h3>
                <button onClick={() => setIsIssueReportOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleIssueReport} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Student Scholar *</label>
                    <select
                      value={issueForm.admissionNo}
                      onChange={(e) => setIssueForm({ ...issueForm, admissionNo: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white cursor-pointer"
                    >
                      {students.map((st) => (
                        <option key={st.id} value={st.admissionNo}>
                          {st.name} ({st.admissionNo})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Academic Session *</label>
                    <select
                      value={issueForm.session}
                      onChange={(e) => setIssueForm({ ...issueForm, session: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white cursor-pointer"
                    >
                      {sessions.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Assessment Term *</label>
                    <select
                      value={issueForm.termCode}
                      onChange={(e) => {
                        const tc = e.target.value;
                        const matching = terms.find((t) => t.code === tc);
                        setIssueForm({
                          ...issueForm,
                          termCode: tc,
                          examName: matching ? matching.title : `${tc} Assessment`,
                        });
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white cursor-pointer"
                    >
                      {terms.map((t) => (
                        <option key={t.code} value={t.code}>
                          {t.code} — {t.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Subjects Entry */}
                <div className="space-y-2">
                  <span className="font-bold text-slate-300 block">Subject Marks Entry (Out of 100)</span>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {issueForm.subjects.map((sub, idx) => (
                      <div key={idx} className="grid grid-cols-12 gap-2 p-2 bg-slate-800/60 rounded-lg border border-slate-700 items-center">
                        <div className="col-span-4">
                          <input
                            type="text"
                            value={sub.name}
                            onChange={(e) => handleSubjectMarkChange(idx, 'name', e.target.value)}
                            className="w-full px-2 py-1 rounded bg-slate-800 border border-slate-700 text-white font-bold"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="number"
                            placeholder="Marks"
                            value={sub.marksObtained}
                            onChange={(e) => handleSubjectMarkChange(idx, 'marksObtained', Number(e.target.value))}
                            className="w-full px-2 py-1 rounded bg-slate-800 border border-amber-400/40 text-amber-300 font-extrabold"
                          />
                        </div>
                        <div className="col-span-6">
                          <input
                            type="text"
                            placeholder="Remark"
                            value={sub.remarks}
                            onChange={(e) => handleSubjectMarkChange(idx, 'remarks', e.target.value)}
                            className="w-full px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Faculty Remarks</label>
                    <input
                      type="text"
                      value={issueForm.facultyRemarks}
                      onChange={(e) => setIssueForm({ ...issueForm, facultyRemarks: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Principal's Commendation</label>
                    <input
                      type="text"
                      value={issueForm.principalRemarks}
                      onChange={(e) => setIssueForm({ ...issueForm, principalRemarks: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsIssueReportOpen(false)}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold shadow-md cursor-pointer"
                  >
                    Issue & Publish Marksheet
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal 3: Official Marksheet Printable Viewer */}
        {activeReportModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative border border-slate-200 max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setActiveReportModal(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              {/* School Header */}
              <div className="text-center pb-4 border-b border-slate-200 space-y-1">
                <div className="inline-flex items-center space-x-2 bg-[#0F2942] text-amber-400 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  <GraduationCap className="w-4 h-4" />
                  <span>K.A.S. INTERNATIONAL SCHOOL • BHOPAL</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F2942] pt-1">
                  Official Scholastic Marksheet & Evaluation
                </h2>
                <p className="text-xs text-slate-500">
                  Affiliated to CBSE Standards • Academic Session {activeReportModal.session || selectedSession}
                </p>
              </div>

              {/* Details Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 font-bold block">Scholar Name</span>
                  <strong className="text-slate-900">{activeReportModal.studentName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">Admission No</span>
                  <strong className="text-slate-900 font-mono">{activeReportModal.admissionNo}</strong>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">Class & Section</span>
                  <strong className="text-slate-900">{activeReportModal.grade}-{activeReportModal.section}</strong>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">Evaluation Term</span>
                  <strong className="text-amber-700 font-bold">{activeReportModal.termCode} ({activeReportModal.session})</strong>
                </div>
              </div>

              {/* Marks Table */}
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-300 bg-slate-100 text-slate-700 font-bold uppercase">
                    <th className="py-2.5 px-3">Subject</th>
                    <th className="py-2.5 px-3 text-center">Max</th>
                    <th className="py-2.5 px-3 text-center">Scored</th>
                    <th className="py-2.5 px-3 text-center">Grade</th>
                    <th className="py-2.5 px-3">Qualitative Remark</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  {activeReportModal.subjects?.map((sub: any, i: number) => (
                    <tr key={i}>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{sub.name}</td>
                      <td className="py-2.5 px-3 text-center text-slate-500">{sub.maxMarks}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-blue-900">{sub.marksObtained}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded text-[11px]">
                          {sub.grade}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 italic text-[11px]">{sub.remarks}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-slate-300 bg-slate-100 font-bold text-xs">
                    <td className="py-2.5 px-3">Aggregate Total</td>
                    <td className="py-2.5 px-3 text-center">{activeReportModal.totalMaxMarks}</td>
                    <td className="py-2.5 px-3 text-center font-extrabold text-[#0F2942]">
                      {activeReportModal.totalMarksObtained}
                    </td>
                    <td className="py-2.5 px-3 text-center text-amber-800">
                      Grade: {activeReportModal.overallGrade}
                    </td>
                    <td className="py-2.5 px-3 text-emerald-800 font-extrabold">
                      Aggregate: {activeReportModal.percentage}%
                    </td>
                  </tr>
                </tfoot>
              </table>

              {/* Remarks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="font-bold text-slate-900">Faculty Evaluation:</p>
                  <p className="text-slate-600 italic mt-0.5">"{activeReportModal.facultyRemarks}"</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="font-bold text-slate-900">Principal Commendation:</p>
                  <p className="text-slate-600 italic mt-0.5">"{activeReportModal.principalRemarks || 'Promoted with distinction.'}"</p>
                </div>
              </div>

              {/* Signatures & Issue Log */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-200 text-xs text-slate-500">
                <div>
                  <p className="text-[11px]">Verified & Issued by: <strong>{activeReportModal.issuedBy || 'Admin Office'}</strong></p>
                  <p className="text-[10px]">Issue Date: {activeReportModal.issueDate || '2026-08-20'}</p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-sm cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Marksheet</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErpLayout>
  );
}
