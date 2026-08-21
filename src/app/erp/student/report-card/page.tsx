'use client';

import React, { useState, useEffect } from 'react';
import {
  Award,
  BookOpen,
  Printer,
  CheckCircle2,
  Calendar,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  UserCheck,
} from 'lucide-react';
import { ErpLayout } from '@/components/erp/ErpLayout';

export default function StudentReportCardPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<string[]>(['2026-2027', '2025-2026']);
  const [selectedSession, setSelectedSession] = useState<string>('2026-2027');
  const [selectedTerm, setSelectedTerm] = useState<string>('all');

  useEffect(() => {
    setLoading(true);
    fetch(`/api/grades?session=${selectedSession}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.records) setReports(data.records);
      })
      .catch((err) => console.error('Report card error:', err))
      .finally(() => setLoading(false));
  }, [selectedSession]);

  const availableTerms = ['all', ...Array.from(new Set(reports.map((r) => r.termCode)))];

  const filteredReports = selectedTerm === 'all'
    ? reports
    : reports.filter((r) => r.termCode === selectedTerm);

  return (
    <ErpLayout requiredRole="student">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider bg-amber-400/10 border border-amber-400/30 px-2.5 py-0.5 rounded-md">
                Official CBSE Marksheet
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1">Digital Scholastic Report Card</h1>
            <p className="text-xs text-slate-400">
              Official term evaluation statements, subject-wise marks, letter grades, and mentor qualitative remarks.
            </p>
          </div>

          {/* Session Switcher & Print Button */}
          <div className="flex flex-wrap items-center gap-3 self-start">
            <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 p-1.5 rounded-xl text-xs">
              <span className="text-[11px] text-slate-400 font-bold uppercase pl-2">Session:</span>
              <select
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-amber-400 font-mono font-bold text-xs rounded-lg px-2.5 py-1 focus:outline-hidden cursor-pointer"
              >
                {sessions.map((s) => (
                  <option key={s} value={s}>
                    {s} Session
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => window.print()}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center space-x-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Marksheet</span>
            </button>
          </div>
        </div>

        {/* Term Tabs */}
        {reports.length > 0 && (
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {availableTerms.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTerm(t)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedTerm === t
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {t === 'all' ? 'All Term Evaluations' : `Term: ${t}`}
              </button>
            ))}
          </div>
        )}

        {/* Report Cards Feed */}
        {loading ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 animate-pulse space-y-6">
            <div className="h-6 w-48 bg-slate-800 rounded-md mx-auto"></div>
            <div className="h-20 bg-slate-800/60 rounded-xl"></div>
            <div className="h-40 bg-slate-800/40 rounded-xl"></div>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 p-12 rounded-3xl text-center text-slate-500 text-sm">
            No published report cards found for Session {selectedSession}.
          </div>
        ) : (
          <div className="space-y-10">
            {filteredReports.map((report) => (
              <div
                key={report._id}
                className="bg-white text-slate-900 rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-200 space-y-8 relative overflow-hidden print:p-0 print:border-none print:shadow-none"
              >
                {/* School Certificate Header */}
                <div className="text-center pb-6 border-b border-slate-200 space-y-2">
                  <div className="inline-flex items-center space-x-2 bg-[#0F2942] text-amber-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                    <GraduationCap className="w-4 h-4" />
                    <span>K.A.S. INTERNATIONAL SCHOOL • BHOPAL</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F2942]">{report.examName}</h2>
                  <p className="text-xs text-slate-500">
                    Khajuri Kalan Road, Regal Town, BHEL / Awadhpuri, Bhopal, Madhya Pradesh 462022
                  </p>
                  <div className="flex justify-center items-center space-x-3 text-xs font-bold text-slate-700 pt-1">
                    <span className="bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-md">
                      Academic Session: {report.session || selectedSession}
                    </span>
                    <span>•</span>
                    <span className="bg-blue-100 text-blue-900 px-2.5 py-0.5 rounded-md">
                      Term Code: {report.termCode || 'SA1'}
                    </span>
                  </div>
                </div>

                {/* Student Bio Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold block">Student Scholar</span>
                    <strong className="text-slate-900 text-sm">{report.studentName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block">Admission No</span>
                    <strong className="text-slate-900 font-mono text-sm">{report.admissionNo}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block">Grade & Section</span>
                    <strong className="text-slate-900 text-sm">{report.grade}-{report.section}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block">Session Attendance</span>
                    <strong className="text-emerald-700 text-sm">{report.attendancePercentage || 96}% Present</strong>
                  </div>
                </div>

                {/* Marks Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b-2 border-slate-300 bg-slate-100 text-slate-700 font-bold uppercase tracking-wider">
                        <th className="py-3 px-4">Subject Scholastic Domain</th>
                        <th className="py-3 px-4 text-center">Maximum Marks</th>
                        <th className="py-3 px-4 text-center">Marks Obtained</th>
                        <th className="py-3 px-4 text-center">Letter Grade</th>
                        <th className="py-3 px-4">Qualitative Faculty Remark</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700">
                      {report.subjects?.map((sub: any, i: number) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="py-3.5 px-4 font-bold text-slate-900">{sub.name}</td>
                          <td className="py-3.5 px-4 text-center font-semibold text-slate-500">{sub.maxMarks}</td>
                          <td className="py-3.5 px-4 text-center font-extrabold text-blue-900 text-sm">{sub.marksObtained}</td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="bg-amber-100 text-amber-900 font-extrabold text-xs px-2.5 py-1 rounded-md">
                              {sub.grade}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 italic">{sub.remarks}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-slate-300 bg-slate-100/90 font-bold text-xs text-slate-900">
                        <td className="py-3.5 px-4">Cumulative Total & Overall Score</td>
                        <td className="py-3.5 px-4 text-center">{report.totalMaxMarks}</td>
                        <td className="py-3.5 px-4 text-center font-extrabold text-[#0F2942] text-sm">
                          {report.totalMarksObtained}
                        </td>
                        <td className="py-3.5 px-4 text-center font-extrabold text-amber-800 text-sm">
                          Grade: {report.overallGrade}
                        </td>
                        <td className="py-3.5 px-4 font-extrabold text-emerald-800">
                          Aggregate: {report.percentage}%
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Remarks & Signatures */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200 text-xs">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <p className="font-bold text-slate-900">Faculty In-Charge Evaluation:</p>
                    <p className="text-slate-600 italic">"{report.facultyRemarks}"</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <p className="font-bold text-slate-900">Principal's Commendation:</p>
                    <p className="text-slate-600 italic">"{report.principalRemarks || 'Promoted with academic distinction.'}"</p>
                  </div>
                </div>

                {/* Verification & Signature Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pt-8 text-xs text-slate-500 border-t border-slate-100">
                  <div className="space-y-0.5">
                    <p className="text-[11px] text-slate-700">
                      Issued by: <strong>{report.issuedBy || 'Faculty Cell'}</strong>
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Issue Date: {report.issueDate || '2026-08-20'} • Official Verification ID: KAS-RC-{report._id?.slice(-6).toUpperCase()}
                    </p>
                  </div>

                  <div className="flex items-center space-x-12">
                    <div className="text-center">
                      <div className="w-32 border-b border-slate-300 mb-1"></div>
                      <p className="font-semibold text-slate-700 text-[11px]">Class Teacher</p>
                    </div>
                    <div className="text-center">
                      <div className="w-32 border-b border-slate-300 mb-1"></div>
                      <p className="font-semibold text-slate-700 text-[11px]">Principal & Dean</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ErpLayout>
  );
}
