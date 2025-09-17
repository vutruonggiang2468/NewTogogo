"use client";

import React, { useEffect, useRef, useState } from "react";

export interface BarPoint {
  label: string;
  value: number;
}

interface Props {
  series: BarPoint[];
  color?: string; // hex color like #60a5fa
}

export default function CanvasBarChart({ series, color = "#60a5fa" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const barsRef = useRef<Array<{ x: number; y: number; w: number; h: number }>>([]);
  const [tooltip, setTooltip] = useState<
    { x: number; y: number; label: string; value: number } | null
  >(null);

  const draw = (hoverIndex: number | null = null) => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const container = containerRef.current!;
    const width = container.clientWidth;
    const height = container.clientHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Clear and layout
    ctx.clearRect(0, 0, width, height);
    const padding = { top: 8, right: 8, bottom: 36, left: 28 };
    const plotW = width - padding.left - padding.right;
    const plotH = height - padding.top - padding.bottom;

    const values = series.map((s) => s.value);
    const maxVal = Math.max(1, Math.max(...values));

    // Horizontal grid
    ctx.strokeStyle = "#334155"; // slate-700
    ctx.lineWidth = 1;
    const steps = 4;
    for (let i = 0; i <= steps; i++) {
      const y = padding.top + (plotH * i) / steps;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + plotW, y);
      ctx.stroke();
    }

    // Y labels
    ctx.fillStyle = "#94a3b8"; // slate-400
    ctx.font = "10px system-ui, -apple-system, Segoe UI, Roboto";
    ctx.textBaseline = "middle";
    for (let i = 0; i <= steps; i++) {
      const val = Math.round((maxVal * (steps - i)) / steps);
      const y = padding.top + (plotH * i) / steps;
      ctx.fillText(String(val), 2, y);
    }

    // Bars
    const n = Math.max(1, series.length);
    const gap = Math.max(4, plotW / n / 3);
    const barW = Math.max(6, (plotW - gap * (n + 1)) / n);
    barsRef.current = [];
    ctx.fillStyle = color;
    series.forEach((pt, idx) => {
      const x = padding.left + gap + idx * (barW + gap);
      const h = (Math.max(0, pt.value) / maxVal) * plotH;
      const y = padding.top + plotH - h;
      ctx.fillRect(x, y, barW, h);
      barsRef.current.push({ x, y, w: barW, h });
    });

    // X labels
    ctx.save();
    ctx.fillStyle = "#94a3b8";
    ctx.textBaseline = "top";
    series.forEach((pt, idx) => {
      const b = barsRef.current[idx];
      const x = b.x + b.w / 2;
      const y = padding.top + plotH + 4;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((-25 * Math.PI) / 180);
      ctx.fillText(pt.label, -ctx.measureText(pt.label).width / 2, 0);
      ctx.restore();
    });
    ctx.restore();

    // Highlight hovered
    if (hoverIndex !== null && barsRef.current[hoverIndex]) {
      const b = barsRef.current[hoverIndex];
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(b.x - 1, b.y - 1, b.w + 2, b.h + 2);
    }
  };

  useEffect(() => {
    draw();
    const obs = (window as any).ResizeObserver
      ? new (window as any).ResizeObserver(() => draw())
      : null;
    if (obs && containerRef.current) obs.observe(containerRef.current);
    return () => {
      if (obs && containerRef.current) obs.unobserve(containerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [series, color]);

  const onMouseMove = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const idx = barsRef.current.findIndex(
      (b) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h + 4
    );
    if (idx !== -1) {
      draw(idx);
      const pt = series[idx];
      const b = barsRef.current[idx];
      setTooltip({ x: b.x + b.w / 2, y: b.y - 8, label: pt.label, value: pt.value });
    } else {
      draw(null);
      setTooltip(null);
    }
  };

  const onMouseLeave = () => {
    draw(null);
    setTooltip(null);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <canvas ref={canvasRef} />
      {tooltip && (
        <div
          className="absolute px-2 py-1 rounded bg-slate-900/95 border border-blue-400/30 text-xs text-slate-200 pointer-events-none"
          style={{ left: Math.max(4, tooltip.x - 40), top: Math.max(4, tooltip.y - 28) }}
        >
          <div className="font-medium">{tooltip.value}</div>
          <div className="text-slate-400">{tooltip.label}</div>
        </div>
      )}
    </div>
  );
}

