"use client";

import Sparkline from "./Sparkline";

interface MetricCardProps {
  label: string;
  value: string;
  delta?: string;
  deltaColor?: "green" | "red" | "default";
  help?: string;
  sparkData?: number[];
  gradient?: boolean;
}

export default function MetricCard({ label, value, delta, deltaColor = "default", help, sparkData, gradient }: MetricCardProps) {
  const deltaClass = {
    green: "text-green",
    red: "text-red",
    default: "text-muted",
  }[deltaColor];

  return (
    <div className="card animate-fade-in group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-[0.68rem] uppercase tracking-[0.08em] text-muted font-medium" title={help}>
            {label}
          </p>
          <p className={`text-[1.7rem] font-bold mt-1 tracking-tight leading-tight font-num ${gradient ? "text-gradient-blue" : "text-primary"}`}>
            {value}
          </p>
          {delta && (
            <p className={`text-[0.78rem] mt-1.5 font-medium ${deltaClass}`}>{delta}</p>
          )}
        </div>
        {sparkData && sparkData.length > 1 && (
          <Sparkline data={sparkData} color="auto" className="mt-3 opacity-60 group-hover:opacity-100 transition-opacity" />
        )}
      </div>
    </div>
  );
}
