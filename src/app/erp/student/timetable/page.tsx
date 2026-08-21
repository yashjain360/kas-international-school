'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Calendar, BookOpen, School, Sparkles } from 'lucide-react';
import { ErpLayout } from '@/components/erp/ErpLayout';
import { useAuth } from '@/context/AuthContext';

export default function StudentTimetablePage() {
  const { user } = useAuth();
  const [timetables, setTimetables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const studentGrade = user?.grade || 'Grade 10';
  const studentSection = user?.section || 'A';

  useEffect(() => {
    setLoading(true);
    fetch(`/api/timetables?grade=${encodeURIComponent(studentGrade)}&section=${studentSection}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.timetables) setTimetables(data.timetables);
      })
      .catch((err) => console.error('Timetable error:', err))
      .finally(() => setLoading(false));
  }, [studentGrade, studentSection]);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <ErpLayout requiredRole="student">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider bg-amber-400/10 border border-amber-400/30 px-2.5 py-0.5 rounded-md">
                Official Class Routine
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1">Weekly Class Timetable Schedule</h1>
            <p className="text-xs text-slate-400">
              {studentGrade}-{studentSection} • Daily lecture periods, laboratory slots, faculty in-charge, and room locations.
            </p>
          </div>
        </div>

        {/* Timetable Grid */}
        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-36"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {days.map((day) => {
              const daySchedule = timetables.find((t) => t.day === day);
              const periods = daySchedule?.periods || [];

              return (
                <div key={day} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h3 className="font-bold text-sm text-amber-400 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {day} Schedule ({studentGrade}-{studentSection})
                    </h3>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {periods.length} Periods (08:30 AM – 02:15 PM)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
                    {periods.map((p: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-800/70 border border-slate-700/70 rounded-xl space-y-1 text-xs hover:border-amber-400/40 transition-colors"
                      >
                        <div className="flex items-center justify-between text-[10px] text-amber-300 font-mono">
                          <span className="font-bold bg-amber-400/10 px-1 py-0.5 rounded">Period {p.periodNo}</span>
                          <span>{p.timeSlot}</span>
                        </div>
                        <h4 className="font-bold text-white text-xs truncate">{p.subject}</h4>
                        <p className="text-[11px] text-slate-300 truncate">{p.teacherName}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{p.roomNo || 'Classroom'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ErpLayout>
  );
}
