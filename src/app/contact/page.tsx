'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Building,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    parentName: '',
    studentName: '',
    email: '',
    phone: '',
    targetGrade: 'General Inquiry',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

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
        setResult({ success: true, message: 'Message sent! Reference No: ' + data.enquiryNo });
        setFormData({
          parentName: '',
          studentName: '',
          email: '',
          phone: '',
          targetGrade: 'General Inquiry',
          message: '',
        });
      } else {
        setResult({ success: false, message: data.error || 'Failed to submit message.' });
      }
    } catch {
      setResult({ success: false, message: 'Network error. Please call +91 94259 92209.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto" data-aos="fade-up">
          <span className="text-xs font-bold text-blue-900 uppercase tracking-wider bg-blue-100/60 border border-blue-200 px-3.5 py-1.5 rounded-full">
            Campus Secretariat & Location
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F2942] tracking-tight">
            Connect With K.A.S. International
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            We are conveniently located in Bhopal at Regal Town, BHEL / Khajuri Kalan. Visit our admissions desk or drop us an inquiry below.
          </p>
        </div>

        {/* 2-Column: Details and Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Campus Details */}
          <div className="lg:col-span-5 space-y-6" data-aos="fade-right">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-slate-200 space-y-6">
              <h3 className="text-xl font-bold text-[#0F2942]">Campus Coordinates</h3>

              <div className="space-y-4 text-xs text-slate-700">
                <div className="flex items-start space-x-3.5">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Official Address</p>
                    <p className="text-slate-600 mt-0.5 leading-relaxed">
                      Khajuri Kalan Road, Near Krishna Mandir, Regal Town, BHEL / Awadhpuri, Bhopal, Madhya Pradesh 462022
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-900 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Admissions & General Desk</p>
                    <p className="text-slate-600 mt-0.5">+91 94259 92209 / +91 755 298 4400</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-900 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Secretariat Email</p>
                    <p className="text-slate-600 mt-0.5">admissions@kasinternationalschool.org</p>
                    <p className="text-slate-500">info@thewebvale.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-900 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Campus Working Hours</p>
                    <p className="text-slate-600 mt-0.5">Monday – Saturday: 08:00 AM to 03:30 PM</p>
                    <p className="text-slate-500 text-[11px]">(Closed on Gazette Holidays & Sundays)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Transport Route Node Map summary */}
            <div className="bg-[#0F2942] text-white p-6 rounded-2xl space-y-3" data-aos="fade-up" data-aos-delay="100">
              <h4 className="font-bold text-sm text-amber-400">Bus Transport Connectivity</h4>
              <p className="text-xs text-slate-200 leading-relaxed">
                Dedicated fleet servicing Regal Town, Awadhpuri, Piplani, Govindpura, Indrapuri, Ayodhya Bypass, and Anand Nagar.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Inquiry Form */}
          <div className="lg:col-span-7" data-aos="fade-left">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-200 space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-xl font-bold text-[#0F2942]">Send an Institutional Inquiry</h3>
                <p className="text-xs text-slate-500">Our administrative desk will reply via phone or official email</p>
              </div>

              {result && (
                <div
                  className={`p-3.5 rounded-xl text-xs font-medium ${
                    result.success
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                      : 'bg-red-50 text-red-900 border border-red-200'
                  }`}
                >
                  {result.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Rajesh Khanna"
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Student / Ward Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aanya Khanna"
                      value={formData.studentName}
                      onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Contact Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98260 00000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="parent@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Nature of Inquiry</label>
                  <select
                    value={formData.targetGrade}
                    onChange={(e) => setFormData({ ...formData, targetGrade: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-800 bg-white"
                  >
                    <option value="Admission Consultation">Admission Consultation (2026-27)</option>
                    <option value="Fee Structure & Payment">Fee Structure & Payment Inquiries</option>
                    <option value="Bus Transport Route Query">Bus Transport Route Query</option>
                    <option value="Scholastic & Curriculum Details">Scholastic & Curriculum Details</option>
                    <option value="General Administration">General Administration & Appointments</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Detailed Message *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide details regarding your inquiry..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-800"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#0F2942] hover:bg-blue-900 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-amber-400" />
                  <span>{submitting ? 'Transmitting Message...' : 'Send Inquiry to Campus Desk'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
