"use client";

import { useState } from "react";
import MetricCard from "@/components/MetricCard";
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";

function fmt(val: number): string {
  return `$${val.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export default function NetWorthPage() {
  const [assets, setAssets] = useState<Record<string, number>>({ Checking: 6200, Savings: 9500, "401(k)": 4800, "Roth IRA": 2500, Brokerage: 1800 });
  const [liabilities, setLiabilities] = useState<Record<string, number>>({ "Student Loans": 0, "Car Loan": 0, "Credit Cards": 0 });
  const totalAssets = Object.values(assets).reduce((s, v) => s + v, 0);
  const totalLiabilities = Object.values(liabilities).reduce((s, v) => s + v, 0);

  return (
    <div>
      <PageHeader title="Net Worth Tracker" description="Track assets, liabilities, and net worth over time." />
      <div className="grid grid-cols-3 gap-4 mb-8 stagger">
        <MetricCard label="Total Assets" value={fmt(totalAssets)} />
        <MetricCard label="Total Liabilities" value={fmt(totalLiabilities)} />
        <MetricCard label="Net Worth" value={fmt(totalAssets - totalLiabilities)} delta="+$1,700 from last snapshot" deltaColor="green" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-[0.85rem] font-semibold text-white mb-4">Assets</h3>
          <div className="space-y-3">{Object.entries(assets).map(([n, v]) => (
            <div key={n} className="flex items-center gap-3">
              <label className="text-[0.82rem] text-slate-400 w-24 shrink-0">{n}</label>
              <input type="number" value={v} onChange={(e) => setAssets({...assets, [n]: +e.target.value})} />
            </div>))}</div>
        </div>
        <div className="card">
          <h3 className="text-[0.85rem] font-semibold text-white mb-4">Liabilities</h3>
          <div className="space-y-3">{Object.entries(liabilities).map(([n, v]) => (
            <div key={n} className="flex items-center gap-3">
              <label className="text-[0.82rem] text-slate-400 w-24 shrink-0">{n}</label>
              <input type="number" value={v} onChange={(e) => setLiabilities({...liabilities, [n]: +e.target.value})} />
            </div>))}</div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
