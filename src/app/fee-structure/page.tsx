'use client';

import React from 'react';
import Link from 'next/link';
import {
  CreditCard,
  ShieldCheck,
  Calendar,
  CheckCircle,
  HelpCircle,
  FileSpreadsheet,
  ArrowRight,
  UserCheck,
} from 'lucide-react';

export default function FeeStructurePage() {
  const feeTiers = [
    {
      wing: 'Foundational Wing (Nursery & KG)',
      grades: 'Nursery, LKG, UKG',
      tuition: '₹14,500',
      composite: '₹4,500',
      quarterly: '₹19,000',
      annual: '₹76,000',
      highlights: 'Activity books, Montessori apparatus, smart nursery toys included',
    },
    {
      wing: 'Primary Wing (Grades 1 to 5)',
      grades: 'Class I to Class V',
      tuition: '₹18,500',
      composite: '₹6,000',
      quarterly: '₹24,500',
      annual: '₹98,000',
      highlights: 'Computer lab, Vedic math worksheets, sports coaching, language lab',
    },
    {
      wing: 'Middle Wing (Grades 6 to 8)',
      grades: 'Class VI to Class VIII',
      tuition: '₹21,000',
      composite: '₹7,500',
      quarterly: '₹28,500',
      annual: '₹1,14,000',
      highlights: 'Composite science practicals, robotics workshop kits, library access',
    },
    {
      wing: 'Secondary Wing (Grades 9 & 10)',
      grades: 'Class IX & Class X',
      tuition: '₹24,000',
      composite: '₹8,500',
      quarterly: '₹32,500',
      annual: '₹1,30,000',
      highlights: 'Physics/Chem/Bio dedicated labs, pre-board test series, career guidance',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-bold text-blue-900 uppercase tracking-wider bg-blue-100/60 border border-blue-200 px-3.5 py-1.5 rounded-full">
            Transparent & Regulated Structure
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F2942] tracking-tight">
            Fee Schedule & Installment Policy
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            Academic Session 2026–2027. Transparent fee slabs with quarterly installment options and seamless digital fee tracking via the student ERP portal.
          </p>
        </div>

        {/* Master Fee Table */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="p-6 bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-lg text-amber-400">Scholastic Grade Fee Schedule (2026–27)</h3>
              <p className="text-xs text-slate-300">All figures in Indian National Rupees (INR)</p>
            </div>
            <Link
              href="/auth/login"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5"
            >
              <UserCheck className="w-4 h-4" />
              <span>Login to Student Fee Ledger</span>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Academic Wing</th>
                  <th className="py-3.5 px-4">Grades Included</th>
                  <th className="py-3.5 px-4">Tuition (Quarterly)</th>
                  <th className="py-3.5 px-4">Development & Labs</th>
                  <th className="py-3.5 px-4">Total Quarterly Due</th>
                  <th className="py-3.5 px-4">Annual Total</th>
                  <th className="py-3.5 px-4">Key Inclusions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {feeTiers.map((tier, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-900">{tier.wing}</td>
                    <td className="py-4 px-4 font-semibold text-blue-900">{tier.grades}</td>
                    <td className="py-4 px-4">{tier.tuition}</td>
                    <td className="py-4 px-4">{tier.composite}</td>
                    <td className="py-4 px-4 font-extrabold text-[#0F2942] text-sm">{tier.quarterly}</td>
                    <td className="py-4 px-4 font-bold text-slate-800">{tier.annual}</td>
                    <td className="py-4 px-4 text-slate-500 text-[11px] max-w-xs">{tier.highlights}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4 Quarterly Due Dates */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md">Installment 1</span>
            <h4 className="font-bold text-sm text-slate-900">Quarter 1 (Apr – Jun)</h4>
            <p className="text-xs text-red-600 font-semibold">Due on or before April 15, 2026</p>
            <p className="text-[11px] text-slate-500">Includes admission composite reconciliation.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md">Installment 2</span>
            <h4 className="font-bold text-sm text-slate-900">Quarter 2 (Jul – Sep)</h4>
            <p className="text-xs text-red-600 font-semibold">Due on or before July 15, 2026</p>
            <p className="text-[11px] text-slate-500">Includes mid-term assessment materials.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md">Installment 3</span>
            <h4 className="font-bold text-sm text-slate-900">Quarter 3 (Oct – Dec)</h4>
            <p className="text-xs text-red-600 font-semibold">Due on or before October 15, 2026</p>
            <p className="text-[11px] text-slate-500">Includes sports meet & annual fest events.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md">Installment 4</span>
            <h4 className="font-bold text-sm text-slate-900">Quarter 4 (Jan – Mar)</h4>
            <p className="text-xs text-red-600 font-semibold">Due on or before January 15, 2027</p>
            <p className="text-[11px] text-slate-500">Includes pre-board & annual report card clearance.</p>
          </div>
        </div>

        {/* Transport & Concession Policy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-xs border border-slate-200 space-y-4">
            <h3 className="text-xl font-bold text-[#0F2942] flex items-center">
              <CreditCard className="w-5 h-5 text-amber-500 mr-2" />
              School Bus & Transport Slabs
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Air-conditioned, GPS-enabled buses with verified drivers and female attendants covering major nodes in Bhopal:
            </p>
            <ul className="text-xs space-y-2 text-slate-700">
              <li className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="font-semibold">Slab 1 (Regal Town, Khajuri Kalan, Piplani)</span>
                <span className="font-bold text-slate-900">₹3,500 / Quarter</span>
              </li>
              <li className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="font-semibold">Slab 2 (Awadhpuri, BHEL Gate 1-5, Govindpura)</span>
                <span className="font-bold text-slate-900">₹4,500 / Quarter</span>
              </li>
              <li className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="font-semibold">Slab 3 (Ayodhya Bypass, Anand Nagar, Indrapuri)</span>
                <span className="font-bold text-slate-900">₹5,200 / Quarter</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xs border border-slate-200 space-y-4">
            <h3 className="text-xl font-bold text-[#0F2942] flex items-center">
              <ShieldCheck className="w-5 h-5 text-emerald-600 mr-2" />
              Scholarships & Sibling Concession
            </h3>
            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <p className="font-bold text-emerald-950">Sibling Fee Rebate</p>
                <p className="text-emerald-800">10% concession on tuition fee for the younger sibling enrolled concurrently.</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                <p className="font-bold text-blue-950">Merit Scholastic Scholarship</p>
                <p className="text-blue-800">Up to 25% tuition waiver for students scoring 95%+ in state/national Olympiads.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link
            href="/admissions"
            className="inline-flex items-center space-x-2 bg-[#0F2942] hover:bg-blue-900 text-white font-bold px-8 py-3.5 rounded-xl shadow-md transition-all text-sm"
          >
            <span>Proceed to Admission Registration</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </Link>
        </div>
      </div>
    </div>
  );
}
