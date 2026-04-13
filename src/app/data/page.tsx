"use client";

export default function DataPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white">Data Management</h1>
      <p className="text-slate-400 mt-1 mb-6">Export your data, import backups, or reset to start fresh.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-bold text-white mb-3">Export</h2>
          <div className="space-y-3">
            <button className="w-full card p-4 text-left hover:border-accent/40 transition-all">
              <p className="font-medium">📥 Export All Data (JSON)</p>
              <p className="text-xs text-slate-400 mt-1">Full backup of all your financial data</p>
            </button>
            <button className="w-full card p-4 text-left hover:border-accent/40 transition-all">
              <p className="font-medium">📥 Export Expenses (CSV)</p>
              <p className="text-xs text-slate-400 mt-1">Spreadsheet-compatible expense export</p>
            </button>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-bold text-white mb-3">Import</h2>
          <div className="bg-slate-800/50 border-2 border-dashed border-slate-700/50 rounded-xl p-8 text-center hover:border-accent transition-colors cursor-pointer">
            <p className="text-slate-400 text-sm">Drop a JSON backup here or click to browse</p>
            <input type="file" accept=".json" className="hidden" />
          </div>
        </div>
      </div>

      <hr className="border-slate-700/50 my-8" />

      <h2 className="text-lg font-bold text-white mb-3">About This App</h2>
      <div className="card p-5">
        <p className="mb-2">
          <strong>Budget Tracker</strong> — a personal finance management tool built by{" "}
          <a href="https://masonjbennett.com" target="_blank" className="text-accent font-medium hover:underline">Mason Bennett</a>.
        </p>
        <p className="text-sm text-slate-400 mb-2">
          11 tools covering income planning, budgeting, expense tracking, net worth, debt payoff optimization,
          savings goals, investment modeling, FIRE planning, and tax estimation.
        </p>
        <p className="text-sm text-slate-400 mb-2">
          <strong>Tax data:</strong> Official IRS 2026 brackets (Rev. Proc. 2025-32), all 50 states + DC,
          SALT cap updated per OBBBA. 401(k) limit $24,500, SS wage base $184,500.
        </p>
        <p className="text-sm text-slate-400">
          <strong>Built with:</strong> Next.js, FastAPI, Tailwind CSS, Plotly, Supabase ·{" "}
          <a href="https://github.com/masonjbennett/budgeting-app" target="_blank" className="text-accent hover:underline">View source</a>
        </p>
      </div>
    </div>
  );
}
