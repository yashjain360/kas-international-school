'use client';

import React, { useState, useEffect } from 'react';
import {
  Clock,
  Calendar,
  BookOpen,
  School,
  Edit,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  X,
  Layers,
  Sparkles,
} from 'lucide-react';
import { ErpLayout } from '@/components/erp/ErpLayout';

export default function AdminTimetablePage() {
  const [selectedGrade, setSelectedGrade] = useState('Grade 10');
  const [selectedSection, setSelectedSection] = useState('A');
  const [timetables, setTimetables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Edit Modal State
  const [editingDay, setEditingDay] = useState<string | null>(null);
  const [editPeriods, setEditPeriods] = useState<any[]>([]);

  const fetchTimetables = () => {
    setLoading(true);
    fetch(`/api/timetables?grade=${encodeURIComponent(selectedGrade)}&section=${selectedSection}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.timetables) setTimetables(data.timetables);
      })
      .catch((err) => console.error('Timetable error:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTimetables();
  }, [selectedGrade, selectedSection]);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const handleOpenEdit = (day: string) => {
    const daySchedule = timetables.find((t) => t.day === day);
    const periods = daySchedule?.periods || [
      { periodNo: 1, timeSlot: '08:30 - 09:20 AM', subject: 'Mathematics', teacherName: 'Prof. Rajesh Sharma', roomNo: 'Room 101' },
      { periodNo: 2, timeSlot: '09:20 - 10:10 AM', subject: 'Physics', teacherName: 'Dr. Vikram Malhotra', roomNo: 'Physics Lab' },
    ];
    setEditingDay(day);
    setEditPeriods(JSON.parse(JSON.stringify(periods)));
  };

  const handlePeriodChange = (idx: number, field: string, val: any) => {
    const updated = [...editPeriods];
    updated[idx][field] = val;
    setEditPeriods(updated);
  };

  const handleAddPeriod = () => {
    const nextNo = editPeriods.length + 1;
    setEditPeriods([
      ...editPeriods,
      {
        periodNo: nextNo,
        timeSlot: '01:30 - 02:15 PM',
        subject: 'Computer Science & AI',
        teacherName: 'Prof. Sandeep Verma',
        roomNo: 'Room 101',
      },
    ]);
  };

  const handleRemovePeriod = (idx: number) => {
    const updated = editPeriods.filter((_, i) => i !== idx);
    const reindexed = updated.map((p, i) => ({ ...p, periodNo: i + 1 }));
    setEditPeriods(reindexed);
  };

  const handleSaveDaySchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDay) return;
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/timetables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade: selectedGrade,
          section: selectedSection,
          day: editingDay,
          periods: editPeriods,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || `Timetable for ${editingDay} updated successfully.`);
        setEditingDay(null);
        fetchTimetables();
      } else {
        setMessage(data.error || 'Failed to save timetable changes.');
      }
    } catch {
      setMessage('Failed to save timetable.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ErpLayout requiredRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider bg-amber-400/10 border border-amber-400/30 px-2.5 py-0.5 rounded-md">
                Institutional Schedule Master
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1">Class Timetable & Period Allocation</h1>
            <p className="text-xs text-slate-400">
              Configure daily lecture periods, subject curriculum allocations, faculty assignments, and laboratory facilities.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 p-1.5 rounded-xl">
              <span className="text-[11px] text-slate-400 font-bold uppercase pl-2">Class:</span>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-bold focus:outline-hidden cursor-pointer"
              >
                <option value="Grade 10">Grade 10</option>
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 8">Grade 8</option>
                <option value="Grade 6">Grade 6</option>
                <option value="Grade 4">Grade 4</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 p-1.5 rounded-xl">
              <span className="text-[11px] text-slate-400 font-bold uppercase pl-2">Section:</span>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-bold focus:outline-hidden cursor-pointer"
              >
                <option value="A">Section A</option>
                <option value="B">Section B</option>
              </select>
            </div>
          </div>
        </div>

        {message && (
          <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-200 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{message}</span>
            </div>
            <button onClick={() => setMessage(null)} className="text-emerald-400 hover:text-white font-bold cursor-pointer">
              Dismiss
            </button>
          </div>
        )}

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
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="font-bold text-sm text-amber-400 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {day} Schedule ({selectedGrade}-{selectedSection})
                    </h3>
                    <div className="flex items-center space-x-3">
                      <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                        {periods.length} Periods Configured
                      </span>
                      <button
                        onClick={() => handleOpenEdit(day)}
                        className="bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit {day} Routine</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
                    {periods.map((p: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-800/70 border border-slate-700/70 rounded-xl space-y-1.5 text-xs hover:border-amber-400/40 transition-colors"
                      >
                        <div className="flex items-center justify-between text-[10px] text-amber-300 font-mono">
                          <span className="font-bold bg-amber-400/10 px-1.5 py-0.5 rounded">Period {p.periodNo}</span>
                          <span>{p.timeSlot}</span>
                        </div>
                        <h4 className="font-bold text-white text-xs truncate">{p.subject}</h4>
                        <p className="text-[11px] text-slate-300 truncate">{p.teacherName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{p.roomNo || 'Classroom'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal: Edit Day Timetable Routine */}
        {editingDay && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 space-y-4 shadow-2xl text-xs max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="font-bold text-base text-white">
                    Admin Routine Editor: {editingDay} ({selectedGrade}-{selectedSection})
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Modify lecture periods, subject domains, designated faculty in-charge, and room locations.
                  </p>
                </div>
                <button onClick={() => setEditingDay(null)} className="text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveDaySchedule} className="space-y-4">
                <div className="space-y-3">
                  {editPeriods.map((p, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-2 p-3 bg-slate-800/80 rounded-xl border border-slate-700 items-center"
                    >
                      <div className="sm:col-span-1 text-center">
                        <span className="font-mono font-bold text-amber-400 text-xs">P{p.periodNo}</span>
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-[9px] text-slate-400 uppercase font-bold mb-0.5">Time Slot</label>
                        <input
                          type="text"
                          required
                          value={p.timeSlot}
                          onChange={(e) => handlePeriodChange(idx, 'timeSlot', e.target.value)}
                          className="w-full px-2 py-1 rounded bg-slate-800 border border-slate-700 text-white font-mono text-[11px]"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-[9px] text-slate-400 uppercase font-bold mb-0.5">Subject</label>
                        <input
                          type="text"
                          required
                          value={p.subject}
                          onChange={(e) => handlePeriodChange(idx, 'subject', e.target.value)}
                          className="w-full px-2 py-1 rounded bg-slate-800 border border-slate-700 text-white font-bold"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-[9px] text-slate-400 uppercase font-bold mb-0.5">Teacher Name</label>
                        <input
                          type="text"
                          required
                          value={p.teacherName}
                          onChange={(e) => handlePeriodChange(idx, 'teacherName', e.target.value)}
                          className="w-full px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label className="block text-[9px] text-slate-400 uppercase font-bold mb-0.5">Room</label>
                        <input
                          type="text"
                          value={p.roomNo}
                          onChange={(e) => handlePeriodChange(idx, 'roomNo', e.target.value)}
                          className="w-full px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[10px]"
                        />
                      </div>
                      <div className="sm:col-span-1 text-right pt-3 sm:pt-0">
                        <button
                          type="button"
                          onClick={() => handleRemovePeriod(idx)}
                          className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                          title="Remove period"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={handleAddPeriod}
                    className="bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Period Slot</span>
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setEditingDay(null)}
                      className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-5 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold shadow-md flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{saving ? 'Saving...' : `Save ${editingDay} Schedule`}</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ErpLayout>
  );
}
