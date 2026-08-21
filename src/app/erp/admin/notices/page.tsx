'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell,
  Plus,
  Pin,
  Trash2,
  Calendar,
  Search,
  CheckCircle2,
  X,
} from 'lucide-react';
import { ErpLayout } from '@/components/erp/ErpLayout';

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [newNotice, setNewNotice] = useState({
    title: '',
    content: '',
    category: 'academic',
    targetAudience: 'all',
    isPinned: false,
    priority: 'medium',
  });

  const fetchNotices = async () => {
    try {
      const res = await fetch('/api/notices');
      const data = await res.json();
      if (data.success) setNotices(data.notices);
    } catch (err) {
      console.error('Notices error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNotice),
      });
      const data = await res.json();

      if (res.ok) {
        setIsPublishOpen(false);
        setMessage('Notice published successfully to public board & ERP.');
        setNewNotice({
          title: '',
          content: '',
          category: 'academic',
          targetAudience: 'all',
          isPinned: false,
          priority: 'medium',
        });
        fetchNotices();
      } else {
        setMessage(data.error || 'Failed to publish notice.');
      }
    } catch {
      setMessage('Failed to publish notice.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you wish to retract this circular?')) return;
    try {
      const res = await fetch(`/api/notices?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage('Circular retracted successfully.');
        fetchNotices();
      }
    } catch (err) {
      console.error('Delete notice error:', err);
    }
  };

  return (
    <ErpLayout requiredRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Circulars & Notice Board Manager</h1>
            <p className="text-xs text-slate-400">
              Publish board circulars, assessment datesheets, holiday notifications, and institutional events.
            </p>
          </div>

          <button
            onClick={() => setIsPublishOpen(true)}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center space-x-2 self-start"
          >
            <Plus className="w-4 h-4" />
            <span>Publish New Notice</span>
          </button>
        </div>

        {message && (
          <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-200 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{message}</span>
            </div>
            <button onClick={() => setMessage(null)} className="text-emerald-400 hover:text-white">
              Dismiss
            </button>
          </div>
        )}

        {/* Notices Grid */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-16 text-slate-500 text-sm">Loading Notices...</div>
          ) : notices.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-sm">No circulars published.</div>
          ) : (
            notices.map((n) => (
              <div
                key={n._id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 relative shadow-xs"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    {n.isPinned && (
                      <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold uppercase px-2 py-0.5 rounded-md flex items-center">
                        <Pin className="w-3 h-3 mr-1" />
                        Pinned
                      </span>
                    )}
                    <span className="bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase px-2 py-0.5 rounded-md">
                      {n.category}
                    </span>
                    <span className="text-[11px] text-slate-400">Target: {n.targetAudience}</span>
                  </div>

                  <div className="flex items-center space-x-3 text-xs text-slate-400">
                    <span>Published: {n.publishedDate}</span>
                    <button
                      onClick={() => handleDelete(n._id)}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white">{n.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{n.content}</p>

                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                  Author: <strong className="text-slate-300">{n.authorName}</strong>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Publish Modal */}
        {isPublishOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-bold text-base text-white">Publish Official Notice</h3>
                <button onClick={() => setIsPublishOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handlePublish} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Notice Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pre-Board Examination Guidelines"
                    value={newNotice.title}
                    onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Category *</label>
                    <select
                      value={newNotice.category}
                      onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                    >
                      <option value="academic">Academic</option>
                      <option value="exam">Examination & Assessments</option>
                      <option value="events">Events & Celebrations</option>
                      <option value="administrative">Administrative & Bursar</option>
                      <option value="sports">Sports & Activities</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Target Audience *</label>
                    <select
                      value={newNotice.targetAudience}
                      onChange={(e) => setNewNotice({ ...newNotice, targetAudience: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                    >
                      <option value="all">All Stakeholders</option>
                      <option value="students">Students & Parents</option>
                      <option value="faculty">Faculty & Staff</option>
                      <option value="parents">Parents Only</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Notice Content *</label>
                  <textarea
                    rows={5}
                    required
                    value={newNotice.content}
                    onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="pinnedCheck"
                    checked={newNotice.isPinned}
                    onChange={(e) => setNewNotice({ ...newNotice, isPinned: e.target.checked })}
                    className="rounded bg-slate-800 border-slate-700 text-amber-500"
                  />
                  <label htmlFor="pinnedCheck" className="text-slate-300">
                    Pin notice to top of public board & ERP
                  </label>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsPublishOpen(false)}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold shadow-md"
                  >
                    Publish Notice
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ErpLayout>
  );
}
