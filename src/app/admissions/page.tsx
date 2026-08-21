'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Calendar,
  CheckCircle2,
  FileText,
  Phone,
  Mail,
  Send,
  AlertCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

export default function AdmissionsPage() {
  const [formData, setFormData] = useState({
    parentName: '',
    studentName: '',
    email: '',
    phone: '',
    targetGrade: 'Grade 1',
    previousSchool: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; enquiryNo?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        setResult({
          success: true,
          message: data.message || 'Application registered successfully.',
          enquiryNo: data.enquiryNo,
        });
        setFormData({
          parentName: '',
          studentName: '',
          email: '',
          phone: '',
          targetGrade: 'Grade 1',
          previousSchool: '',
          message: '',
        });
      } else {
        setResult({ success: false, message: data.error || 'Submission failed.' });
      }
    } catch {
      setResult({ success: false, message: 'Network error. Please call +91 94259 92209 for instant registration.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto" data-aos="fade-up">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider bg-amber-100/70 border border-amber-300 px-3.5 py-1.5 rounded-full">
            Admissions Academic Session 2026–2027
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F2942] tracking-tight">
            Join the K.A.S. International Family
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            We welcome aspirational learners from Nursery to Grade 10. Follow our simple, transparent admission procedure or submit the online registration form below.
          </p>
        </div>

        {/* 2-Column: Left Guidelines & Checklist, Right Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Guidelines & Documents */}
          <div className="lg:col-span-6 space-y-8" data-aos="fade-right">
            {/* Age Criteria Table */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-slate-200 space-y-4">
              <h3 className="text-lg font-bold text-[#0F2942] flex items-center">
                <Calendar className="w-5 h-5 text-amber-500 mr-2" />
                Age Eligibility Criteria (as on March 31, 2026)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold">
                      <th className="py-2.5 px-3">Class / Grade</th>
                      <th className="py-2.5 px-3">Minimum Age</th>
                      <th className="py-2.5 px-3">Eligibility Requirement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">Nursery / Playgroup</td>
                      <td className="py-2.5 px-3">3+ Years</td>
                      <td className="py-2.5 px-3">Informal Parent Interaction</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">Kindergarten (KG 1 & 2)</td>
                      <td className="py-2.5 px-3">4+ to 5+ Years</td>
                      <td className="py-2.5 px-3">Foundational Phonetics Check</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">Grade 1 to Grade 5</td>
                      <td className="py-2.5 px-3">6+ Years onwards</td>
                      <td className="py-2.5 px-3">Previous School Progress Report</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">Grade 6 to Grade 10</td>
                      <td className="py-2.5 px-3">11+ Years onwards</td>
                      <td className="py-2.5 px-3">Scholastic Aptitude & Transfer Cert</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Document Checklist */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-slate-200 space-y-4">
              <h3 className="text-lg font-bold text-[#0F2942] flex items-center">
                <FileText className="w-5 h-5 text-blue-600 mr-2" />
                Required Documentation Checklist
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 shrink-0 mt-0.5" />
                  <span>Original Municipal Birth Certificate with 2 photocopies (for Nursery to Grade 1).</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 shrink-0 mt-0.5" />
                  <span>Countersigned Original Transfer Certificate (TC) from the previous recognized school.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 shrink-0 mt-0.5" />
                  <span>Photocopy of previous academic year report card / cumulative assessment sheet.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 shrink-0 mt-0.5" />
                  <span>4 recent passport-size colored photographs of the student and 2 of each parent.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 shrink-0 mt-0.5" />
                  <span>Photocopy of Student Aadhaar Card and Parent Address Proof (Electricity bill / Voter ID).</span>
                </li>
              </ul>
            </div>

            {/* Admissions Office Card */}
            <div className="bg-linear-to-br from-[#0F2942] to-[#1E3A8A] text-white p-6 rounded-2xl space-y-3">
              <h4 className="font-bold text-base text-amber-400">Direct Admissions Helpline</h4>
              <p className="text-xs text-slate-200 leading-relaxed">
                Parents are welcome to walk in directly between 08:30 AM and 03:00 PM (Monday to Saturday) to tour the campus and meet our admission counselors.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row gap-3 text-xs">
                <a href="tel:+919425992209" className="flex items-center text-white hover:text-amber-300 font-semibold">
                  <Phone className="w-4 h-4 mr-1.5 text-amber-400" />
                  +91 94259 92209
                </a>
                <a href="mailto:info@thewebvale.com" className="flex items-center text-white hover:text-amber-300 font-semibold">
                  <Mail className="w-4 h-4 mr-1.5 text-amber-400" />
                  admissions@kasinternationalschool.org
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Application Form */}
          <div className="lg:col-span-6" data-aos="fade-left">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-200 relative">
              <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0F2942]">Online Admission Application</h3>
                  <p className="text-xs text-slate-500">Instant registration with confirmation email dispatch</p>
                </div>
              </div>

              {result && (
                <div
                  className={`p-4 rounded-xl text-xs font-medium mb-6 ${
                    result.success
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                      : 'bg-red-50 text-red-900 border border-red-200'
                  }`}
                >
                  <p className="font-bold mb-1">{result.success ? '🎉 Application Received' : 'Notice'}</p>
                  <p>{result.message}</p>
                  {result.enquiryNo && (
                    <p className="mt-2 text-emerald-950 font-mono font-bold bg-emerald-100/60 p-2 rounded-md">
                      Registration Reference No: {result.enquiryNo}
                    </p>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">Parent / Guardian Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Rajesh Khanna"
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-800 bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">Student Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aanya Khanna"
                      value={formData.studentName}
                      onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-800 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">Seeking Admission To *</label>
                    <select
                      value={formData.targetGrade}
                      onChange={(e) => setFormData({ ...formData, targetGrade: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-800 bg-white font-medium"
                    >
                      <option value="Nursery / Playgroup">Nursery / Playgroup</option>
                      <option value="Kindergarten (KG 1 / KG 2)">Kindergarten (KG 1 / KG 2)</option>
                      <option value="Grade 1">Grade 1</option>
                      <option value="Grade 2">Grade 2</option>
                      <option value="Grade 3">Grade 3</option>
                      <option value="Grade 4">Grade 4</option>
                      <option value="Grade 5">Grade 5</option>
                      <option value="Grade 6">Grade 6</option>
                      <option value="Grade 7">Grade 7</option>
                      <option value="Grade 8">Grade 8</option>
                      <option value="Grade 9">Grade 9</option>
                      <option value="Grade 10">Grade 10</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">Contact Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98260 00000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-800 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="parent@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-800 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">Previous School Attended (if any)</label>
                  <input
                    type="text"
                    placeholder="e.g. St. Joseph Convent / DPS Bhopal"
                    value={formData.previousSchool}
                    onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-800 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">Special Requests / Questions</label>
                  <textarea
                    rows={3}
                    placeholder="Inquire regarding transport routes (BHEL, Awadhpuri, Ayodhya Bypass), second language, etc."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-800 bg-white"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#0F2942] hover:bg-blue-900 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-amber-400" />
                    <span>{submitting ? 'Submitting Application...' : 'Submit Official Admission Application'}</span>
                  </button>
                  <p className="text-[11px] text-slate-500 text-center mt-2.5">
                    * Submitting this form creates a priority CRM ticket in our Admissions Secretariat.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
