'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Award,
  BookOpen,
  Mail,
  Phone,
  Briefcase,
  CheckCircle2,
  Users,
} from 'lucide-react';

export default function FacultyPage() {
  const [facultyList, setFacultyList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState('all');

  useEffect(() => {
    fetch('/api/faculty')
      .then((res) => res.json())
      .then((data) => {
        if (data.faculty) setFacultyList(data.faculty);
      })
      .catch((err) => console.error('Faculty fetch error:', err))
      .finally(() => setLoading(false));
  }, []);

  const departments = ['all', 'Science & STEM', 'Mathematics', 'Languages', 'Humanities & Social Sciences', 'Primary Education'];

  const filteredFaculty = selectedDept === 'all'
    ? facultyList
    : facultyList.filter((f) => f.department === selectedDept);

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-bold text-blue-900 uppercase tracking-wider bg-blue-100/60 border border-blue-200 px-3.5 py-1.5 rounded-full">
            Scholastic Mentorship & Faculty
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F2942] tracking-tight">
            Our Distinguished Educators
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            Our educators bring profound subject mastery, pedagogical compassion, and CBSE examination expertise to mentor every child to their highest potential.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-2 justify-center">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedDept === dept
                  ? 'bg-[#0F2942] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {dept === 'all' ? 'All Departments' : dept}
            </button>
          ))}
        </div>

        {/* Faculty Grid */}
        {loading ? (
          <div className="text-center py-20 text-slate-500 text-sm">Loading Faculty Directory...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFaculty.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={member.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                      alt={member.name}
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-100 shadow-xs"
                    />
                    <div>
                      <h4 className="font-bold text-base text-slate-900">{member.name}</h4>
                      <p className="text-xs font-semibold text-amber-700">{member.designation}</p>
                      <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md mt-1 inline-block">
                        {member.department}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <div className="flex items-start">
                      <GraduationCap className="w-4 h-4 text-blue-900 mr-2 shrink-0 mt-0.5" />
                      <span><strong>Qualifications:</strong> {member.qualifications}</span>
                    </div>
                    <div className="flex items-start">
                      <Briefcase className="w-4 h-4 text-blue-900 mr-2 shrink-0 mt-0.5" />
                      <span><strong>Teaching Experience:</strong> {member.experienceYears} Years</span>
                    </div>
                  </div>

                  {member.subjects && member.subjects.length > 0 && (
                    <div className="space-y-1 pt-2">
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Key Subjects</p>
                      <div className="flex flex-wrap gap-1.5">
                        {member.subjects.map((sub: string, idx: number) => (
                          <span key={idx} className="bg-blue-50 text-blue-900 text-[11px] font-medium px-2.5 py-0.5 rounded-md">
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-mono text-[11px]">ID: {member.employeeId}</span>
                  <span className="text-emerald-700 font-semibold flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    Verified Faculty
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
