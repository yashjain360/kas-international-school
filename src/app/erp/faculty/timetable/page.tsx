'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Calendar, BookOpen, School } from 'lucide-react';
import { ErpLayout } from '@/components/erp/ErpLayout';

export default function FacultyTimetablePage() {
  const [selectedGrade, setSelectedGrade] = useState('Grade 10');
  const [selectedSection, setSelectedSection] = useState('A');
  const [timetables, setTimetables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/timetables?grade=${encodeURIComponent(selectedGrade)}&section=${selectedSection}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.timetables) setTimetables(data.timetables);
      })
      .catch((err) => console.error('Timetable error:', err))
      .finally(() => setLoading(false));
  }, [selectedGrade, selectedSection]);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <ErpLayout requiredRole="faculty">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Academic Master Timetable</h1>
            <p className="text-xs text-slate-400">
              Weekly class routine, lecture timings, laboratory practical slots, and room locations.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-bold"
            >
              <option value="Grade 10">Grade 10</option>
              <option value="Grade 9">Grade 9</option>
              <option value="Grade 8">Grade 8</option>
              <option value="Grade 6">Grade 6</option>
              <option value="Grade 4">Grade 4</option>
            </select>
          </div>
        </div>

        {/* Timetable Grid by Days */}
        {loading ? (
          <div className="text-center py-16 text-slate-500 text-sm">Loading Timetable Schedules...</div>
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
                      {day} Schedule ({selectedGrade}-{selectedSection})
                    </h3>
                    <span className="text-[11px] text-slate-400 font-mono">6 Periods (08:30 AM – 01:45 PM)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
                    {periods.map((p: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-800/70 border border-slate-700/70 rounded-xl space-y-1 text-xs"
                      >
                        <div className="flex items-center justify-between text-[10px] text-amber-300 font-mono">
                          <span>P{p.periodNo}</span>
                          <span>{p.timeSlot}</span>
                        </div>
                        <h4 className="font-bold text-white text-xs truncate">{p.subject}</h4>
                        <p className="text-[11px] text-slate-300 truncate">{p.teacherName}</p>
                        <p className="text-[10px] text-slate-500">{p.roomNo}</p>
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
