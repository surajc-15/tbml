"use client";

import { Cell, ResponsiveContainer, Tooltip, Treemap } from "recharts";

const heatmapData = [
  { name: "UAE-India", value: 92 },
  { name: "Turkey-SG", value: 78 },
  { name: "Oman-Kenya", value: 84 },
  { name: "China-Nigeria", value: 88 },
  { name: "Vietnam-UAE", value: 74 },
  { name: "BD-UK", value: 66 },
];

const colors = ["#dc2626", "#ea580c", "#d97706", "#ca8a04", "#0891b2", "#0ea5e9"];

export function RiskHeatmapChart() {
  return (
    <div className="h-48 w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%" minWidth={260} minHeight={180}>
        <Treemap data={heatmapData} dataKey="value" stroke="#e2e8f0" fill="#0ea5e9" aspectRatio={4 / 3}>
          {heatmapData.map((entry, index) => (
            <Cell key={entry.name} fill={colors[index % colors.length]} />
          ))}
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              borderColor: "#e2e8f0",
              fontSize: 12,
            }}
          />
        </Treemap>
      </ResponsiveContainer>
    </div>
  );
}
