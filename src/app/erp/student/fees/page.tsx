'use client';

import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Download,
  Printer,
  Calendar,
  ShieldCheck,
  X,
  FileText,
} from 'lucide-react';
import { ErpLayout } from '@/components/erp/ErpLayout';

export default function StudentFeesPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);

  useEffect(() => {
    fetch('/api/fees')
      .then((res) => res.json())
      .then((data) => {
        if (data.records) setRecords(data.records);
      })
      .catch((err) => console.error('Student fees error:', err))
      .finally(() => setLoading(false));
  }, []);

  const totalFees = records.reduce((sum, r) => sum + r.totalAmount, 0);
  const totalPaid = records.filter((r) => r.status === 'paid').reduce((sum, r) => sum + r.paidAmount, 0);
  const balanceDue = totalFees - totalPaid;

  return (
    <ErpLayout requiredRole="student">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Student Fee Ledger & Payment Receipts</h1>
            <p className="text-xs text-slate-400">
              Review term fee breakdowns, settlement vouchers, installment receipts, and balance dues.
            </p>
          </div>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Annual Fee Assessed</span>
            <p className="text-2xl font-extrabold text-white">
              ₹{new Intl.NumberFormat('en-IN').format(totalFees)}
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Total Settled (Paid)</span>
            <p className="text-2xl font-extrabold text-emerald-400">
              ₹{new Intl.NumberFormat('en-IN').format(totalPaid)}
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Pending Balance</span>
            <p className="text-2xl font-extrabold text-red-400">
              ₹{new Intl.NumberFormat('en-IN').format(balanceDue)}
            </p>
          </div>
        </div>

        {/* Invoices List */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="text-center py-16 text-slate-500 text-sm">Loading Fee Invoices...</div>
          ) : records.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-sm">No fee statements found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-800/60 text-slate-400 font-bold uppercase">
                    <th className="py-3 px-4">Invoice Reference</th>
                    <th className="py-3 px-4">Term & Fee Description</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Receipt Voucher</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {records.map((r) => (
                    <tr key={r._id} className="hover:bg-slate-800/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-400">{r.invoiceNo}</td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-white text-sm">{r.term}</p>
                        <p className="text-[10px] text-slate-400">{r.title}</p>
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-white text-sm">
                        ₹{new Intl.NumberFormat('en-IN').format(r.totalAmount)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={r.status === 'overdue' ? 'text-red-400 font-bold' : 'text-slate-300'}>
                          {r.dueDate}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
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
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedReceipt(r)}
                          className="bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 px-3 py-1 rounded-md font-bold transition-all text-[11px] inline-flex items-center space-x-1"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>{r.status === 'paid' ? 'Official Receipt' : 'View Statement'}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Printable Receipt Modal */}
        {selectedReceipt && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white text-slate-900 rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative border border-slate-200">
              <button
                onClick={() => setSelectedReceipt(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Receipt Header */}
              <div className="text-center pb-4 border-b border-slate-200 space-y-1">
                <h3 className="font-extrabold text-lg text-[#0F2942]">K.A.S. INTERNATIONAL SCHOOL</h3>
                <p className="text-[11px] text-slate-500">Khajuri Kalan Road, Regal Town, BHEL / Awadhpuri, Bhopal, MP</p>
                <p className="text-xs font-bold text-amber-700 uppercase tracking-wide">
                  {selectedReceipt.status === 'paid' ? 'Official Fee Payment Voucher' : 'Term Fee Invoice'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-slate-500">Student Name:</p>
                  <p className="font-bold text-slate-900">{selectedReceipt.studentName}</p>
                </div>
                <div>
                  <p className="text-slate-500">Admission No:</p>
                  <p className="font-bold text-slate-900 font-mono">{selectedReceipt.admissionNo}</p>
                </div>
                <div>
                  <p className="text-slate-500">Invoice Reference:</p>
                  <p className="font-bold text-slate-900 font-mono">{selectedReceipt.invoiceNo}</p>
                </div>
                <div>
                  <p className="text-slate-500">Term Period:</p>
                  <p className="font-bold text-slate-900">{selectedReceipt.term}</p>
                </div>
              </div>

              {/* Breakdown */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Tuition & Instructional Fee:</span>
                  <span>₹{new Intl.NumberFormat('en-IN').format(selectedReceipt.breakdown?.tuitionFee || 18500)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Campus Development & Infra:</span>
                  <span>₹{new Intl.NumberFormat('en-IN').format(selectedReceipt.breakdown?.developmentFee || 3000)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Science, Lab & Digital Library:</span>
                  <span>₹{new Intl.NumberFormat('en-IN').format(selectedReceipt.breakdown?.labAndLibrary || 2500)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Sports & Co-curricular Activities:</span>
                  <span>₹{new Intl.NumberFormat('en-IN').format(selectedReceipt.breakdown?.activityAndSports || 1500)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Transport Route Service:</span>
                  <span>₹{new Intl.NumberFormat('en-IN').format(selectedReceipt.breakdown?.transportFee || 4500)}</span>
                </div>
                <div className="border-t border-slate-300 pt-2 flex justify-between font-extrabold text-sm text-[#0F2942]">
                  <span>Total Amount:</span>
                  <span>₹{new Intl.NumberFormat('en-IN').format(selectedReceipt.totalAmount)}</span>
                </div>
              </div>

              {selectedReceipt.status === 'paid' ? (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="font-bold">Settled via {selectedReceipt.paymentMethod || 'UPI'}</p>
                    <p className="text-[10px] text-emerald-700 font-mono">TXN: {selectedReceipt.transactionId || 'KAS-TXN-VERIFIED'}</p>
                  </div>
                  <span className="font-bold text-emerald-700">Paid on {selectedReceipt.paidDate || '2026-04-10'}</span>
                </div>
              ) : (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-0.5">
                  <p className="font-bold">Status: {selectedReceipt.status.toUpperCase()}</p>
                  <p className="text-[10px] text-amber-800">Due Date: {selectedReceipt.dueDate}. Please clear balance at Bursar office.</p>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErpLayout>
  );
}
