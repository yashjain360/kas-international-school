'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Award,
  BookOpen,
  Users,
  Compass,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Phone,
  Send,
  MapPin,
  Clock,
  Play,
  PlayCircle,
  X,
  Camera,
  Image as ImageIcon,
} from 'lucide-react';

export default function HomePage() {
  const [formData, setFormData] = useState({
    parentName: '',
    studentName: '',
    email: '',
    phone: '',
    targetGrade: 'Grade 1',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<{ title: string; category: string; description: string; poster: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        setStatusMessage({
          type: 'success',
          text: `Inquiry registered successfully! Reference No: ${data.enquiryNo}. Our admissions team will reach out.`,
        });
        setFormData({
          parentName: '',
          studentName: '',
          email: '',
          phone: '',
          targetGrade: 'Grade 1',
          message: '',
        });
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to submit inquiry.' });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Network error. Please try again or call +91 94259 92209.' });
    } finally {
      setSubmitting(false);
    }
  };

  const videoReels = [
    {
      title: 'Smart Classroom & Interactive Learning Experience',
      category: 'Academic Technology',
      duration: '2:15',
      poster: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80',
      description: 'Experience how our digital smart boards and student presentations transform daily classroom understanding in Bhopal.',
    },
    {
      title: 'Kindergarten Monsoon & Rainy Day Festivities',
      category: 'Early Childhood',
      duration: '1:45',
      poster: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=800&auto=format&fit=crop&q=80',
      description: 'Little scholars enjoying color-themed rainy day activities, umbrella rhymes, paper boats, and sensory play.',
    },
    {
      title: 'Grand Independence Day Celebration & March Past',
      category: 'National Festivals',
      duration: '3:20',
      poster: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=800&auto=format&fit=crop&q=80',
      description: 'Patriotic parade, flag hoisting ceremony by Chairman Surendra Singh Baghel, and cultural stage performances.',
    },
    {
      title: 'Science Lab & Robotics Innovation Conclave',
      category: 'STEM & Practical',
      duration: '2:50',
      poster: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80',
      description: 'Hands-on practical physics experiments, math symmetry art projects, and robotics microcontroller demonstrations.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-linear-to-b from-[#0F2942] via-[#133352] to-[#0A1D30] text-white py-16 lg:py-24">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6" data-aos="fade-right" data-aos-duration="1000">
            <div className="inline-flex items-center space-x-2 bg-amber-500/15 border border-amber-400/30 px-3.5 py-1.5 rounded-full text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Admissions Open For Academic Year 2026–2027</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Igniting Intellect, <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 via-amber-200 to-yellow-400">
                Nurturing Character.
              </span>
            </h1>

            <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">
              Welcome to <strong>K.A.S. International School, Bhopal</strong> (Khajuri Kalan Road, Regal Town, BHEL). We provide an inspiring learning ecosystem where academic rigor meets modern STEM innovation, creative arts, and global moral leadership.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/admissions"
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all flex items-center justify-center space-x-2 text-sm"
              >
                <span>Apply for Admission</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/auth/login"
                className="bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold px-6 py-3.5 rounded-xl backdrop-blur-xs transition-all flex items-center justify-center space-x-2 text-sm"
              >
                <span>Student & Staff ERP</span>
                <ChevronRight className="w-4 h-4 text-amber-400" />
              </Link>
              <Link
                href="/gallery"
                className="bg-transparent hover:bg-white/5 text-amber-300 hover:text-white font-semibold px-4 py-3.5 rounded-xl transition-all flex items-center justify-center space-x-1 text-sm border border-amber-400/30"
              >
                <Camera className="w-4 h-4 mr-1 text-amber-400" />
                <span>Explore Media</span>
              </Link>
            </div>

            {/* Micro Highlights */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-6 border-t border-slate-700/60 max-w-lg" data-aos="fade-up" data-aos-delay="200">
              <div className="bg-white/5 sm:bg-transparent p-2 sm:p-0 rounded-lg text-center sm:text-left">
                <p className="text-xl sm:text-3xl font-extrabold text-amber-400">100%</p>
                <p className="text-[10px] sm:text-xs text-slate-400 font-medium">CBSE Standard</p>
              </div>
              <div className="bg-white/5 sm:bg-transparent p-2 sm:p-0 rounded-lg text-center sm:text-left">
                <p className="text-xl sm:text-3xl font-extrabold text-white">1:18</p>
                <p className="text-[10px] sm:text-xs text-slate-400 font-medium">Teacher Ratio</p>
              </div>
              <div className="bg-white/5 sm:bg-transparent p-2 sm:p-0 rounded-lg text-center sm:text-left">
                <p className="text-xl sm:text-3xl font-extrabold text-amber-400">30+</p>
                <p className="text-[10px] sm:text-xs text-slate-400 font-medium">Smart Labs</p>
              </div>
            </div>
          </div>

          {/* Hero Visual Card / Direct Quick Inquiry */}
          <div className="lg:col-span-5" data-aos="fade-left" data-aos-duration="1000" data-aos-delay="150">
            <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div>
                  <h3 className="font-bold text-lg text-[#0F2942]">Quick Admission Enquiry</h3>
                  <p className="text-xs text-slate-500">Session 2026–27 Consultation</p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-full">
                  Fast Response
                </span>
              </div>

              {statusMessage && (
                <div
                  className={`p-3.5 rounded-lg text-xs font-medium mb-4 ${
                    statusMessage.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {statusMessage.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Parent / Guardian Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Rajesh Khanna"
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-800"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Student Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aanya Khanna"
                      value={formData.studentName}
                      onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Seeking Grade *</label>
                    <select
                      value={formData.targetGrade}
                      onChange={(e) => setFormData({ ...formData, targetGrade: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-800 bg-white"
                    >
                      <option value="Nursery / Kindergarten">Nursery / Kindergarten</option>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone *</label>
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
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Any Specific Requirements</label>
                  <textarea
                    rows={2}
                    placeholder="Transport queries, second language preferences, etc."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-800"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#0F2942] hover:bg-blue-900 text-white font-bold py-3 rounded-lg text-sm transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-amber-400" />
                  <span>{submitting ? 'Submitting...' : 'Submit Admission Inquiry'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CAMPUS LIFE, PHOTOS & VIDEO REELS SHOWCASE */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4" data-aos="fade-up">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider bg-amber-100/70 border border-amber-300 px-3.5 py-1.5 rounded-full inline-flex items-center">
              <Camera className="w-3.5 h-3.5 mr-1.5 text-amber-700" />
              Live Campus Media & Video Reels
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F2942] tracking-tight">
              Life and Learning at K.A.S. International
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Explore authentic glimpses of smart classroom lectures, kindergarten rain celebrations, robotics workshops, Independence Day parades, and sports tournaments captured on our Bhopal campus.
            </p>
          </div>

          <Link
            href="/gallery"
            className="inline-flex items-center space-x-2 bg-[#0F2942] hover:bg-blue-900 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all shrink-0 self-start md:self-auto shadow-sm"
          >
            <span>View Full Photo & Video Gallery (18+ Media)</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
          </Link>
        </div>

        {/* 4 Video Reels Cards with Staggered AOS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {videoReels.map((reel, idx) => (
            <div
              key={idx}
              data-aos="zoom-in"
              data-aos-delay={idx * 100}
              onClick={() => setSelectedVideo(reel)}
              className="bg-white rounded-2xl overflow-hidden shadow-xs border border-slate-200 group hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={reel.poster}
                  alt={reel.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>
                <span className="absolute bottom-3 right-3 bg-black/80 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">
                  {reel.duration}
                </span>
                <span className="absolute top-3 left-3 bg-[#0F2942]/90 text-amber-400 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                  {reel.category}
                </span>
              </div>

              <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-2">
                    {reel.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {reel.description}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center text-[11px] font-semibold text-amber-700">
                  <PlayCircle className="w-3.5 h-3.5 mr-1" />
                  <span>Click to Watch Reel</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Video Player Modal */}
        {selectedVideo && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative text-white" data-aos="zoom-in">
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-2"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-md">
                  {selectedVideo.category}
                </span>
                <h3 className="text-xl font-bold text-white">{selectedVideo.title}</h3>
              </div>

              {/* Simulated Interactive Video Screen */}
              <div className="relative rounded-2xl overflow-hidden aspect-video bg-black border border-slate-800 flex items-center justify-center group">
                <img
                  src={selectedVideo.poster}
                  alt={selectedVideo.title}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 space-y-2">
                  <p className="text-xs text-slate-200 leading-relaxed max-w-xl">
                    {selectedVideo.description}
                  </p>
                  <div className="flex items-center space-x-3 text-xs text-amber-400 font-mono">
                    <span>📍 K.A.S. Campus • Bhopal</span>
                    <span>•</span>
                    <span>Session 2026-27 Highlights</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <p className="text-xs text-slate-400">Official K.A.S. International School Media Stream</p>
                <Link
                  href="/admissions"
                  className="bg-amber-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold shadow-md hover:bg-amber-400 transition-colors"
                >
                  Schedule Campus Walkthrough &rarr;
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 3. LEADERSHIP & FOUNDER MESSAGE */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full border-t border-slate-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6" data-aos="fade-right">
            <div className="inline-flex items-center space-x-2 text-blue-900 text-xs font-bold uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-md">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Chairman & Founder's Vision</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F2942] leading-tight">
              "Empowering Every Child to Learn, Excel, and Lead."
            </h2>
            <p className="text-slate-600 leading-relaxed text-base">
              At <strong>K.A.S. International School</strong>, our foundational belief is that education must go beyond rote memorization. Located in the heart of Regal Town, Bhopal, we have crafted a safe, high-technology, and deeply compassionate campus where every child's innate potential is recognized and cultivated.
            </p>
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-slate-800 space-y-2">
              <p className="font-bold text-sm text-[#0F2942]">Surendra Singh Baghel</p>
              <p className="text-xs text-amber-800 font-semibold">Founder & Managing Director • K.A.S. International School</p>
              <p className="text-xs text-slate-600 italic">
                "Our modern infrastructure and student-centric pedagogy ensure your ward is ready for India's best competitive frontiers."
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 bg-white rounded-xl shadow-xs border border-slate-200/80 space-y-3" data-aos="fade-up" data-aos-delay="100">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">CBSE Aligned Curriculum</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Conforming strictly to NEP 2020 frameworks, prioritizing analytical problem solving and scientific inquiry.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-xs border border-slate-200/80 space-y-3" data-aos="fade-up" data-aos-delay="200">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Robotics & STEM Labs</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hands-on coding, computational logic, AI awareness, and electronics experiments from early middle grades.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-xs border border-slate-200/80 space-y-3" data-aos="fade-up" data-aos-delay="300">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">360° Campus Safety</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Complete CCTV surveillance, GPS bus tracking, background-verified faculty, and dedicated female attendants.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-xs border border-slate-200/80 space-y-3" data-aos="fade-up" data-aos-delay="400">
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-900 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Dedicated Faculty Team</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Gold medalist educators, post-graduate subject masters, and child psychologists ensuring personalized mentoring.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FOUR ACADEMIC PILLARS */}
      <section className="bg-slate-100 py-16 px-4 sm:px-8 border-y border-slate-200">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto" data-aos="fade-up">
            <span className="text-xs font-bold text-blue-900 uppercase tracking-wider bg-blue-50 border border-blue-200 px-3 py-1 rounded-md">
              Comprehensive Growth
            </span>
            <h2 className="text-3xl font-extrabold text-[#0F2942]">Our Four Pillars of Schooling</h2>
            <p className="text-slate-600 text-sm">
              We balance cognitive excellence with character building, physical endurance, and creative arts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-4" data-aos="fade-up" data-aos-delay="100">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Foundational & Primary Wing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Play-way experiential learning for Nursery to Grade 5. Activity-based numeracy, phonetics, and moral storytelling.
              </p>
              <Link href="/academics" className="text-xs font-semibold text-blue-900 hover:text-amber-600 flex items-center">
                <span>View Primary Syllabus</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-4" data-aos="fade-up" data-aos-delay="200">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Middle School (6 to 8)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Specialized sciences, mathematics concepts, language proficiencies (English, Hindi, Sanskrit), and computer fundamentals.
              </p>
              <Link href="/academics" className="text-xs font-semibold text-blue-900 hover:text-amber-600 flex items-center">
                <span>View Middle Syllabus</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-4" data-aos="fade-up" data-aos-delay="300">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Secondary Wing (9 & 10)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Focused CBSE board prep, lab practicals in physics/chem/bio, career guidance, and Olympiad problem-solving tracks.
              </p>
              <Link href="/academics" className="text-xs font-semibold text-blue-900 hover:text-amber-600 flex items-center">
                <span>View Secondary Syllabus</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-4" data-aos="fade-up" data-aos-delay="400">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Sports & Performing Arts</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Football, basketball, cricket nets, martial arts, table tennis, classical and western music, and theatrical drama.
              </p>
              <Link href="/gallery" className="text-xs font-semibold text-blue-900 hover:text-amber-600 flex items-center">
                <span>Explore Campus Activities</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ADMISSIONS PROCESS TIMELINE */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-12" data-aos="fade-up">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider bg-amber-50 border border-amber-200 px-3 py-1 rounded-md">
            Seamless Enrollment
          </span>
          <h2 className="text-3xl font-extrabold text-[#0F2942]">Admission Process in 4 Simple Steps</h2>
          <p className="text-slate-600 text-sm">
            We ensure an empathetic, transparent, and hassle-free admission journey for parents and students.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 relative space-y-3" data-aos="fade-up" data-aos-delay="100">
            <div className="w-8 h-8 rounded-full bg-[#0F2942] text-white flex items-center justify-center font-bold text-xs">
              01
            </div>
            <h4 className="font-bold text-base text-slate-900">Online / Desk Inquiry</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Submit your inquiry online or visit our admissions secretariat at Regal Town, Bhopal.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 relative space-y-3" data-aos="fade-up" data-aos-delay="200">
            <div className="w-8 h-8 rounded-full bg-[#0F2942] text-white flex items-center justify-center font-bold text-xs">
              02
            </div>
            <h4 className="font-bold text-base text-slate-900">Campus Walkthrough</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Meet our academic counselors, tour science labs, classrooms, and sports facilities.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 relative space-y-3" data-aos="fade-up" data-aos-delay="300">
            <div className="w-8 h-8 rounded-full bg-[#0F2942] text-white flex items-center justify-center font-bold text-xs">
              03
            </div>
            <h4 className="font-bold text-base text-slate-900">Interactive Assessment</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Age-appropriate baseline assessment to understand the child's learning aptitude.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 relative space-y-3" data-aos="fade-up" data-aos-delay="400">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
              04
            </div>
            <h4 className="font-bold text-base text-slate-900">Enrollment & ERP Access</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Document verification, fee settlement, and instant credential issuance for the ERP Portal.
            </p>
          </div>
        </div>

        <div className="mt-10 text-center" data-aos="fade-up">
          <Link
            href="/admissions"
            className="inline-flex items-center space-x-2 bg-[#0F2942] hover:bg-blue-900 text-white font-bold px-8 py-3.5 rounded-xl shadow-md transition-all text-sm"
          >
            <span>Proceed to Full Admission Form</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </Link>
        </div>
      </section>

      {/* 6. CAMPUS LOCATION & DIRECT CONTACT CTA */}
      <section className="bg-linear-to-r from-[#0F2942] to-[#1E3A8A] text-white py-14 px-4 sm:px-8" data-aos="fade-in">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Visit Our Campus in Bhopal Today</h3>
            <p className="text-sm text-slate-200 leading-relaxed">
              Khajuri Kalan Road, Near Krishna Mandir, Regal Town, BHEL / Awadhpuri, Bhopal, Madhya Pradesh 462022. Experience our vibrant classrooms and meet our faculty in person.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 shrink-0">
            <a
              href="tel:+919425992209"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-3 rounded-xl transition-all flex items-center space-x-2 text-sm"
            >
              <Phone className="w-4 h-4" />
              <span>Call +91 94259 92209</span>
            </a>
            <Link
              href="/contact"
              className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm"
            >
              View Google Map Directions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
