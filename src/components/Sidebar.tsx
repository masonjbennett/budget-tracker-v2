"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_GROUPS = [
  {
    label: "OVERVIEW",
    items: [{ icon: "📊", name: "Dashboard", href: "/" }],
  },
  {
    label: "MANAGE",
    items: [
      { icon: "💰", name: "Income Setup", href: "/income" },
      { icon: "📋", name: "Budget Builder", href: "/budget" },
      { icon: "💳", name: "Expenses", href: "/expenses" },
    ],
  },
  {
    label: "GROW",
    items: [
      { icon: "📈", name: "Net Worth", href: "/net-worth" },
      { icon: "🎯", name: "Savings Goals", href: "/goals" },
      { icon: "🏦", name: "Debt Payoff", href: "/debt" },
    ],
  },
  {
    label: "PLAN",
    items: [
      { icon: "📈", name: "Investments", href: "/investments" },
      { icon: "🔥", name: "FIRE Calculator", href: "/fire" },
      { icon: "🧾", name: "Tax Estimator", href: "/tax" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 h-full w-60 bg-[#0c1425] border-r border-[#1e293b] flex flex-col z-50">
      {/* Header */}
      <div className="px-5 py-5 border-b border-[#1e293b]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
            B
          </div>
          <div>
            <h1 className="text-[0.95rem] font-semibold text-white tracking-tight leading-tight">
              Budget Tracker
            </h1>
            <p className="text-[0.65rem] text-slate-500">
              <a href="https://masonjbennett.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-400 transition-colors">
                masonjbennett.com
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-2">
        {NAV_GROUPS.map((group, gi) => (
          <div key={group.label}>
            <p className={`text-[0.6rem] uppercase tracking-[0.1em] text-slate-600 font-medium px-2.5 mb-1 ${gi === 0 ? "mt-2" : "mt-5"}`}>
              {group.label}
            </p>
            {group.items.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-2.5 py-[0.45rem] rounded-md text-[0.82rem] mb-[1px] transition-all duration-150 ${
                    active
                      ? "bg-blue-500/10 text-blue-400 font-medium"
                      : "text-slate-400 hover:bg-white/[0.03] hover:text-slate-300"
                  }`}
                >
                  <span className="text-[0.9rem] w-5 text-center opacity-80">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-2.5 py-3 border-t border-[#1e293b]">
        <Link href="/data"
          className={`flex items-center gap-2.5 px-2.5 py-[0.45rem] rounded-md text-[0.82rem] transition-all duration-150 ${
            pathname === "/data" ? "bg-blue-500/10 text-blue-400 font-medium" : "text-slate-500 hover:text-slate-400 hover:bg-white/[0.03]"
          }`}>
          <span className="text-[0.9rem] w-5 text-center opacity-80">⚙️</span>
          Settings
        </Link>
        <p className="text-center text-[0.6rem] text-slate-700 mt-2">v4.0</p>
      </div>
    </aside>
  );
}
