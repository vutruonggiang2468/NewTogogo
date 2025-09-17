/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { TooltipProvider } from "@/app/components/ui/tooltip";
import { searchSuggestions } from "@/app/constants/stockDatabase";
import {
  getStockAnalysis,
  getAnimatedValues,
} from "@/app/components/helpers/detailedAnalysisHelpers";
import { Search, ChevronRight } from "lucide-react";
import TabsDetail from "../components/Tabs";
import { getSymbolData as apiGetSymbolData } from "@/services/api";
import { useParams } from "next/navigation";
import Breadcrumb from "@/app/components/Breadcrumb";

interface DetailedAnalysisPageProps {
  stockCode: string;
  onBack: () => void;
}

type SymbolData = any;

export default function DetailedAnalysisPage({
  stockCode,
  onBack,
}: DetailedAnalysisPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [animatedValues, setAnimatedValues] = useState<{
    [key: string]: number;
  }>({});

  const stock = getStockAnalysis(stockCode);
  const isPositive = stock.change.startsWith("+");

  const [data, setData] = useState<SymbolData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null);
      try {
        const response = await apiGetSymbolData(slug);
        setData(response);
        console.log("Data fetched:", response);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter search suggestions
  const filteredSuggestions = searchSuggestions
    .filter((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 5);

  // Handle stock selection from search
  const handleStockSelect = (newStockCode: string) => {
    setSearchQuery("");
    setShowSearchSuggestions(false);
    window.location.reload(); // Temporary solution
  };

  // Animation effects
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValues(getAnimatedValues(stock));
    }, 500);

    return () => clearTimeout(timer);
  }, [stock]);

  return (
    <TooltipProvider>
      <div className="min-h-screen mt-24">
        <div className="pt-16 md:pt-32">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            {/* Breadcrumb (page-level) */}
            <Breadcrumb />
            {/* Compact Header */}
            <div className="text-center mb-4">
              <h1 className="text-3xl font-bold text-cyan-400">
                PHÂN TÍCH CHUYÊN SÂU
              </h1>
              <p className="text-slate-400">
                Phân tích chi tiết cho cổ phiếu {stockCode}
              </p>
            </div>

            {/* Compact Stock Header */}
            <Card className="mb-4 bg-slate-800/60 border border-blue-400/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">{stock.code}</span>
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-white">
                        {stock.name}
                      </h1>
                      <p className="text-slate-400 text-base">
                        {stock.sector} •{" "}
                        {stock.detailedInfo.companyOverview.exchange}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-bold text-white">
                      {stock.currentPrice}
                    </div>
                    <div
                      className={`text-sm font-semibold ${
                        isPositive ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {stock.change} ({stock.changePercent})
                    </div>
                  </div>
                </div>

                {/* Compact Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4 pt-4 border-t border-slate-600/50">
                  <div className="text-center p-2 bg-slate-700/30 rounded-lg">
                    <div className="text-sm text-slate-400">P/E</div>
                    <div className="font-bold text-blue-400">{stock.pe}</div>
                  </div>
                  <div className="text-center p-2 bg-slate-700/30 rounded-lg">
                    <div className="text-sm text-slate-400">ROE</div>
                    <div className="font-bold text-emerald-400">
                      {stock.roe}
                    </div>
                  </div>
                  <div className="text-center p-2 bg-slate-700/30 rounded-lg">
                    <div className="text-sm text-slate-400">Vốn hóa</div>
                    <div className="font-bold text-white">
                      {stock.marketCap}
                    </div>
                  </div>
                  <div className="text-center p-2 bg-slate-700/30 rounded-lg">
                    <div className="text-sm text-slate-400">Cổ tức</div>
                    <div className="font-bold text-cyan-400">
                      {stock.dividendYield}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compact Search */}
            <div className="relative max-w-xl mx-auto mb-6">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchSuggestions(true);
                  }}
                  onFocus={() => setShowSearchSuggestions(true)}
                  onBlur={() =>
                    setTimeout(() => setShowSearchSuggestions(false), 200)
                  }
                  placeholder="Tìm kiếm mã khác..."
                  className="pl-10 py-2 border border-blue-400/30 rounded-lg bg-slate-800/60 text-white placeholder:text-slate-400 text-sm"
                />
              </div>

              {showSearchSuggestions &&
                searchQuery &&
                filteredSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-slate-800/95 border border-blue-400/30 rounded-lg shadow-xl z-10 mt-1 overflow-hidden">
                    {filteredSuggestions.map((stockItem) => {
                      const data = getStockAnalysis(stockItem);
                      return (
                        <button
                          key={stockItem}
                          onClick={() => handleStockSelect(stockItem)}
                          className="w-full p-3 text-left hover:bg-blue-500/10 border-b border-slate-600/50 last:border-b-0 transition-all duration-200"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-cyan-400 text-sm">
                                {stockItem}
                              </div>
                              <div className="text-xs text-slate-400">
                                {data.name}
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
            </div>

            {/* Tabs Detail Component */}
            <TabsDetail stock={stock} data={data} isPositive={isPositive} />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
