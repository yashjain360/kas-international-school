'use client';

import React, { useState, useEffect } from 'react';
import {
  Award,
  BookOpen,
  Plus,
  Save,
  CheckCircle2,
  AlertCircle,
  Users,
} from 'lucide-react';
import { ErpLayout } from '@/components/erp/ErpLayout';

export default function FacultyGradebookPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>('KAS2026-1001');
  const [examName, setExamName] = useState('Mid-Term Comprehensive Assessment 2026');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [subjects, setSubjects] = useState([
    { name: 'Mathematics', maxMarks: 100, marksObtained: 92, remarks: 'Excellent logical aptitude' },
    { name: 'Physics', maxMarks: 100, marksObtained: 89, remarks: 'Strong lab work' },
    { name: 'Chemistry', maxMarks: 100, marksObtained: 87, remarks: 'Good analytical precision' },
    { name: 'English Literature', maxMarks: 100, marksObtained: 91, remarks: 'Eloquent composition' },
    { name: 'Computer Science & AI', maxMarks: 100, marksObtained: 96, remarks: 'Top coding project' },
  ]);

  const [facultyRemarks, setFacultyRemarks] = useState(
    'Demonstrates consistent intellectual dedication and leadership in class projects.'
  );

  useEffect(() => {
    fetch('/api/students?grade=all')
      .then((res) => res.json())
      .then((data) => {
        if (data.students && data.students.length > 0) {
          setStudents(data.students);
        }
      })
      .catch((err) => console.error('Students error:', err));
  }, []);

  const handleMarksChange = (idx: number, field: string, value: any) => {
    const updated = [...subjects];
    (updated[idx] as any)[field] = value;
    setSubjects(updated);
  };

  const handleSaveGrades = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/grades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admissionNo: selectedStudent,
          examName,
          subjects,
          facultyRemarks,
          attendancePercentage: 96,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || 'Report card grades successfully recorded & published.');
      } else {
        setMessage(data.error || 'Failed to save grades.');
      }
    } catch {
      setMessage('Failed to save gradebook entry.');
    } finally {
      setSaving(false);
    }
  };

  const totalMax = subjects.reduce((sum, s) => sum + (Number(s.maxMarks) || 0), 0);
  const totalObtained = subjects.reduce((sum, s) => sum + (Number(s.marksObtained) || 0), 0);
  const currentPercentage = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(1) : '0';

  return (
    <ErpLayout requiredRole="faculty">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Academic Gradebook & Mark Entry</h1>
            <p className="text-xs text-slate-400">
              Submit term assessment scores, automatic percentage and letter grade calculation, and teacher remarks.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl text-xs flex items-center space-x-3 self-start">
            <span className="text-slate-400">Current Aggregate:</span>
            <span className="font-extrabold text-amber-400 text-sm">
              {totalObtained} / {totalMax} ({currentPercentage}%)
            </span>
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

        {/* Grade Entry Form */}
        <form onSubmit={handleSaveGrades} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1.5">Select Student Scholar *</label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-medium focus:outline-hidden"
              >
                {students.map((st) => (
                  <option key={st.id} value={st.admissionNo}>
                    {st.name} ({st.admissionNo} • {st.grade}-{st.section})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1.5">Assessment Term *</label>
              <select
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-medium focus:outline-hidden"
              >
                <option value="Mid-Term Comprehensive Assessment 2026">Mid-Term Comprehensive Assessment 2026</option>
                <option value="Term 1 Final Assessment">Term 1 Final Assessment</option>
                <option value="Periodic Unit Test 2">Periodic Unit Test 2</option>
                <option value="Pre-Board Mock Assessment 2026-27">Pre-Board Mock Assessment 2026-27</option>
              </select>
            </div>
          </div>

          {/* Subjects Table */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-white">Subject-wise Marks Allocation</h3>

            <div className="space-y-3">
              {subjects.map((sub, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60 items-center text-xs"
                >
                  <div className="sm:col-span-4">
                    <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Subject Name</label>
                    <input
                      type="text"
                      value={sub.name}
                      onChange={(e) => handleMarksChange(idx, 'name', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-md bg-slate-800 border border-slate-700 text-white font-semibold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Max Marks</label>
                    <input
                      type="number"
                      value={sub.maxMarks}
                      onChange={(e) => handleMarksChange(idx, 'maxMarks', Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-md bg-slate-800 border border-slate-700 text-white font-bold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Marks Scored</label>
                    <input
                      type="number"
                      value={sub.marksObtained}
                      onChange={(e) => handleMarksChange(idx, 'marksObtained', Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-md bg-slate-800 border border-amber-400/40 text-amber-300 font-extrabold"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Qualitative Remark</label>
                    <input
                      type="text"
                      value={sub.remarks}
                      onChange={(e) => handleMarksChange(idx, 'remarks', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Qualitative Teacher Remarks */}
          <div className="space-y-1.5 text-xs">
            <label className="block font-bold text-slate-300">Overall Mentor Assessment & Remarks</label>
            <textarea
              rows={3}
              value={facultyRemarks}
              onChange={(e) => setFacultyRemarks(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-hidden"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center space-x-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Recording & Publishing...' : 'Save & Publish Report Card'}</span>
            </button>
          </div>
        </form>
      </div>
    </ErpLayout>
  );
}
