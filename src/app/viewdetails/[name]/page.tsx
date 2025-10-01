"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Search, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TooltipProvider } from "@/components/ui/tooltip";
import { searchSuggestions } from "@/constants/stockDatabase";
import { getStockAnalysis } from "@/components/helpers/detailedAnalysisHelpers";
import TabsDetail from "./components/Tabs";
import Breadcrumb from "@/components/layouts/Breadcrumb";
import { getCompanyDetails, getSymbolData } from "@/services/api";
import { CompanyDetails } from "../types";
import { useSymbolStore } from "@/store/symbol.store";

export default function DetailedAnalysisPage() {
  const { name } = useParams<{ name: string }>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showSearchSuggestions, setShowSearchSuggestions] =
    useState<boolean>(false);
  const [id, setId] = useState<string>("1");
  const [detailedInfo, setDetailedInfo] = useState<CompanyDetails | null>(null);

  const { symbolMap, setSymbolMap } = useSymbolStore();

  useEffect(() => {
    const load = async () => {
      if (!symbolMap || Object.keys(symbolMap).length === 0) {
        // F5 trực tiếp → map rỗng → fetch lại
        const list = await getSymbolData("");
        setSymbolMap(list);
        const found = list.find((s: any) => s.name === name);
        if (found) setId(found.id);
      } else {
        // map đã có → chỉ việc lấy
        setId(symbolMap[name]);
      }
    };
    load();
  }, [name, symbolMap, setSymbolMap]);

  useEffect(() => {
    async function fetchCompanyDetails() {
      try {
        const details = await getCompanyDetails(id);
        setDetailedInfo(details);
      } catch (error) {
        console.error("Error fetching company details:", error);
        setDetailedInfo(null);
      }
    }
    fetchCompanyDetails();
  }, [id]);

  const filteredSuggestions = searchSuggestions
    .filter((symbol) =>
      symbol.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, 5);

  const handleStockSelect = (newStockCode: string) => {
    setSearchQuery("");
    setShowSearchSuggestions(false);
    window.location.href = `/viewdetails/${newStockCode}`;
  };

  const stock = getStockAnalysis(id);
  const isPositive = stock.change?.trim().startsWith("+") ?? false;

  return (
    <TooltipProvider>
      <div className="min-h-screen mt-24">
        <div className="pt-16 md:pt-32">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            <Breadcrumb />

            <div className="text-center mb-4">
              <h1 className="text-3xl font-bold text-cyan-400">
                PHÂN TÍCH CHUYÊN SÂU
              </h1>
              <p className="text-slate-400">
                Phân tích chi tiết cho cổ phiếu {name}
              </p>
            </div>

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
                        {stock.sector} ???{" "}
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

            <div className="relative max-w-xl mx-auto mb-6">
              {/* <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <Input
                  value={searchQuery}
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                    setShowSearchSuggestions(true);
                  }}
                  onFocus={() => setShowSearchSuggestions(true)}
                  onBlur={() =>
                    setTimeout(() => setShowSearchSuggestions(false), 200)
                  }
                  placeholder="Tìm kiếm mã khác..."
                  className="pl-10 py-2 border border-blue-400/30 rounded-lg bg-slate-800/60 text-white placeholder:text-slate-400 text-sm"
                />
              </div> */}

              {showSearchSuggestions &&
                searchQuery &&
                filteredSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-slate-800/95 border border-blue-400/30 rounded-lg shadow-xl z-10 mt-1 overflow-hidden">
                    {filteredSuggestions.map((stockItem) => {
                      const suggestion = getStockAnalysis(stockItem);
                      return (
                        <button
                          key={stockItem}
                          onClick={() => handleStockSelect(stockItem)}
                          className="w-full p-3 text-left hover:bg-blue-500/10 border-b border-slate-600/50 last:border-b-0 transition-all duration-200"
                          type="button"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-cyan-400 text-sm">
                                {stockItem}
                              </div>
                              <div className="text-xs text-slate-400">
                                {suggestion.name}
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

            <TabsDetail
              stock={stock}
              data={detailedInfo}
              isPositive={isPositive}
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
