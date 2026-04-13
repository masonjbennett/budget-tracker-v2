"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";

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
    setResult(av); setSnowball(sn);
  };

  const addDebt = () => {
    if (newDebt.name && newDebt.balance > 0) {
      setDebts([...debts, { ...newDebt }]);
      setNewDebt({ name: "", balance: 0, rate: 5.0, min_payment: 0 });
    }
  };

  return (
    <div>
      <PageHeader title="Debt Payoff Planner" description="Compare payoff strategies and see how extra payments accelerate your path to debt-free. Uses standard amortization with monthly compounding." />

      {/* Debt table */}
      {debts.length > 0 && (
        <div className="card overflow-hidden p-0 mb-6">
          <table>
            <thead>
              <tr>
                <th className="pl-5">Debt</th>
                <th className="text-right">Balance</th>
                <th className="text-right">Rate</th>
                <th className="text-right">Min Payment</th>
                <th className="pr-5 text-right w-20"></th>
              </tr>
            </thead>
            <tbody>
              {debts.map((d, i) => (
                <tr key={i}>
                  <td className="pl-5 font-medium text-white">{d.name}</td>
                  <td className="text-right font-num">{fmt(d.balance)}</td>
                  <td className="text-right font-num">{d.rate}%</td>
                  <td className="text-right font-num">{fmt(d.min_payment)}</td>
                  <td className="pr-5 text-right">
                    <button onClick={() => setDebts(debts.filter((_, j) => j !== i))} className="text-[0.72rem] text-slate-600 hover:text-red transition-colors">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add debt */}
      <div className="card mb-6">
        <h3 className="text-[0.82rem] font-semibold text-white mb-3">Add Debt</h3>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <input placeholder="Debt name" value={newDebt.name} onChange={(e) => setNewDebt({...newDebt, name: e.target.value})} />
          <input type="number" placeholder="Balance ($)" value={newDebt.balance || ""} onChange={(e) => setNewDebt({...newDebt, balance: +e.target.value})} />
          <input type="number" placeholder="Rate %" value={newDebt.rate || ""} step={0.1} onChange={(e) => setNewDebt({...newDebt, rate: +e.target.value})} />
          <input type="number" placeholder="Min payment ($)" value={newDebt.min_payment || ""} onChange={(e) => setNewDebt({...newDebt, min_payment: +e.target.value})} />
          <button onClick={addDebt} className="btn-primary py-2.5">Add</button>
        </div>
      </div>

      {/* Controls */}
      <div className="card mb-8">
        <div className="flex items-center gap-4">
          <label className="text-[0.82rem] text-slate-400 font-medium whitespace-nowrap">Extra Monthly Payment</label>
          <input type="number" value={extra} onChange={(e) => setExtra(+e.target.value)} className="w-28" />
          <button onClick={calculate} className="btn-primary whitespace-nowrap">Compare Strategies</button>
        </div>
      </div>

      {/* Results */}
      {result && snowball && result.months !== -1 && (
        <div className="animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-[1.05rem] font-semibold text-white">Strategy Comparison</h2>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="card border-green/20 bg-green/[0.03]">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[0.95rem] font-bold text-green">Avalanche</h3>
                <span className="badge badge-green">Recommended</span>
              </div>
              <p className="text-[0.75rem] text-slate-500">Highest interest rate first</p>
              <p className="text-[2rem] font-bold text-white font-num mt-2">{result.months} months</p>
              <p className="text-[0.82rem] text-slate-400 mt-1">{(result.months / 12).toFixed(1)} years · {fmt(result.total_interest)} interest</p>
            </div>
            <div className="card">
              <h3 className="text-[0.95rem] font-bold text-accent mb-2">Snowball</h3>
              <p className="text-[0.75rem] text-slate-500">Smallest balance first</p>
              <p className="text-[2rem] font-bold text-white font-num mt-2">{snowball.months} months</p>
              <p className="text-[0.82rem] text-slate-400 mt-1">{(snowball.months / 12).toFixed(1)} years · {fmt(snowball.total_interest)} interest</p>
            </div>
          </div>
          {snowball.total_interest > result.total_interest && (
            <div className="card bg-green/[0.03] border-green/20">
              <p className="text-[0.85rem] text-green font-semibold">Avalanche saves you {fmt(snowball.total_interest - result.total_interest)} in interest.</p>
            </div>
          )}
        </div>
      )}

      {result && result.months === -1 && (
        <div className="card bg-red/[0.05] border-red/20">
          <p className="text-red font-semibold">Your payments don't cover monthly interest. Increase payments to make progress.</p>
        </div>
      )}

      {!result && debts.length === 0 && (
        <div className="card min-h-[16rem] flex items-center justify-center">
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.03] flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <p className="text-sm text-slate-400 font-medium">Debt-free is a great place to be</p>
            <p className="text-xs text-slate-600 mt-1">Add debts above to compare payoff strategies.</p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
