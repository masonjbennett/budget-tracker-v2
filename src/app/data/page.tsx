"use client";

import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";

export default function DataPage() {
  return (
    <div>
      <PageHeader title="Settings" description="Export your data, import backups, or reset to start fresh." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h3 className="text-[0.85rem] font-semibold text-white mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Export
          </h3>
          <div className="space-y-3">
            <button className="w-full py-3 px-4 rounded-lg bg-white/[0.03] border border-white/[0.06] text-left hover:border-accent/30 transition-all group">
              <p className="text-[0.85rem] text-slate-300 font-medium group-hover:text-white transition-colors">Export All Data (JSON)</p>
              <p className="text-[0.72rem] text-slate-600 mt-0.5">Full backup of all your financial data</p>
            </button>
            <button className="w-full py-3 px-4 rounded-lg bg-white/[0.03] border border-white/[0.06] text-left hover:border-accent/30 transition-all group">
              <p className="text-[0.85rem] text-slate-300 font-medium group-hover:text-white transition-colors">Export Expenses (CSV)</p>
              <p className="text-[0.72rem] text-slate-600 mt-0.5">Spreadsheet-compatible expense export</p>
            </button>
          </div>
        </div>
        <div className="card">
          <h3 className="text-[0.85rem] font-semibold text-white mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            Import
          </h3>
          <div className="py-10 rounded-lg border-2 border-dashed border-white/[0.08] text-center hover:border-accent/30 transition-colors cursor-pointer">
            <svg className="w-8 h-8 text-slate-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
            <p className="text-[0.82rem] text-slate-500">Drop a JSON backup or click to browse</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-[1.05rem] font-semibold text-white">About</h2>
        <div className="flex-1 h-px bg-white/[0.06]" />
      </div>
      <div className="card bg-white/[0.02]">
        <p className="text-[0.88rem] text-slate-300 mb-3">
          <strong className="text-white">Budget Tracker</strong> — personal finance management built by{" "}
          <a href="https://masonjbennett.com" target="_blank" rel="noopener noreferrer" className="text-accent font-medium hover:underline">Mason Bennett</a>.
        </p>
        <div className="space-y-2 text-[0.82rem] text-slate-500">
          <p>11 tools: income planning, budgeting, expense tracking, net worth, debt payoff, savings goals, investment modeling, FIRE planning, Monte Carlo simulation, and tax estimation.</p>
          <p><strong className="text-slate-400">Tax data:</strong> Official IRS 2026 brackets (Rev. Proc. 2025-32), all 50 states + DC. SALT cap per OBBBA. 401(k) $24,500, SS $184,500.</p>
          <p><strong className="text-slate-400">Stack:</strong> Next.js · FastAPI · Tailwind CSS · Supabase · Plotly ·{" "}
            <a href="https://github.com/masonjbennett/budget-tracker-v2" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">GitHub</a>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
