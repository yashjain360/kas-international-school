'use client';

import React, { useState, useEffect } from 'react';
import {
  School,
  Search,
  Award,
  BookOpen,
  GraduationCap,
  Briefcase,
  CheckCircle2,
} from 'lucide-react';
import { ErpLayout } from '@/components/erp/ErpLayout';
import { CardSkeleton } from '@/components/erp/Skeleton';
import { Pagination } from '@/components/erp/Pagination';

export default function AdminFacultyPage() {
  const [faculty, setFaculty] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    fetch('/api/faculty')
      .then((res) => res.json())
      .then((data) => {
        if (data.faculty) setFaculty(data.faculty);
      })
      .catch((err) => console.error('Faculty error:', err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = faculty.filter(
    (f) =>
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedFaculty = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <ErpLayout requiredRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Faculty & Teaching Mentors Directory</h1>
            <p className="text-xs text-slate-400">
              Manage teacher records, department allocations, subject assignments, and pedagogical credentials.
            </p>
          </div>
          <span className="bg-purple-400/10 border border-purple-400/30 text-purple-400 font-mono text-xs font-bold px-3 py-1.5 rounded-lg self-start">
            Faculty Count: {faculty.length}
          </span>
        </div>

        {/* Search Bar */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
          <div className="w-full sm:w-80 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search faculty name, department, ID..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs pl-9 pr-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-hidden"
            />
          </div>
        </div>

        {/* Faculty Grid */}
        {loading ? (
          <CardSkeleton count={6} />
        ) : filtered.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 p-12 rounded-2xl text-center text-slate-500 text-sm">
            No faculty members found matching your search.
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedFaculty.map((fac) => (
                <div
                  key={fac.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3.5">
                      <img
                        src={fac.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80'}
                        alt={fac.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                      />
                      <div>
                        <h3 className="font-bold text-sm text-white">{fac.name}</h3>
                        <p className="text-[11px] text-amber-400 font-semibold">{fac.designation}</p>
                        <span className="text-[10px] font-mono text-slate-400">ID: {fac.employeeId}</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-slate-300 pt-3 border-t border-slate-800">
                      <p><strong className="text-slate-400">Department:</strong> {fac.department}</p>
                      <p><strong className="text-slate-400">Qualifications:</strong> {fac.qualifications}</p>
                      <p><strong className="text-slate-400">Experience:</strong> {fac.experienceYears} Years</p>
                      <p><strong className="text-slate-400">Assigned Classes:</strong> {fac.assignedClasses?.join(', ')}</p>
                    </div>

                    {fac.subjects && (
                      <div className="pt-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Subject Portfolio</p>
                        <div className="flex flex-wrap gap-1">
                          {fac.subjects.map((sub: string, i: number) => (
                            <span key={i} className="bg-slate-800 text-amber-300 text-[10px] font-medium px-2 py-0.5 rounded-md border border-slate-700">
                              {sub}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {filtered.length > pageSize && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <Pagination
                  currentPage={currentPage}
                  totalItems={filtered.length}
                  pageSize={pageSize}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </ErpLayout>
  );
}
