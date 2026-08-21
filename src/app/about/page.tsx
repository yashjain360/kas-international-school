'use client';

import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Award,
  BookOpen,
  ShieldCheck,
  Compass,
  HeartHandshake,
  Lightbulb,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
        {/* Header Title */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-bold text-blue-900 uppercase tracking-wider bg-blue-100/60 border border-blue-200 px-3.5 py-1.5 rounded-full">
            Institutional Legacy & Vision
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F2942] tracking-tight">
            About K.A.S. International School
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            Established with a mission to deliver world-class schooling to the students of Bhopal, K.A.S. International School combines classical moral principles with modern global pedagogy.
          </p>
        </div>

        {/* Vision & Mission Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-xs border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-[#0F2942]">Our Vision</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              To be a beacon of scholastic excellence and ethical leadership in Madhya Pradesh, shaping self-disciplined, compassionate, and intellectually agile global citizens prepared for 21st-century opportunities.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xs border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center">
              <Lightbulb className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-[#0F2942]">Our Mission</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              To deliver holistic, experiential education grounded in CBSE standards, fostering critical reasoning, scientific innovation, athletic vigor, and deep cultural reverence in a safe, technologically advanced campus.
            </p>
          </div>
        </div>

        {/* Leadership Showcase */}
        <div className="space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider bg-amber-50 border border-amber-200 px-3 py-1 rounded-md">
              Governance & Mentorship
            </span>
            <h2 className="text-3xl font-extrabold text-[#0F2942]">Our School Leadership</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-xs border border-slate-200 flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-24 h-24 rounded-2xl bg-slate-200 overflow-hidden shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
                  alt="Surendra Singh Baghel"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-bold text-slate-900">Surendra Singh Baghel</h4>
                <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
                  Founder & Managing Director
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  A visionary educationist committed to transforming primary and secondary schooling in Bhopal with modern infrastructure, sports facilities, and high academic integrity.
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xs border border-slate-200 flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-24 h-24 rounded-2xl bg-slate-200 overflow-hidden shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80"
                  alt="Dr. Sunita Sharma"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-bold text-slate-900">Dr. Sunita Sharma</h4>
                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                  Principal & Academic Dean
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  With over 20 years of CBSE leadership experience, Dr. Sharma leads our faculty in adopting NEP 2020 pedagogical standards and experiential STEM laboratories.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Campus Facilities & Security */}
        <div className="bg-linear-to-b from-white to-slate-50 p-8 sm:p-12 rounded-3xl border border-slate-200 space-y-8">
          <div className="max-w-2xl space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0F2942]">
              World-Class Infrastructure in Bhopal
            </h3>
            <p className="text-slate-600 text-sm">
              Our campus at Regal Town, BHEL provides a nurturing sanctuary equipped for academic, athletic, and creative distinction.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
              <h5 className="font-bold text-sm text-slate-900">Safe & Secure Campus</h5>
              <p className="text-xs text-slate-600">
                100% CCTV coverage across all classrooms, corridors, playgrounds, and gates with verified security personnel.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <h5 className="font-bold text-sm text-slate-900">Smart Digital Classrooms</h5>
              <p className="text-xs text-slate-600">
                Interactive audio-visual panels, high-speed campus networking, and digital learning modules for immersive comprehension.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <Award className="w-6 h-6 text-amber-600" />
              <h5 className="font-bold text-sm text-slate-900">Composite Science & Robotics Lab</h5>
              <p className="text-xs text-slate-600">
                Well-equipped physics, chemistry, biology practical stations alongside early-grade robotics and electronics workbenches.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-4">
          <Link
            href="/admissions"
            className="inline-flex items-center space-x-2 bg-[#0F2942] hover:bg-blue-900 text-white font-bold px-8 py-3.5 rounded-xl shadow-md transition-all text-sm"
          >
            <span>Apply for 2026-27 Admissions</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </Link>
        </div>
      </div>
    </div>
  );
}
