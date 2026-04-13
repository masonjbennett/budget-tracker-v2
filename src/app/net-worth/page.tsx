"use client";

import { useState } from "react";
import MetricCard from "@/components/MetricCard";

function fmt(val: number): string {
  return `$${val.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export default function NetWorthPage() {
  const [assets, setAssets] = useState<Record<string, number>>({
    Checking: 6200, Savings: 9500, "401(k)": 4800, "Roth IRA": 2500, Brokerage: 1800,
  });
  const [liabilities, setLiabilities] = useState<Record<string, number>>({
    "Student Loans": 0, "Car Loan": 0, "Credit Cards": 0,
  });

  const totalAssets = Object.values(assets).reduce((s, v) => s + v, 0);
  const totalLiabilities = Object.values(liabilities).reduce((s, v) => s + v, 0);
  const netWorth = totalAssets - totalLiabilities;

  return (
    <div>
      <h1 className="text-3xl font-bold text-white">Net Worth Tracker</h1>
      <p className="text-slate-400 mt-1 mb-6">Track assets, liabilities, and net worth over time.</p>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <MetricCard label="Total Assets" value={fmt(totalAssets)} />
        <MetricCard label="Total Liabilities" value={fmt(totalLiabilities)} />
        <MetricCard label="Net Worth" value={fmt(netWorth)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-bold text-white mb-3">Assets</h2>
          <div className="space-y-3">
            {Object.entries(assets).map(([name, value]) => (
              <div key={name} className="flex items-center gap-3">
                <label className="text-sm text-slate-400 w-28">{name}</label>
                <input type="number" value={value}
                  onChange={(e) => setAssets({ ...assets, [name]: +e.target.value })}
                  className="flex-1 border border-slate-700/50 rounded-lg px-3 py-2 text-sm focus:border-accent outline-none" />
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-lg font-bold text-white mb-3">Liabilities</h2>
          <div className="space-y-3">
            {Object.entries(liabilities).map(([name, value]) => (
              <div key={name} className="flex items-center gap-3">
                <label className="text-sm text-slate-400 w-28">{name}</label>
                <input type="number" value={value}
                  onChange={(e) => setLiabilities({ ...liabilities, [name]: +e.target.value })}
                  className="flex-1 border border-slate-700/50 rounded-lg px-3 py-2 text-sm focus:border-accent outline-none" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
