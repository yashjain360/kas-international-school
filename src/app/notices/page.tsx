'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Bell,
  Calendar,
  Pin,
  Tag,
  Search,
  FileText,
  UserCheck,
  ArrowRight,
} from 'lucide-react';

export default function NoticesPage() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/notices')
      .then((res) => res.json())
      .then((data) => {
        if (data.notices) setNotices(data.notices);
      })
      .catch((err) => console.error('Notices error:', err))
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    { id: 'all', label: 'All Notices' },
    { id: 'exam', label: 'Exam & Assessments' },
    { id: 'academic', label: 'Academic Circulars' },
    { id: 'events', label: 'Campus Events' },
    { id: 'administrative', label: 'Administrative & Fees' },
    { id: 'sports', label: 'Sports & Co-curricular' },
  ];

  const filteredNotices = notices.filter((n) => {
    const matchesCat = selectedCategory === 'all' || n.category === selectedCategory;
    const matchesSearch =
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-bold text-blue-900 uppercase tracking-wider bg-blue-100/60 border border-blue-200 px-3.5 py-1.5 rounded-full">
            Official Announcements
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F2942] tracking-tight">
            Circulars & School Notice Board
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            Stay updated with official CBSE circulars, examination schedules, fee reminders, holiday declarations, and campus event notices.
          </p>
        </div>

        {/* Controls Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedCategory === c.id
                    ? 'bg-[#0F2942] text-white shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="w-full md:w-64 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search circulars..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-3.5 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-800"
            />
          </div>
        </div>

        {/* Notices List */}
        {loading ? (
          <div className="text-center py-20 text-slate-500 text-sm">Loading official circulars...</div>
        ) : filteredNotices.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
            No notices found matching your criteria.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotices.map((notice) => (
              <div
                key={notice._id}
                className={`bg-white p-6 sm:p-7 rounded-2xl border transition-all ${
                  notice.isPinned
                    ? 'border-amber-300 bg-linear-to-r from-amber-50/30 to-white shadow-xs'
                    : 'border-slate-200 shadow-xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center space-x-2">
                    {notice.isPinned && (
                      <span className="bg-amber-100 text-amber-900 text-[11px] font-bold px-2.5 py-0.5 rounded-md flex items-center">
                        <Pin className="w-3 h-3 mr-1 text-amber-700" />
                        Pinned Notice
                      </span>
                    )}
                    <span className="bg-blue-50 text-blue-900 text-[11px] font-bold px-2.5 py-0.5 rounded-md uppercase">
                      {notice.category}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">Audience: {notice.targetAudience}</span>
                  </div>

                  <div className="flex items-center text-xs text-slate-500">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    <span>Published: {notice.publishedDate}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-[#0F2942] mb-2">{notice.title}</h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-4">{notice.content}</p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold">Issued By: {notice.authorName}</span>
                  <Link
                    href="/auth/login"
                    className="text-blue-900 hover:text-amber-700 font-bold flex items-center"
                  >
                    <span>ERP Verification</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
