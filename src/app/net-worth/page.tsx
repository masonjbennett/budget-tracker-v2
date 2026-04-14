"use client";

import { useFinance } from "@/context/FinanceContext";
import MetricCard from "@/components/MetricCard";
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";

function fmt(val: number): string {
  return `$${val.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export default function NetWorthPage() {
  const { data, updateAssets, updateLiabilities } = useFinance();
  const totalAssets = Object.values(data.assets).reduce((s, v) => s + v, 0);
  const totalLiabilities = Object.values(data.liabilities).reduce((s, v) => s + v, 0);

  return (
    <div>
      <PageHeader title="Net Worth Tracker" description="Track assets and liabilities — changes reflect on Dashboard instantly." />
      <div className="grid grid-cols-3 gap-4 mb-8 stagger">
        <MetricCard label="Total Assets" value={fmt(totalAssets)} />
        <MetricCard label="Total Liabilities" value={fmt(totalLiabilities)} />
        <MetricCard label="Net Worth" value={fmt(totalAssets - totalLiabilities)} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-[0.85rem] font-semibold text-white mb-4">Assets</h3>
          <div className="space-y-3">{Object.entries(data.assets).map(([n, v]) => (
            <div key={n} className="flex items-center gap-3">
              <label className="text-[0.82rem] text-slate-400 w-24 shrink-0">{n}</label>
              <input type="number" value={v} onChange={e => updateAssets({...data.assets, [n]: +e.target.value})} />
            </div>))}</div>
        </div>
        <div className="card">
          <h3 className="text-[0.85rem] font-semibold text-white mb-4">Liabilities</h3>
          <div className="space-y-3">{Object.entries(data.liabilities).map(([n, v]) => (
            <div key={n} className="flex items-center gap-3">
              <label className="text-[0.82rem] text-slate-400 w-24 shrink-0">{n}</label>
              <input type="number" value={v} onChange={e => updateLiabilities({...data.liabilities, [n]: +e.target.value})} />
            </div>))}</div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
