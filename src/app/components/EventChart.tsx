"use client";

import React, { memo } from "react";
import {
  ResponsiveContainer,
  BarChart as RBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export interface SeriesPoint {
  label: string;
  value: number;
}

function EventChartComp({ series }: { series: SeriesPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RBarChart data={series} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: "#94a3b8", fontSize: 10 }}
          interval="preserveStartEnd"
          minTickGap={10}
          angle={-25}
          textAnchor="end"
          height={40}
        />
        <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} width={32} allowDecimals={false} />
        {/* Tooltip có thể tắt nếu vẫn thấy nặng */}
        {/* <Tooltip ... /> */}
        <Bar
          dataKey="value"
          fill="#60a5fa"
          radius={[4, 4, 0, 0]}
          isAnimationActive={false}
        />
      </RBarChart>
    </ResponsiveContainer>
  );
}

export default memo(EventChartComp);
