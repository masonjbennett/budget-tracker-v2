"use client";

import { useFinance } from "@/context/FinanceContext";
import MetricCard from "@/components/MetricCard";
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";
import Chart from "@/components/Chart";
import RingChart from "@/components/RingChart";
import Sparkline from "@/components/Sparkline";

function fmt(val: number, decimals = 0): string {
  return `$${val.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
}

export default function Dashboard() {
  const { data, takeHome, loading } = useFinance();

  if (loading || !takeHome) {
    return (
      <div className="space-y-6">
        <div><div className="skeleton h-9 w-72 mb-3" /><div className="skeleton h-[2px] w-40 mb-3" /><div className="skeleton h-4 w-[28rem]" /></div>
        <div className="skeleton h-48 rounded-2xl" />
        <div className="grid grid-cols-3 gap-4">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-44 rounded-xl" />)}</div>
      </div>
    );
  }

  const monthly = takeHome.monthly_take_home;
  const curMonth = new Date().toISOString().slice(0, 7);
  const monthExpenses = data.expenses.filter(e => e.date.startsWith(curMonth));
  const totalSpent = monthExpenses.reduce((s, e) => s + e.amount, 0);
  const netSavings = monthly - totalSpent;
  const savingsRate = monthly > 0 ? (netSavings / monthly) * 100 : 0;

  const totalAssets = Object.values(data.assets).reduce((s, v) => s + v, 0);
  const totalLiabilities = Object.values(data.liabilities).reduce((s, v) => s + v, 0);
  const netWorth = totalAssets - totalLiabilities;

  const budgetCats = { ...data.budget.needs, ...data.budget.wants, ...data.budget.savings };
  const catSpending: Record<string, number> = {};
  monthExpenses.forEach(e => { catSpending[e.category] = (catSpending[e.category] || 0) + e.amount; });
  const onTrack = Object.entries(budgetCats).filter(([cat, b]) => b === 0 || (catSpending[cat] || 0) <= b).length;
  const adherence = Object.keys(budgetCats).length > 0 ? Math.round(onTrack / Object.keys(budgetCats).length * 100) : 100;

  const monthlyNeeds = Object.values(data.budget.needs).reduce((s, v) => s + v, 0);
  const dti = monthly > 0 ? (data.budget.needs["Min. Debt Payments"] || 0) / monthly * 100 : 0;
  const efMonths = monthlyNeeds > 0 ? (data.assets["Savings"] || 0) / monthlyNeeds : 0;

  const catLabels = Object.keys(catSpending);
  const catValues = Object.values(catSpending);
  const catColors = ["#3b82f6", "#22c55e", "#6366f1", "#eab308", "#ec4899", "#06b6d4", "#8b5cf6", "#f97316", "#14b8a6", "#a855f7"];

  const spendSpark = [2100, 2300, 1900, 2600, 2400, 2200, totalSpent];
  const nwSpark = [21000, 21800, 22500, 23200, 23800, 24200, netWorth];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[2rem] font-bold text-white leading-tight tracking-tight">Dashboard</h1>
          <p className="text-[0.85rem] text-slate-500 mt-1">Your financial overview — updates live across all pages.</p>
        </div>
        <div className="flex items-center gap-2 text-[0.72rem] text-slate-600">
          <kbd className="bg-[#1e293b] px-1.5 py-0.5 rounded border border-[#334155] text-slate-500">⌘K</kbd>
          <span>Search</span>
        </div>
      </div>

      {/* ── Hero bento grid ── */}
      <div className="bento-grid mb-10">
        {/* Big take-home hero */}
        <div className="bento-span-2 card-hero card-glow animate-fade-in">
          <p className="text-[0.72rem] uppercase tracking-[0.1em] text-blue-400/80 font-semibold mb-1">Monthly Take-Home</p>
          <p className="text-[3rem] font-bold text-white leading-none tracking-tight font-num text-gradient-blue">
            {fmt(monthly)}
          </p>
          <p className="text-[0.88rem] text-slate-400 mt-2 font-num">{fmt(takeHome.annual_take_home)} / year</p>
          <div className="flex items-center gap-6 mt-5">
            <div>
              <p className="text-[0.65rem] text-slate-500 uppercase tracking-wider">Federal</p>
              <p className="text-[1.1rem] font-semibold text-slate-300 font-num">{fmt(takeHome.fed_tax)}</p>
            </div>
            <div className="w-px h-8 bg-white/[0.06]" />
            <div>
              <p className="text-[0.65rem] text-slate-500 uppercase tracking-wider">State</p>
              <p className="text-[1.1rem] font-semibold text-slate-300 font-num">{fmt(takeHome.state_tax)}</p>
            </div>
            <div className="w-px h-8 bg-white/[0.06]" />
            <div>
              <p className="text-[0.65rem] text-slate-500 uppercase tracking-wider">FICA</p>
              <p className="text-[1.1rem] font-semibold text-slate-300 font-num">{fmt(takeHome.fica)}</p>
            </div>
            <div className="w-px h-8 bg-white/[0.06]" />
            <div>
              <p className="text-[0.65rem] text-slate-500 uppercase tracking-wider">Effective Rate</p>
              <p className="text-[1.1rem] font-semibold text-yellow font-num">{takeHome.effective_rate.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        {/* Savings rate ring */}
        <div className="card card-glow animate-fade-in flex flex-col items-center justify-center py-6">
          <RingChart
            value={Math.max(0, Math.min(savingsRate, 100))}
            size={130}
            color={savingsRate >= 20 ? "#22c55e" : savingsRate >= 10 ? "#eab308" : "#ef4444"}
            label={`${savingsRate.toFixed(0)}%`}
            sublabel="Savings Rate"
          />
          <p className="text-[0.72rem] text-slate-500 mt-3">
            {savingsRate >= 20 ? "Excellent — on track" : savingsRate >= 10 ? "Good — room to improve" : "Needs attention"}
          </p>
        </div>

        {/* Budget adherence ring */}
        <div className="card card-glow animate-fade-in flex flex-col items-center justify-center py-6">
          <RingChart
            value={adherence}
            size={130}
            color={adherence >= 80 ? "#3b82f6" : adherence >= 60 ? "#eab308" : "#ef4444"}
            label={`${adherence}%`}
            sublabel="On Budget"
          />
          <p className="text-[0.72rem] text-slate-500 mt-3">{onTrack} of {Object.keys(budgetCats).length} categories on track</p>
        </div>
      </div>

      {/* ── Row 2: Key metrics ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 stagger">
        <div className="card card-glow">
          <p className="text-[0.68rem] uppercase tracking-[0.08em] text-muted font-medium">Spent This Month</p>
          <div className="flex items-end justify-between mt-1">
            <p className="text-[1.7rem] font-bold text-white font-num">{fmt(totalSpent)}</p>
            <Sparkline data={spendSpark} color="auto" width={64} height={24} />
          </div>
          <p className="text-[0.72rem] text-slate-500 mt-1">{monthExpenses.length} transactions</p>
        </div>

        <div className="card card-glow">
          <p className="text-[0.68rem] uppercase tracking-[0.08em] text-muted font-medium">Net Savings</p>
          <p className={`text-[1.7rem] font-bold font-num mt-1 ${netSavings >= 0 ? "text-green" : "text-red"}`}>{fmt(netSavings)}</p>
          <p className="text-[0.72rem] text-slate-500 mt-1">{netSavings >= 0 ? "On track this month" : "Over budget"}</p>
        </div>

        <div className="card card-glow">
          <p className="text-[0.68rem] uppercase tracking-[0.08em] text-muted font-medium">Net Worth</p>
          <div className="flex items-end justify-between mt-1">
            <p className="text-[1.7rem] font-bold text-white font-num">{fmt(netWorth)}</p>
            <Sparkline data={nwSpark} color="auto" width={64} height={24} />
          </div>
          <p className="text-[0.72rem] text-green mt-1">+{fmt(1700)} from last snapshot</p>
        </div>

        <div className="card card-glow">
          <p className="text-[0.68rem] uppercase tracking-[0.08em] text-muted font-medium">Emergency Fund</p>
          <p className={`text-[1.7rem] font-bold font-num mt-1 ${efMonths >= 6 ? "text-green" : efMonths >= 3 ? "text-yellow" : "text-red"}`}>{efMonths.toFixed(1)} mo</p>
          <p className="text-[0.72rem] text-slate-500 mt-1">{efMonths >= 6 ? "Strong coverage" : "Building up"}</p>
        </div>
      </div>

      {/* ── Spending breakdown ── */}
      {catLabels.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <h2 className="text-[1.1rem] font-semibold text-white">Spending Breakdown</h2>
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-[0.68rem] text-slate-600">{new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* Donut chart */}
            <div className="lg:col-span-2">
              <Chart
                data={[{
                  labels: catLabels, values: catValues, type: "pie", hole: 0.6,
                  marker: { colors: catColors.slice(0, catLabels.length), line: { color: "#0f172a", width: 2 } },
                  textinfo: "percent", textposition: "inside",
                  textfont: { size: 11, color: "#f8fafc" },
                  hovertemplate: "<b>%{label}</b><br>$%{value:,.2f}<br>%{percent}<extra></extra>",
                }]}
                layout={{ showlegend: false, margin: { l: 20, r: 20, t: 10, b: 10 } }}
                height={300}
              />
            </div>

            {/* Category list */}
            <div className="lg:col-span-3 card card-glow p-0 overflow-hidden">
              <div className="divide-y divide-white/[0.04]">
                {Object.entries(catSpending).sort((a, b) => b[1] - a[1]).map(([cat, amount], i) => {
                  const pct = totalSpent > 0 ? (amount / totalSpent * 100) : 0;
                  const budgeted = budgetCats[cat] || 0;
                  const over = budgeted > 0 && amount > budgeted;
                  return (
                    <div key={cat} className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: catColors[i % catColors.length] }} />
                      <span className="text-[0.82rem] text-slate-300 flex-1">{cat}</span>
                      <div className="w-20">
                        <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%`, background: catColors[i % catColors.length] }} />
                        </div>
                      </div>
                      <span className="text-[0.82rem] font-num text-white font-medium w-20 text-right">{fmt(amount, 2)}</span>
                      {over && <span className="text-[0.6rem] text-red font-semibold">OVER</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Cash flow bar ── */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <h2 className="text-[1.1rem] font-semibold text-white">Cash Flow</h2>
          <div className="flex-1 h-px bg-white/[0.06]" />
        </div>
        <Chart
          data={[{
            x: ["Income", "Spent", "Net Savings"],
            y: [monthly, totalSpent, netSavings], type: "bar",
            marker: { color: ["#3b82f6", "#ef4444", netSavings >= 0 ? "#22c55e" : "#ef4444"] },
            text: [fmt(monthly), fmt(totalSpent), fmt(netSavings)],
            textposition: "outside", textfont: { size: 13, color: "#94a3b8" },
            width: [0.4, 0.4, 0.4],
          }]}
          layout={{ yaxis: { tickprefix: "$", tickformat: ",.0f" }, showlegend: false, margin: { l: 80, r: 40, t: 20, b: 40 } }}
          height={300}
        />
      </div>

      <Footer />
    </div>
  );
}
