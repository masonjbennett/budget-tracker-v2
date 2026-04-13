"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";

function fmt(val: number): string {
  return `$${val.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export default function InvestmentsPage() {
  const [inputs, setInputs] = useState({
    starting_amount: 5000, monthly_contribution: 500,
    annual_return: 7.0, time_horizon: 30, contribution_growth: 3.0,
  });
  const [results, setResults] = useState<any>(null);

  const calculate = async () => {
    const [conservative, moderate, aggressive] = await Promise.all([
      api<any>("/api/investment-project", { ...inputs, annual_return: 5.0 }),
      api<any>("/api/investment-project", { ...inputs, annual_return: 7.0 }),
      api<any>("/api/investment-project", { ...inputs, annual_return: 10.0 }),
    ]);
    setResults({ conservative, moderate, aggressive });
  };

  const u = (field: string, value: any) => setInputs({ ...inputs, [field]: value });

  return (
    <div>
      <PageHeader title="Investment Growth Projector" description="Model compound growth across scenarios with income growth modeling." />

      <div className="card mb-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <div><label className="block text-[0.78rem] font-medium text-slate-400 mb-1.5">Starting Amount ($)</label>
            <input type="number" value={inputs.starting_amount} onChange={(e) => u("starting_amount", +e.target.value)} /></div>
          <div><label className="block text-[0.78rem] font-medium text-slate-400 mb-1.5">Monthly Contribution ($)</label>
            <input type="number" value={inputs.monthly_contribution} onChange={(e) => u("monthly_contribution", +e.target.value)} /></div>
          <div><label className="block text-[0.78rem] font-medium text-slate-400 mb-1.5">Time Horizon — {inputs.time_horizon} yrs</label>
            <input type="range" min={1} max={50} value={inputs.time_horizon} onChange={(e) => u("time_horizon", +e.target.value)} /></div>
        </div>
      </div>

      <button onClick={calculate} className="btn-primary w-full py-3 mb-8">Project Growth</button>

      {results && (
        <div className="animate-fade-in">
          <div className="grid grid-cols-3 gap-4 stagger">
            {[
              { label: "Conservative (5%)", data: results.conservative, color: "accent", border: "border-accent/20" },
              { label: "Moderate (7%)", data: results.moderate, color: "green", border: "border-green/20" },
              { label: "Aggressive (10%)", data: results.aggressive, color: "yellow", border: "border-yellow/20" },
            ].map(({ label, data, color, border }) => {
              const final = data.values[data.values.length - 1];
              const contributed = data.contributions[data.contributions.length - 1];
              return (
                <div key={label} className={`card ${border}`}>
                  <p className={`text-[0.82rem] font-semibold text-${color}`}>{label}</p>
                  <p className="text-[1.8rem] font-bold text-white font-num mt-1">{fmt(final)}</p>
                  <div className="mt-2 text-[0.78rem] space-y-1">
                    <div className="flex justify-between"><span className="text-slate-500">Contributed</span><span className="font-num text-slate-400">{fmt(contributed)}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Growth</span><span className={`font-num text-${color}`}>{fmt(final - contributed)}</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
