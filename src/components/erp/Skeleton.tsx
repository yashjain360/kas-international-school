'use client';

import React from 'react';

export function MetricCardSkeleton() {
  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-3 w-24 bg-slate-800 rounded-md"></div>
        <div className="w-8 h-8 rounded-lg bg-slate-800"></div>
      </div>
      <div className="h-8 w-28 bg-slate-800 rounded-lg"></div>
      <div className="h-2.5 w-36 bg-slate-800/60 rounded-md"></div>
    </div>
  );
}

export function TableRowSkeleton({ cols = 5, rows = 5 }: { cols?: number; rows?: number }) {
  return (
    <tbody className="divide-y divide-slate-800 animate-pulse">
      {Array.from({ length: rows }).map((_, rIdx) => (
        <tr key={rIdx}>
          {Array.from({ length: cols }).map((_, cIdx) => (
            <td key={cIdx} className="py-4 px-4">
              <div
                className={`h-3 bg-slate-800 rounded-md ${
                  cIdx === 0 ? 'w-24' : cIdx === 1 ? 'w-36' : 'w-20'
                }`}
              ></div>
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

export function CardSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-slate-800 shrink-0"></div>
            <div className="space-y-2 flex-1">
              <div className="h-3.5 w-32 bg-slate-800 rounded-md"></div>
              <div className="h-2.5 w-20 bg-slate-800/70 rounded-md"></div>
            </div>
          </div>
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <div className="h-3 w-full bg-slate-800/50 rounded-md"></div>
            <div className="h-3 w-3/4 bg-slate-800/50 rounded-md"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
