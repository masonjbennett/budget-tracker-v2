"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import MetricCard from "@/components/MetricCard";
import StatusCard from "@/components/StatusCard";

function fmt(val: number): string {
  return `$${val.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export default function DebtPage() {
  const [debts, setDebts] = useState([
    { name: "Student Loan", balance: 35000, rate: 5.5, min_payment: 370 },
  ]);
  const [extra, setExtra] = useState(200);
  const [result, setResult] = useState<any>(null);
  const [snowball, setSnowball] = useState<any>(null);
  const [newDebt, setNewDebt] = useState({ name: "", balance: 0, rate: 5.0, min_payment: 0 });

  const calculate = async () => {
    const [av, sn] = await Promise.all([
      api<any>("/api/debt-payoff", { debts, extra, strategy: "avalanche" }),
      api<any>("/api/debt-payoff", { debts, extra, strategy: "snowball" }),
    ]);
    setResult(av);
    setSnowball(sn);
  };

  const addDebt = () => {
    if (newDebt.name && newDebt.balance > 0) {
      setDebts([...debts, { ...newDebt }]);
      setNewDebt({ name: "", balance: 0, rate: 5.0, min_payment: 0 });
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white">Debt Payoff Planner</h1>
      <p className="text-slate-400 mt-1 mb-6">Compare payoff strategies and see how extra payments accelerate your path to debt-free.</p>

      {/* Debt list */}
      {debts.length > 0 && (
        <div className="card overflow-hidden mb-6">
          <table className="w-full text-sm">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="text-left px-4 py-3 text-slate-400 font-medium uppercase tracking-wider text-xs">Debt</th>
                <th className="text-right px-4 py-3 text-slate-400 font-medium uppercase tracking-wider text-xs">Balance</th>
                <th className="text-right px-4 py-3 text-slate-400 font-medium uppercase tracking-wider text-xs">Rate</th>
                <th className="text-right px-4 py-3 text-slate-400 font-medium uppercase tracking-wider text-xs">Min Payment</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {debts.map((d, i) => (
                <tr key={i} className="border-t border-slate-700/50 hover:bg-slate-800/50/50 transition-colors">
                  <td className="px-4 py-3 font-medium">{d.name}</td>
                  <td className="px-4 py-3 text-right">{fmt(d.balance)}</td>
                  <td className="px-4 py-3 text-right">{d.rate}%</td>
                  <td className="px-4 py-3 text-right">{fmt(d.min_payment)}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setDebts(debts.filter((_, j) => j !== i))} className="text-red hover:underline text-xs">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add debt */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        <input placeholder="Debt name" value={newDebt.name} onChange={(e) => setNewDebt({...newDebt, name: e.target.value})}
          className="border border-slate-700/50 rounded-lg px-3 py-2 text-sm focus:border-accent outline-none" />
        <input type="number" placeholder="Balance" value={newDebt.balance || ""} onChange={(e) => setNewDebt({...newDebt, balance: +e.target.value})}
          className="border border-slate-700/50 rounded-lg px-3 py-2 text-sm focus:border-accent outline-none" />
        <input type="number" placeholder="Rate %" value={newDebt.rate || ""} onChange={(e) => setNewDebt({...newDebt, rate: +e.target.value})}
          className="border border-slate-700/50 rounded-lg px-3 py-2 text-sm focus:border-accent outline-none" />
        <input type="number" placeholder="Min payment" value={newDebt.min_payment || ""} onChange={(e) => setNewDebt({...newDebt, min_payment: +e.target.value})}
          className="border border-slate-700/50 rounded-lg px-3 py-2 text-sm focus:border-accent outline-none" />
        <button onClick={addDebt} className="bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors">Add</button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <label className="text-sm font-medium text-slate-400">Extra Monthly Payment ($)</label>
        <input type="number" value={extra} onChange={(e) => setExtra(+e.target.value)}
          className="w-32 border border-slate-700/50 rounded-lg px-3 py-2 text-sm focus:border-accent outline-none" />
        <button onClick={calculate}
          className="bg-accent text-white px-6 py-2 rounded-lg font-semibold hover:bg-accent/90 transition-all text-sm">
          Compare Strategies
        </button>
      </div>

      {/* Results */}
      {result && snowball && result.months !== -1 && (
        <div>
          <hr className="border-slate-700/50 mb-8" />
          <h2 className="text-xl font-bold text-white mb-4">Strategy Comparison</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-800/50 border-l-4 border-l-green/50 border border-slate-700/50 rounded-xl p-5">
              <h3 className="text-lg font-bold text-green">Avalanche</h3>
              <p className="text-xs text-slate-400">Highest interest rate first</p>
              <p className="text-2xl font-bold mt-2">{result.months} months</p>
              <p className="text-sm text-red mt-1">Interest: {fmt(result.total_interest)}</p>
            </div>
            <div className="bg-slate-800/50 border-l-4 border-l-accent/50 border border-slate-700/50 rounded-xl p-5">
              <h3 className="text-lg font-bold text-accent">Snowball</h3>
              <p className="text-xs text-slate-400">Smallest balance first</p>
              <p className="text-2xl font-bold mt-2">{snowball.months} months</p>
              <p className="text-sm text-red mt-1">Interest: {fmt(snowball.total_interest)}</p>
            </div>
          </div>
          {snowball.total_interest > result.total_interest && (
            <p className="text-green font-semibold">Avalanche saves you {fmt(snowball.total_interest - result.total_interest)} in interest!</p>
          )}
        </div>
      )}
      {result && result.months === -1 && (
        <div className="bg-red/10 border border-red/30 rounded-xl p-5">
          <p className="text-red font-semibold">Your payments don't cover the monthly interest. Increase payments to make progress.</p>
        </div>
      )}
    </div>
  );
}
