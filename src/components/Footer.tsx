'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Award,
  BookOpen,
  ArrowUpRight,
} from 'lucide-react';

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/erp')) return null;

  return (
    <footer className="bg-[#0A1D30] text-slate-300 border-t border-slate-800">
      {/* Upper Admissions & Helpline Bar */}
      <div className="bg-[#0F2942] py-8 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Admissions Desk Direct</p>
              <p className="text-lg font-bold text-white">+91 94259 92209 / +91 755 298 4400</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Administrative Secretariat</p>
              <p className="text-base font-bold text-white">admissions@kasinternationalschool.org</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Campus Working Hours</p>
              <p className="text-sm font-semibold text-white">Mon – Sat: 08:00 AM – 03:30 PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Col 1: About School */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-900 font-bold">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-white font-extrabold text-lg tracking-tight">K.A.S. INTERNATIONAL</h3>
              <p className="text-xs text-amber-400 font-medium">Bhopal • Established 2024</p>
            </div>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Committed to nurturing holistic intellectual curiosity, moral leadership, and scientific innovation through a modern, experiential CBSE-aligned curriculum in Bhopal.
          </p>
          <div className="pt-2 flex items-center space-x-3 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Safe Campus • CCTV Monitored • Verified Staff</span>
          </div>
        </div>

        {/* Col 2: Academic Wings */}
        <div className="space-y-4">
          <h4 className="text-white font-bold text-base tracking-wide border-l-2 border-amber-400 pl-3">
            Scholastic Programs
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link href="/academics" className="hover:text-amber-400 transition-colors flex items-center justify-between">
                <span>Early Years & Foundational Wing</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
              </Link>
            </li>
            <li>
              <Link href="/academics" className="hover:text-amber-400 transition-colors flex items-center justify-between">
                <span>Primary School (Grades 1 to 5)</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
              </Link>
            </li>
            <li>
              <Link href="/academics" className="hover:text-amber-400 transition-colors flex items-center justify-between">
                <span>Middle School (Grades 6 to 8)</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
              </Link>
            </li>
            <li>
              <Link href="/academics" className="hover:text-amber-400 transition-colors flex items-center justify-between">
                <span>Secondary Academic Wing (Grades 9 & 10)</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
              </Link>
            </li>
            <li>
              <Link href="/academics" className="hover:text-amber-400 transition-colors flex items-center justify-between">
                <span>STEM & Robotics Innovation Lab</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Admissions & Institutional Portals */}
        <div className="space-y-4">
          <h4 className="text-white font-bold text-base tracking-wide border-l-2 border-amber-400 pl-3">
            Quick Portals & Notices
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link href="/admissions" className="text-amber-300 font-semibold hover:text-amber-400 transition-colors">
                • Online Admission Application 2026-27
              </Link>
            </li>
            <li>
              <Link href="/fee-structure" className="hover:text-amber-400 transition-colors">
                • Grade-wise Fee Schedules & Policies
              </Link>
            </li>
            <li>
              <Link href="/notices" className="hover:text-amber-400 transition-colors">
                • Official Circulars & Examination Board Notices
              </Link>
            </li>
            <li>
              <Link href="/faculty" className="hover:text-amber-400 transition-colors">
                • Department Faculty & Academic In-Charges
              </Link>
            </li>
            <li>
              <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                • Student & Parent ERP Login
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Campus Location */}
        <div className="space-y-4">
          <h4 className="text-white font-bold text-base tracking-wide border-l-2 border-amber-400 pl-3">
            Campus Headquarters
          </h4>
          <div className="space-y-3 text-sm text-slate-400">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <span>
                Khajuri Kalan Road, Near Krishna Mandir, Regal Town, BHEL / Awadhpuri, Bhopal, Madhya Pradesh 462022
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
              <p className="text-amber-300 font-semibold mb-1">Affiliation & Accreditation Status</p>
              <p>Recognized Private School Board Affiliated Curriculum conforming to NCERT & NEP 2020 national norms.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="bg-[#061422] py-6 pb-24 lg:pb-6 px-4 sm:px-8 border-t border-slate-800 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 K.A.S. International School, Bhopal. All Rights Reserved.</p>
          <div className="flex items-center space-x-6">
            <Link href="/contact" className="hover:text-slate-200">Parent Grievance Cell</Link>
            <Link href="/contact" className="hover:text-slate-200">Anti-Ragging Policy</Link>
            <Link href="/contact" className="hover:text-slate-200">Campus Safety Charter</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
