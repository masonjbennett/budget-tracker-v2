"use client";

interface MetricCardProps {
  label: string;
  value: string;
  delta?: string;
  deltaColor?: "green" | "red" | "default";
  help?: string;
}

export default function MetricCard({ label, value, delta, deltaColor = "default", help }: MetricCardProps) {
  const deltaColorClass = {
    green: "text-green",
    red: "text-red",
    default: "text-dim",
  }[deltaColor];

  return (
    <div className="card group animate-fade-in">
      <p className="text-[0.7rem] uppercase tracking-[0.06em] text-dim font-semibold" title={help}>
        {label}
        {help && <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-accent cursor-help">?</span>}
      </p>
      <p className="text-[1.65rem] font-bold text-primary mt-1.5 tracking-tight leading-tight" style={{ fontFamily: "var(--font-display)" }}>
        {value}
      </p>
      {delta && (
        <p className={`text-[0.8rem] mt-1.5 font-medium ${deltaColorClass}`}>
          {delta}
        </p>
      )}
    </div>
  );
}
