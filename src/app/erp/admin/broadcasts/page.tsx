'use client';

import React, { useState, useEffect } from 'react';
import {
  Send,
  Users,
  School,
  UserPlus,
  CheckCircle2,
  AlertCircle,
  Clock,
  Mail,
  Sparkles,
} from 'lucide-react';
import { ErpLayout } from '@/components/erp/ErpLayout';

export default function AdminBroadcastsPage() {
  const [broadcasts, setBroadcasts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [form, setForm] = useState({
    subject: '',
    messageHtml: '',
    recipientType: 'all',
    targetGrade: 'Grade 10',
  });

  const fetchBroadcasts = async () => {
    try {
      const res = await fetch('/api/broadcasts');
      const data = await res.json();
      if (data.success) setBroadcasts(data.broadcasts);
    } catch (err) {
      console.error('Broadcasts fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBroadcasts();
  }, []);

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/broadcasts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        setStatusMessage({ type: 'success', text: data.message });
        setForm({
          subject: '',
          messageHtml: '',
          recipientType: 'all',
          targetGrade: 'Grade 10',
        });
        fetchBroadcasts();
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to send broadcast.' });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Network error while dispatching broadcast.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <ErpLayout requiredRole="admin">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider bg-amber-400/10 border border-amber-400/30 px-2.5 py-1 rounded-md">
            SMTP Multi-Channel Communications
          </span>
          <h1 className="text-2xl font-bold text-white mt-1.5">
            Email Broadcast Center (thewebvale.com SMTP)
          </h1>
          <p className="text-xs text-slate-400">
            Dispatch official institutional circulars, emergency announcements, and term updates to Students, Faculty, and Prospective Leads.
          </p>
        </div>

        {statusMessage && (
          <div
            className={`p-4 rounded-xl text-xs flex items-center justify-between border ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
                : 'bg-red-950/80 border-red-500/50 text-red-200'
            }`}
          >
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{statusMessage.text}</span>
            </div>
            <button onClick={() => setStatusMessage(null)} className="text-slate-400 hover:text-white">
              Dismiss
            </button>
          </div>
        )}

        {/* 2-Column: Compose & Broadcast Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Compose Form */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-5">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Mail className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-base text-white">Compose Official Broadcast</h3>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1.5">Target Recipient Audience *</label>
                <select
                  value={form.recipientType}
                  onChange={(e) => setForm({ ...form, recipientType: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-medium focus:outline-hidden focus:ring-1 focus:ring-amber-400"
                >
                  <option value="all">All Stakeholders (Students, Parents, Faculty & Leads)</option>
                  <option value="students">All Enrolled Students & Parents</option>
                  <option value="faculty">All Faculty & Teaching Staff</option>
                  <option value="leads">All Prospective Admission Leads</option>
                  <option value="grade_specific">Specific Grade Enrolled Students</option>
                </select>
              </div>

              {form.recipientType === 'grade_specific' && (
                <div>
                  <label className="block font-bold text-slate-300 mb-1.5">Target Grade *</label>
                  <select
                    value={form.targetGrade}
                    onChange={(e) => setForm({ ...form, targetGrade: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  >
                    <option value="Grade 10">Grade 10</option>
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 8">Grade 8</option>
                    <option value="Grade 6">Grade 6</option>
                    <option value="Grade 4">Grade 4</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-300 mb-1.5">Email Subject Line *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CBSE Term Examination Guidelines & Admit Card Release"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-hidden focus:ring-1 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1.5">Announcement Content (HTML Supported) *</label>
                <textarea
                  rows={6}
                  required
                  placeholder="<p>Dear Parents and Students,</p><p>We are pleased to announce...</p>"
                  value={form.messageHtml}
                  onChange={(e) => setForm({ ...form, messageHtml: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono focus:outline-hidden focus:ring-1 focus:ring-amber-400"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 rounded-xl text-sm transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{sending ? 'Transmitting via SMTP...' : 'Dispatch Broadcast Email'}</span>
              </button>
            </form>
          </div>

          {/* Broadcast Delivery History */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white">Broadcast Transmission Logs</h3>
              <span className="text-xs text-slate-400">SMTP: info@thewebvale.com</span>
            </div>

            {loading ? (
              <div className="text-center py-12 text-slate-500 text-xs">Loading transmission history...</div>
            ) : broadcasts.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">No broadcast emails sent yet.</div>
            ) : (
              <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
                {broadcasts.map((b) => (
                  <div key={b._id} className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="bg-amber-400/20 text-amber-300 font-bold uppercase text-[10px] px-2 py-0.5 rounded-md">
                        {b.recipientType}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(b.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-sm">{b.subject}</h4>
                    <p className="text-slate-400 truncate text-[11px]">{b.messageHtml.replace(/<[^>]*>?/gm, '')}</p>

                    <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Sent by: <strong>{b.sentBy}</strong></span>
                      <span className="text-emerald-400 font-bold">
                        {b.successfulDeliveries || b.totalRecipients} Delivered
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ErpLayout>
  );
}
