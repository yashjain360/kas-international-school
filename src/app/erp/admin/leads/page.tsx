'use client';

import React, { useState, useEffect } from 'react';
import {
  UserPlus,
  Search,
  Filter,
  Phone,
  Mail,
  Calendar,
  MessageSquare,
  CheckCircle2,
  Clock,
  Send,
  Plus,
} from 'lucide-react';
import { ErpLayout } from '@/components/erp/ErpLayout';

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [newNote, setNewNote] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchLeads = async () => {
    try {
      const res = await fetch(`/api/leads?status=${statusFilter}&search=${encodeURIComponent(searchTerm)}`);
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads);
        if (selectedLead) {
          const updated = data.leads.find((l: any) => l._id === selectedLead._id);
          if (updated) setSelectedLead(updated);
        }
      }
    } catch (err) {
      console.error('Leads error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLeads();
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) fetchLeads();
    } catch (err) {
      console.error('Update status error:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleAddNote = async () => {
    if (!selectedLead || !newNote.trim()) return;
    setUpdating(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedLead._id, note: newNote }),
      });
      if (res.ok) {
        setNewNote('');
        fetchLeads();
      }
    } catch (err) {
      console.error('Add note error:', err);
    } finally {
      setUpdating(false);
    }
  };

  const statuses = [
    { id: 'all', label: 'All Inquiries' },
    { id: 'new', label: 'New / Uncontacted' },
    { id: 'contacted', label: 'Contacted' },
    { id: 'campus_visit', label: 'Campus Visit Scheduled' },
    { id: 'documents_verified', label: 'Documents Verified' },
    { id: 'enrolled', label: 'Enrolled' },
  ];

  return (
    <ErpLayout requiredRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Admissions & Prospective Leads CRM</h1>
            <p className="text-xs text-slate-400">
              Track parental inquiries, schedule campus visits, and manage student enrollment pipelines.
            </p>
          </div>
          <span className="bg-amber-400/10 border border-amber-400/30 text-amber-400 font-mono text-xs font-bold px-3 py-1.5 rounded-lg self-start">
            Total Inquiries: {leads.length}
          </span>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {statuses.map((s) => (
              <button
                key={s.id}
                onClick={() => setStatusFilter(s.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === s.id
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSearchSubmit} className="w-full md:w-72 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search parent, student, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-hidden focus:ring-1 focus:ring-amber-400"
            />
          </form>
        </div>

        {/* 2-Column: Leads Table & Detail Drawer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Table */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            {loading ? (
              <div className="text-center py-16 text-slate-500 text-sm">Loading Leads...</div>
            ) : leads.length === 0 ? (
              <div className="text-center py-16 text-slate-500 text-sm">No admission leads found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-800/60 text-slate-400 font-bold uppercase">
                      <th className="py-3 px-4">Ref No & Date</th>
                      <th className="py-3 px-4">Student & Grade</th>
                      <th className="py-3 px-4">Parent Details</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {leads.map((lead) => (
                      <tr
                        key={lead._id}
                        onClick={() => setSelectedLead(lead)}
                        className={`hover:bg-slate-800/80 cursor-pointer transition-colors ${
                          selectedLead?._id === lead._id ? 'bg-slate-800' : ''
                        }`}
                      >
                        <td className="py-3 px-4">
                          <p className="font-mono text-[11px] font-bold text-amber-400">{lead.enquiryNo}</p>
                          <p className="text-[10px] text-slate-500">
                            {new Date(lead.createdAt).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-white">{lead.studentName}</p>
                          <p className="text-[11px] text-slate-400">{lead.targetGrade}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-slate-200">{lead.parentName}</p>
                          <p className="text-[11px] text-slate-400">{lead.phone}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-slate-800 border border-slate-700 text-amber-400 text-[10px] font-bold uppercase px-2 py-0.5 rounded-md">
                            {lead.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button className="text-xs text-amber-400 hover:text-amber-300 font-semibold">
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Details / Follow-up Panel */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
            {selectedLead ? (
              <div className="space-y-5">
                <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-base text-white">{selectedLead.studentName}</h3>
                    <p className="text-xs text-amber-400 font-mono">Ref: {selectedLead.enquiryNo}</p>
                  </div>
                  <select
                    value={selectedLead.status}
                    onChange={(e) => handleUpdateStatus(selectedLead._id, e.target.value)}
                    disabled={updating}
                    className="text-xs bg-slate-800 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 font-bold"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="campus_visit">Campus Visit</option>
                    <option value="documents_verified">Documents Verified</option>
                    <option value="enrolled">Enrolled</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-800/60 rounded-xl space-y-1">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Target Grade</span>
                    <p className="font-bold text-white">{selectedLead.targetGrade}</p>
                  </div>
                  <div className="p-3 bg-slate-800/60 rounded-xl space-y-1">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Parent Contact</span>
                    <p className="font-bold text-white">{selectedLead.phone}</p>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <span className="text-slate-400 font-bold">Parent Email:</span>
                  <p className="text-slate-300">{selectedLead.email}</p>
                  {selectedLead.previousSchool && (
                    <>
                      <span className="text-slate-400 font-bold block pt-1">Previous School:</span>
                      <p className="text-slate-300">{selectedLead.previousSchool}</p>
                    </>
                  )}
                  {selectedLead.message && (
                    <>
                      <span className="text-slate-400 font-bold block pt-1">Parent Message / Note:</span>
                      <p className="text-slate-300 bg-slate-800/40 p-2.5 rounded-lg border border-slate-800">
                        {selectedLead.message}
                      </p>
                    </>
                  )}
                </div>

                {/* Follow-up Notes History */}
                <div className="space-y-3 pt-3 border-t border-slate-800">
                  <h4 className="font-bold text-xs text-white uppercase tracking-wider">
                    Follow-Up History ({selectedLead.notes?.length || 0})
                  </h4>

                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedLead.notes?.map((n: any, idx: number) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-slate-800/50 text-xs space-y-0.5">
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span className="font-bold text-amber-400">{n.author}</span>
                          <span>{new Date(n.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-slate-200">{n.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Add Note Input */}
                  <div className="flex space-x-2 pt-2">
                    <input
                      type="text"
                      placeholder="Add follow-up remark..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="flex-1 text-xs px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-hidden"
                    />
                    <button
                      onClick={handleAddNote}
                      disabled={updating || !newNote.trim()}
                      className="bg-amber-500 text-slate-950 px-3 py-2 rounded-lg text-xs font-bold disabled:opacity-50"
                    >
                      Add Note
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-slate-500 text-xs">
                Select any prospective student inquiry on the left to view notes, contact logs, or update admission status.
              </div>
            )}
          </div>
        </div>
      </div>
    </ErpLayout>
  );
}
