"use client";

import dynamic from "next/dynamic";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false, loading: () => (
  <div className="skeleton w-full h-[22rem] rounded-xl" />
)});

const CHART_LAYOUT: any = {
  paper_bgcolor: "rgba(0,0,0,0)",
  plot_bgcolor: "rgba(0,0,0,0)",
  font: { family: "Inter, sans-serif", color: "#94a3b8", size: 12 },
  margin: { l: 60, r: 20, t: 10, b: 50 },
  legend: { bgcolor: "rgba(0,0,0,0)", orientation: "h" as const, y: -0.15, font: { size: 11, color: "#64748b" } },
  xaxis: { gridcolor: "rgba(51,65,85,0.3)", linecolor: "#334155", linewidth: 1, tickfont: { size: 11, color: "#64748b" } },
  yaxis: { gridcolor: "rgba(51,65,85,0.3)", linecolor: "#334155", linewidth: 1, tickfont: { size: 11, color: "#64748b" } },
  hovermode: "x unified" as const,
  hoverlabel: { bgcolor: "#1e293b", font: { size: 12, color: "#f8fafc" }, bordercolor: "#334155" },
};

interface ChartProps {
  data: any[];
  layout?: any;
  height?: number;
  className?: string;
}

export default function Chart({ data, layout = {}, height = 350, className = "" }: ChartProps) {
  return (
    <div className={`card p-2 ${className}`}>
      <Plot
        data={data}
        layout={{
          ...CHART_LAYOUT,
          ...layout,
          height,
          autosize: true,
        }}
        config={{ displayModeBar: false, responsive: true }}
        useResizeHandler
        style={{ width: "100%" }}
      />
    </div>
  );
}

export { CHART_LAYOUT };
