'use client';

import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Search,
  Filter,
  Send,
  Plus,
  CheckCircle2,
  AlertCircle,
  Clock,
  Download,
  FileSpreadsheet,
  X,
} from 'lucide-react';
import { ErpLayout } from '@/components/erp/ErpLayout';
import { TableRowSkeleton } from '@/components/erp/Skeleton';
import { Pagination } from '@/components/erp/Pagination';

export default function AdminFeesPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // New Invoice Form State
  const [newInvoice, setNewInvoice] = useState({
    admissionNo: 'KAS2026-1001',
    term: 'Quarter 3',
    title: 'Quarter 3 Tuition & Composite Fee',
    tuitionFee: 18500,
    developmentFee: 3000,
    labAndLibrary: 2500,
    activityAndSports: 1500,
    transportFee: 4500,
    dueDate: '2026-10-15',
  });

  const fetchFees = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/fees?status=${statusFilter}&search=${encodeURIComponent(searchTerm)}`);
      const data = await res.json();
      if (data.success) {
        setRecords(data.records);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error('Fees error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchFees();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchFees();
  };

  const handleSendReminder = async (invoiceId: string) => {
    setSendingId(invoiceId);
    setActionMessage(null);
    try {
      const res = await fetch('/api/fees/remind', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId }),
      });
      const data = await res.json();
      if (res.ok) {
        setActionMessage(data.message);
        fetchFees();
      } else {
        setActionMessage(data.error || 'Failed to send reminder.');
      }
    } catch {
      setActionMessage('Network error while dispatching reminder.');
    } finally {
      setSendingId(null);
    }
  };

  const handleMarkPaid = async (invoiceId: string) => {
    try {
      const res = await fetch('/api/fees', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId, status: 'paid', paymentMethod: 'UPI' }),
      });
      if (res.ok) {
        setActionMessage('Invoice marked as Paid with verified receipt.');
        fetchFees();
      }
    } catch (err) {
      console.error('Mark paid error:', err);
    }
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/fees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInvoice),
      });
      const data = await res.json();
      if (res.ok) {
        setIsCreateOpen(false);
        setActionMessage('New fee invoice generated successfully.');
        fetchFees();
      } else {
        setActionMessage(data.error || 'Failed to generate invoice.');
      }
    } catch {
      setActionMessage('Failed to create invoice.');
    }
  };

  const paginatedRecords = records.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <ErpLayout requiredRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Master Fee Ledger & Bursar Desk</h1>
            <p className="text-xs text-slate-400">
              Manage student fee schedules, generate invoices, track settlements, and trigger email reminders.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsCreateOpen(true)}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center space-x-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Generate Fee Invoice</span>
            </button>
          </div>
        </div>

        {actionMessage && (
          <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-200 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{actionMessage}</span>
            </div>
            <button onClick={() => setActionMessage(null)} className="text-emerald-400 hover:text-white text-xs">
              Dismiss
            </button>
          </div>
        )}

        {/* Stats Row */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Total Collected</span>
              <p className="text-2xl font-extrabold text-emerald-400">
                ₹{new Intl.NumberFormat('en-IN').format(stats.totalCollected)}
              </p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Pending / Overdue</span>
              <p className="text-2xl font-extrabold text-red-400">
                ₹{new Intl.NumberFormat('en-IN').format(stats.totalOverdue)}
              </p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Total Statements</span>
              <p className="text-2xl font-extrabold text-white">{stats.totalInvoices}</p>
            </div>
          </div>
        )}

        {/* Filter Bar */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {(['all', 'paid', 'pending', 'overdue'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                  statusFilter === s
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {s} Statements
              </button>
            ))}
          </div>

          <form onSubmit={handleSearchSubmit} className="w-full md:w-72 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search student, admission no, invoice..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-hidden"
            />
          </form>
        </div>

        {/* Fee Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-800/60 text-slate-400 font-bold uppercase">
                  <th className="py-3 px-4">Invoice No</th>
                  <th className="py-3 px-4">Student & Grade</th>
                  <th className="py-3 px-4">Term & Fee Description</th>
                  <th className="py-3 px-4">Amount Due</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              {loading ? (
                <TableRowSkeleton cols={7} rows={5} />
              ) : records.length === 0 ? (
                <tbody>
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-slate-500 text-sm">
                      No fee records found.
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {paginatedRecords.map((r) => (
                    <tr key={r._id} className="hover:bg-slate-800/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-amber-400">{r.invoiceNo}</td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-white">{r.studentName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{r.admissionNo} • {r.grade}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-200">{r.term}</p>
                        <p className="text-[10px] text-slate-400 truncate max-w-xs">{r.title}</p>
                      </td>
                      <td className="py-3 px-4 font-extrabold text-white text-sm">
                        ₹{new Intl.NumberFormat('en-IN').format(r.totalAmount)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={r.status === 'overdue' ? 'text-red-400 font-bold' : 'text-slate-300'}>
                          {r.dueDate}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${
                            r.status === 'paid'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : r.status === 'overdue'
                              ? 'bg-red-500/20 text-red-300 border-red-500/30'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        {r.status !== 'paid' && (
                          <>
                            <button
                              onClick={() => handleSendReminder(r._id)}
                              disabled={sendingId === r._id}
                              className="bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-400 text-[11px] font-bold px-2.5 py-1 rounded-md border border-slate-700 transition-all disabled:opacity-50 cursor-pointer"
                            >
                              {sendingId === r._id ? 'Sending...' : 'Email Reminder'}
                            </button>
                            <button
                              onClick={() => handleMarkPaid(r._id)}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-md transition-all cursor-pointer"
                            >
                              Mark Paid
                            </button>
                          </>
                        )}
                        {r.status === 'paid' && (
                          <span className="text-[11px] text-slate-400 font-mono">Paid ({r.paymentMethod || 'UPI'})</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>

          {/* Pagination Controls */}
          {!loading && records.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalItems={records.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          )}
        </div>

        {/* Create Invoice Modal */}
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-bold text-base text-white">Generate Term Fee Statement</h3>
                <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateInvoice} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Student Admission No *</label>
                  <input
                    type="text"
                    required
                    value={newInvoice.admissionNo}
                    onChange={(e) => setNewInvoice({ ...newInvoice, admissionNo: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Fee Term *</label>
                    <select
                      value={newInvoice.term}
                      onChange={(e) => setNewInvoice({ ...newInvoice, term: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white cursor-pointer"
                    >
                      <option value="Quarter 1">Quarter 1</option>
                      <option value="Quarter 2">Quarter 2</option>
                      <option value="Quarter 3">Quarter 3</option>
                      <option value="Quarter 4">Quarter 4</option>
                      <option value="Annual">Annual</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Due Date *</label>
                    <input
                      type="date"
                      required
                      value={newInvoice.dueDate}
                      onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Tuition Fee (₹)</label>
                    <input
                      type="number"
                      value={newInvoice.tuitionFee}
                      onChange={(e) => setNewInvoice({ ...newInvoice, tuitionFee: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Development (₹)</label>
                    <input
                      type="number"
                      value={newInvoice.developmentFee}
                      onChange={(e) => setNewInvoice({ ...newInvoice, developmentFee: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Lab / Lib (₹)</label>
                    <input
                      type="number"
                      value={newInvoice.labAndLibrary}
                      onChange={(e) => setNewInvoice({ ...newInvoice, labAndLibrary: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Activity (₹)</label>
                    <input
                      type="number"
                      value={newInvoice.activityAndSports}
                      onChange={(e) => setNewInvoice({ ...newInvoice, activityAndSports: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Transport (₹)</label>
                    <input
                      type="number"
                      value={newInvoice.transportFee}
                      onChange={(e) => setNewInvoice({ ...newInvoice, transportFee: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold shadow-md cursor-pointer"
                  >
                    Generate Invoice
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
