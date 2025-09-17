"use client";

import Link from "next/link";
import Breadcrumb from "@/app/components/Breadcrumb";
import { Card, CardContent } from "@/app/components/ui/card";

export default function DeepAnalysisIndexPage() {
  return (
    <div className="min-h-screen mt-24">
      <div className="pt-16 md:pt-28">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Breadcrumb for this page */}
          <Breadcrumb />

          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-cyan-400">PHÂN TÍCH CHUYÊN SÂU</h1>
            <p className="text-slate-400 text-sm">Chọn mã cổ phiếu để xem phân tích chi tiết</p>
          </div>

          {/* Quick links (placeholder) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { code: "YTC", name: "YTC Corp" },
              { code: "HPG", name: "Hòa Phát" },
              { code: "VSC", name: "Vietcombank" },
            ].map((s) => (
              <Link key={s.code} href={`/viewdetails/${s.code}`}>
                <Card className="bg-slate-800/60 border border-blue-400/30 hover:border-cyan-400/50 transition-colors">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <div className="text-white font-semibold">{s.code}</div>
                      <div className="text-slate-400 text-sm">{s.name}</div>
                    </div>
                    <span className="text-cyan-400 text-sm">Xem chi tiết →</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

