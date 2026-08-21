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
} from 'lucide-react';
import { ErpLayout } from '@/components/erp/ErpLayout';

export default function StudentReportCardPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/grades')
      .then((res) => res.json())
      .then((data) => {
        if (data.records) setReports(data.records);
      })
      .catch((err) => console.error('Report card error:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ErpLayout requiredRole="student">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Digital Scholastic Report Card</h1>
            <p className="text-xs text-slate-400">
              Official term evaluation statements, subject-wise marks, percentage, and qualitative mentor remarks.
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center space-x-2 self-start"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Report Card</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-16 text-slate-500 text-sm">Loading Scholastic Records...</div>
        ) : reports.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 p-12 rounded-2xl text-center text-slate-500 text-sm">
            No published report cards found for this session.
          </div>
        ) : (
          <div className="space-y-8">
            {reports.map((report) => (
              <div
                key={report._id}
                className="bg-white text-slate-900 rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200 space-y-8 relative overflow-hidden"
              >
                {/* Top Badge */}
                <div className="text-center pb-6 border-b border-slate-200 space-y-2">
                  <div className="inline-flex items-center space-x-2 bg-[#0F2942] text-amber-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                    <GraduationCap className="w-4 h-4" />
                    <span>K.A.S. INTERNATIONAL SCHOOL • BHOPAL</span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-[#0F2942]">{report.examName}</h2>
                  <p className="text-xs text-slate-500">
                    Academic Year: {report.academicYear || '2026-2027'} • Affiliated CBSE Curriculum Standards
                  </p>
                </div>

                {/* Student Info Card */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold block">Student Name</span>
                    <strong className="text-slate-900 text-sm">{report.studentName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block">Admission Number</span>
                    <strong className="text-slate-900 font-mono text-sm">{report.admissionNo}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block">Grade & Section</span>
                    <strong className="text-slate-900 text-sm">{report.grade}-{report.section}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block">Attendance Score</span>
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
                      <tr className="border-t-2 border-slate-300 bg-slate-100/80 font-bold text-xs text-slate-900">
                        <td className="py-3.5 px-4">Cumulative Total & Overall Score</td>
                        <td className="py-3.5 px-4 text-center">{report.totalMaxMarks}</td>
                        <td className="py-3.5 px-4 text-center font-extrabold text-[#0F2942] text-sm">
                          {report.totalMarksObtained}
                        </td>
                        <td className="py-3.5 px-4 text-center font-extrabold text-amber-800 text-sm">
                          Grade: {report.overallGrade}
                        </td>
                        <td className="py-3.5 px-4 font-extrabold text-emerald-800">
                          Overall Percentage: {report.percentage}%
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

                {/* Signature Bar */}
                <div className="flex justify-between items-end pt-8 text-xs text-slate-500">
                  <div className="text-center">
                    <div className="w-32 border-b border-slate-300 mb-1"></div>
                    <p className="font-semibold text-slate-700">Class Teacher</p>
                  </div>
                  <div className="text-center">
                    <div className="w-32 border-b border-slate-300 mb-1"></div>
                    <p className="font-semibold text-slate-700">Principal & Dean</p>
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
