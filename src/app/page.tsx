"use client";

import { useFinance } from "@/context/FinanceContext";
import MetricCard from "@/components/MetricCard";
import StatusCard from "@/components/StatusCard";
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
      <div className="space-y-8">
        <div><div className="skeleton h-7 w-48 mb-2" /><div className="skeleton h-4 w-72" /></div>
        <div className="grid grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-24 rounded-xl" />)}</div>
        <div className="grid grid-cols-3 gap-4">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-36 rounded-xl" />)}</div>
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
  const catColors = ["#5b8def", "#4ade80", "#818cf8", "#fbbf24", "#f472b6", "#22d3ee", "#c084fc", "#fb923c", "#2dd4bf", "#e879f9"];
  const spendSpark = [2100, 2300, 1900, 2600, 2400, 2200, totalSpent];
  const nwSpark = [21000, 21800, 22500, 23200, 23800, 24200, netWorth];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[1.5rem] font-semibold text-primary tracking-tight">Dashboard</h1>
          <p className="text-[0.8125rem] text-muted mt-0.5">Financial overview — updates live across all pages.</p>
        </div>
        <kbd className="text-[0.625rem] text-muted bg-surface px-2 py-1 rounded border border-white/[0.06]">⌘K</kbd>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-12 stagger">
        <div className="card">
          <p className="text-[0.6875rem] uppercase tracking-[0.06em] text-muted font-medium">Take-Home</p>
          <p className="text-[2rem] font-bold text-primary mt-1 tracking-tight font-num leading-none">{fmt(monthly)}</p>
          <p className="text-[0.6875rem] text-muted mt-1.5 font-num">{fmt(takeHome.annual_take_home)}/yr · {takeHome.effective_rate.toFixed(1)}% tax</p>
        </div>
        <div className="card">
          <p className="text-[0.6875rem] uppercase tracking-[0.06em] text-muted font-medium">Spent</p>
          <div className="flex items-end justify-between mt-1">
            <p className="text-[2rem] font-bold text-primary tracking-tight font-num leading-none">{fmt(totalSpent)}</p>
            <Sparkline data={spendSpark} color="auto" width={56} height={20} />
          </div>
          <p className="text-[0.6875rem] text-muted mt-1.5">{monthExpenses.length} transactions</p>
        </div>
        <div className="card">
          <p className="text-[0.6875rem] uppercase tracking-[0.06em] text-muted font-medium">Net Worth</p>
          <div className="flex items-end justify-between mt-1">
            <p className="text-[2rem] font-bold text-primary tracking-tight font-num leading-none">{fmt(netWorth)}</p>
            <Sparkline data={nwSpark} color="auto" width={56} height={20} />
          </div>
          <p className="text-[0.6875rem] text-green mt-1.5">+{fmt(1700)} from last month</p>
        </div>
        <div className="card">
          <p className="text-[0.6875rem] uppercase tracking-[0.06em] text-muted font-medium">Net Savings</p>
          <p className={`text-[2rem] font-bold tracking-tight font-num leading-none mt-1 ${netSavings >= 0 ? "text-green" : "text-red"}`}>{fmt(netSavings)}</p>
          <p className="text-[0.6875rem] text-muted mt-1.5">{savingsRate.toFixed(0)}% savings rate</p>
        </div>
      </div>

      {/* Health indicators */}
      <p className="text-[0.6875rem] uppercase tracking-[0.1em] text-muted font-medium mb-3">Financial Health</p>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-12">
        {/* Rings */}
        <div className="card flex flex-col items-center justify-center py-5">
          <RingChart value={Math.max(0, Math.min(savingsRate, 100))} size={100} strokeWidth={7}
            color={savingsRate >= 20 ? "#4ade80" : savingsRate >= 10 ? "#fbbf24" : "#f87171"}
            label={`${savingsRate.toFixed(0)}%`} sublabel="Savings" />
        </div>
        <div className="card flex flex-col items-center justify-center py-5">
          <RingChart value={adherence} size={100} strokeWidth={7}
            color={adherence >= 80 ? "#5b8def" : "#fbbf24"}
            label={`${adherence}%`} sublabel="On Budget" />
        </div>
        {/* Status cards */}
        <StatusCard label="Debt-to-Income" value={`${dti.toFixed(1)}%`}
          status={dti === 0 ? "Debt-Free" : dti <= 20 ? "Healthy" : "Watch"}
          color={dti <= 20 ? "green" : dti <= 36 ? "yellow" : "red"} />
        <StatusCard label="Emergency Fund" value={`${efMonths.toFixed(1)} mo`}
          status={efMonths >= 6 ? "Strong" : efMonths >= 3 ? "Building" : "Priority"}
          color={efMonths >= 6 ? "green" : efMonths >= 3 ? "yellow" : "red"} />
        <StatusCard label="Budget Adherence" value={`${onTrack}/${Object.keys(budgetCats).length}`}
          status={adherence >= 80 ? "On Track" : "Watch"}
          color={adherence >= 80 ? "blue" : "yellow"} />
      </div>

      {/* Spending */}
      {catLabels.length > 0 && (
        <>
          <p className="text-[0.6875rem] uppercase tracking-[0.1em] text-muted font-medium mb-3">
            Spending · {new Date().toLocaleDateString("en-US", { month: "long" })}
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 mb-12">
            <div className="lg:col-span-2">
              <Chart
                data={[{
                  labels: catLabels, values: catValues, type: "pie", hole: 0.65,
                  marker: { colors: catColors.slice(0, catLabels.length), line: { color: "#09090b", width: 2 } },
                  textinfo: "percent", textposition: "inside",
                  textfont: { size: 10, color: "#ededed" },
                  hovertemplate: "<b>%{label}</b><br>$%{value:,.2f}<br>%{percent}<extra></extra>",
                }]}
                layout={{ showlegend: false, margin: { l: 10, r: 10, t: 10, b: 10 } }}
                height={280}
              />
            </div>
            <div className="lg:col-span-3 card p-0 overflow-hidden">
              <div className="divide-y divide-white/[0.04]">
                {Object.entries(catSpending).sort((a, b) => b[1] - a[1]).map(([cat, amount], i) => {
                  const pct = totalSpent > 0 ? (amount / totalSpent * 100) : 0;
                  return (
                    <div key={cat} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.02] transition-colors">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: catColors[i % catColors.length] }} />
                      <span className="text-[0.8125rem] text-dim flex-1">{cat}</span>
                      <div className="w-16">
                        <div className="h-1 bg-white/[0.04] rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: catColors[i % catColors.length] }} />
                        </div>
                      </div>
                      <span className="text-[0.8125rem] font-num text-primary w-20 text-right">{fmt(amount, 2)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Cash flow */}
      <p className="text-[0.6875rem] uppercase tracking-[0.1em] text-muted font-medium mb-3">Cash Flow</p>
      <Chart
        data={[{
          x: ["Income", "Spent", "Savings"],
          y: [monthly, totalSpent, netSavings], type: "bar",
          marker: { color: ["#5b8def", "#f87171", netSavings >= 0 ? "#4ade80" : "#f87171"] },
          text: [fmt(monthly), fmt(totalSpent), fmt(netSavings)],
          textposition: "outside", textfont: { size: 12, color: "#888888" },
          width: [0.35, 0.35, 0.35],
        }]}
        layout={{ yaxis: { tickprefix: "$", tickformat: ",.0f" }, showlegend: false }}
        height={280}
        className="mb-12"
      />

      <Footer />
    </div>
  );
}
