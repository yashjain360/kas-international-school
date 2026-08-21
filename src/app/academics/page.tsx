'use client';

import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Award,
  Sparkles,
  Compass,
  FileCheck2,
  Atom,
  Languages,
  Calculator,
  Laptop,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';

export default function AcademicsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto" data-aos="fade-up">
          <span className="text-xs font-bold text-blue-900 uppercase tracking-wider bg-blue-100/60 border border-blue-200 px-3.5 py-1.5 rounded-full">
            CBSE & NEP 2020 Pedagogical Framework
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F2942] tracking-tight">
            Academic Excellence & Curriculum
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            A carefully sequenced, inquiry-based scholastic journey designed to nurture foundational literacy, analytical mastery, and scientific innovation at every stage of schooling.
          </p>
        </div>

        {/* 4 Academic Wings Detailed */}
        <div className="space-y-10">
          {/* Wing 1: Foundational */}
          <div
            className="bg-white p-8 rounded-2xl shadow-xs border border-slate-200 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center"
            data-aos="fade-up"
          >
            <div className="space-y-3">
              <span className="text-xs font-bold text-amber-700 uppercase bg-amber-50 px-2.5 py-1 rounded-md">
                Ages 3 to 6 Years
              </span>
              <h3 className="text-2xl font-bold text-[#0F2942]">Foundational & Kindergarten Wing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Nursery, Lower KG, and Upper KG focus on tactile play, phonetics, foundational numeracy, motor skill enhancement, and emotional expression.
              </p>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700">
              <div className="p-4 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100" data-aos="zoom-in" data-aos-delay="100">
                <span className="font-bold text-slate-900 flex items-center">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
                  Language & Phonics
                </span>
                <p className="text-slate-500">Jolly phonics, storytelling, rhymes, and visual word identification.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100" data-aos="zoom-in" data-aos-delay="200">
                <span className="font-bold text-slate-900 flex items-center">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
                  Experiential Math & Logic
                </span>
                <p className="text-slate-500">Number blocks, sorting, geometric identification, and spatial sequencing.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100" data-aos="zoom-in" data-aos-delay="300">
                <span className="font-bold text-slate-900 flex items-center">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
                  Creative Arts & Music
                </span>
                <p className="text-slate-500">Clay modeling, finger painting, rhythm circles, and dramatic role-play.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100" data-aos="zoom-in" data-aos-delay="400">
                <span className="font-bold text-slate-900 flex items-center">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
                  Motor & Social Hygiene
                </span>
                <p className="text-slate-500">Outdoor play, balance beams, collaborative lunch circles, and good manners.</p>
              </div>
            </div>
          </div>

          {/* Wing 2: Primary */}
          <div
            className="bg-white p-8 rounded-2xl shadow-xs border border-slate-200 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center"
            data-aos="fade-up"
          >
            <div className="space-y-3">
              <span className="text-xs font-bold text-blue-700 uppercase bg-blue-50 px-2.5 py-1 rounded-md">
                Grades 1 to 5
              </span>
              <h3 className="text-2xl font-bold text-[#0F2942]">Primary School Wing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Structured transition from early childhood to core academic disciplines. Focus on structured reading, computational mathematics, environmental sciences, and bilingual fluency.
              </p>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700">
              <div className="p-4 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100" data-aos="zoom-in" data-aos-delay="100">
                <span className="font-bold text-slate-900 flex items-center">
                  <Languages className="w-3.5 h-3.5 text-blue-600 mr-1.5" />
                  Language Arts (English & Hindi)
                </span>
                <p className="text-slate-500">Grammar fundamentals, reading comprehension, creative composition, and public speaking.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100" data-aos="zoom-in" data-aos-delay="200">
                <span className="font-bold text-slate-900 flex items-center">
                  <Calculator className="w-3.5 h-3.5 text-blue-600 mr-1.5" />
                  Applied Mathematics
                </span>
                <p className="text-slate-500">Vedic arithmetic concepts, word problems, measurement, and mental math drills.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100" data-aos="zoom-in" data-aos-delay="300">
                <span className="font-bold text-slate-900 flex items-center">
                  <Atom className="w-3.5 h-3.5 text-blue-600 mr-1.5" />
                  Environmental Studies (EVS)
                </span>
                <p className="text-slate-500">Ecology, flora & fauna of Madhya Pradesh, civic awareness, and basic physical sciences.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100" data-aos="zoom-in" data-aos-delay="400">
                <span className="font-bold text-slate-900 flex items-center">
                  <Laptop className="w-3.5 h-3.5 text-blue-600 mr-1.5" />
                  Computer & Digital Literacy
                </span>
                <p className="text-slate-500">Keyboarding, introductory algorithms, paint tools, and safe internet awareness.</p>
              </div>
            </div>
          </div>

          {/* Wing 3: Middle & Secondary */}
          <div
            className="bg-white p-8 rounded-2xl shadow-xs border border-slate-200 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center"
            data-aos="fade-up"
          >
            <div className="space-y-3">
              <span className="text-xs font-bold text-emerald-700 uppercase bg-emerald-50 px-2.5 py-1 rounded-md">
                Grades 6 to 10
              </span>
              <h3 className="text-2xl font-bold text-[#0F2942]">Middle & Secondary Board Wing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Comprehensive subject specialization in Physics, Chemistry, Biology, Advanced Mathematics, Social Sciences (History, Civics, Geography), English Literature, and third language options.
              </p>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700">
              <div className="p-4 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100" data-aos="zoom-in" data-aos-delay="100">
                <span className="font-bold text-slate-900 flex items-center">
                  <Atom className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
                  Pure Sciences & Laboratory
                </span>
                <p className="text-slate-500">Hands-on practical experiments, scientific methodology, and CBSE board practical manuals.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100" data-aos="zoom-in" data-aos-delay="200">
                <span className="font-bold text-slate-900 flex items-center">
                  <Compass className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
                  Social Sciences & Heritage
                </span>
                <p className="text-slate-500">Indian constitutional framework, global historical events, economic basics, and map studies.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100" data-aos="zoom-in" data-aos-delay="300">
                <span className="font-bold text-slate-900 flex items-center">
                  <Laptop className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
                  AI & Computational Thinking
                </span>
                <p className="text-slate-500">Python programming fundamentals, data basics, robotics microcontrollers, and logic gates.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100" data-aos="zoom-in" data-aos-delay="400">
                <span className="font-bold text-slate-900 flex items-center">
                  <FileCheck2 className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
                  Pre-Board & Olympiad Training
                </span>
                <p className="text-slate-500">Regular unit evaluations, mock board drills, NTSE, and Science Olympiad coaching.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Assessment Pattern & Grading System */}
        <div className="bg-linear-to-b from-[#0F2942] to-[#1E3A8A] text-white p-8 sm:p-12 rounded-3xl space-y-6" data-aos="fade-up">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider bg-white/10 px-3 py-1 rounded-md">
              Evaluation Norms
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold">Continuous & Comprehensive Evaluation</h3>
            <p className="text-xs sm:text-sm text-slate-200">
              Students receive digital report cards at the end of each term, tracking scholastic performance (subject marks, percentages, grades) alongside co-scholastic attributes (discipline, teamwork, attendance).
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-white/10 p-4 rounded-xl border border-white/10" data-aos="zoom-in" data-aos-delay="100">
              <p className="text-xl font-extrabold text-amber-400">Term 1</p>
              <p className="text-xs text-slate-300">Formative & Mid-Term Exam</p>
            </div>
            <div className="bg-white/10 p-4 rounded-xl border border-white/10" data-aos="zoom-in" data-aos-delay="200">
              <p className="text-xl font-extrabold text-amber-400">Term 2</p>
              <p className="text-xs text-slate-300">Annual Comprehensive Exam</p>
            </div>
            <div className="bg-white/10 p-4 rounded-xl border border-white/10" data-aos="zoom-in" data-aos-delay="300">
              <p className="text-xl font-extrabold text-white">Periodic Drills</p>
              <p className="text-xs text-slate-300">4 Unit Assessments / Year</p>
            </div>
            <div className="bg-white/10 p-4 rounded-xl border border-white/10" data-aos="zoom-in" data-aos-delay="400">
              <p className="text-xl font-extrabold text-white">ERP Portal</p>
              <p className="text-xs text-slate-300">Instant Online Report Cards</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4" data-aos="fade-up">
          <Link
            href="/admissions"
            className="inline-flex items-center space-x-2 bg-[#0F2942] hover:bg-blue-900 text-white font-bold px-8 py-3.5 rounded-xl shadow-md transition-all text-sm"
          >
            <span>Inquire About Grade Admissions</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </Link>
        </div>
      </div>
    </div>
  );
}
