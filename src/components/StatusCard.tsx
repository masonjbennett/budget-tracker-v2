"use client";

interface StatusCardProps {
  label: string;
  value: string;
  status: string;
  color: "green" | "yellow" | "red" | "blue";
  description?: string;
}

const colorMap = {
  green: { text: "text-green", bg: "bg-green/10", dot: "bg-green", glow: "glow-green" },
  yellow: { text: "text-yellow", bg: "bg-yellow/10", dot: "bg-yellow", glow: "" },
  red: { text: "text-red", bg: "bg-red/10", dot: "bg-red", glow: "glow-red" },
  blue: { text: "text-accent", bg: "bg-accent/10", dot: "bg-accent", glow: "glow-blue" },
};

export default function StatusCard({ label, value, status, color, description }: StatusCardProps) {
  const c = colorMap[color];
  return (
    <div className={`card animate-fade-in ${c.glow}`}>
      <p className="text-[0.68rem] uppercase tracking-[0.08em] text-muted font-medium">{label}</p>
      <p className={`text-[2rem] font-bold mt-1 leading-tight font-num ${c.text}`}>
        {value}
      </p>
      <div className={`inline-flex items-center gap-1.5 mt-2.5 px-2.5 py-1 rounded-full ${c.bg}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
        <span className={`text-[0.72rem] font-semibold ${c.text}`}>{status}</span>
      </div>
      {description && (
        <p className="text-[0.75rem] text-muted mt-3 leading-relaxed">{description}</p>
      )}
    </div>
  );
}
