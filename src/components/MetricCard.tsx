"use client";

interface MetricCardProps {
  label: string;
  value: string;
  delta?: string;
  deltaColor?: "green" | "red" | "default";
  help?: string;
}

export default function MetricCard({ label, value, delta, deltaColor = "default", help }: MetricCardProps) {
  const deltaClass = {
    green: "text-green",
    red: "text-red",
    default: "text-muted",
  }[deltaColor];

  return (
    <div className="card animate-fade-in">
      <p className="text-[0.68rem] uppercase tracking-[0.08em] text-muted font-medium" title={help}>
        {label}
      </p>
      <p className="text-[1.7rem] font-bold text-primary mt-1 tracking-tight leading-tight font-num">
        {value}
      </p>
      {delta && (
        <p className={`text-[0.78rem] mt-1.5 font-medium ${deltaClass}`}>{delta}</p>
      )}
    </div>
  );
}
