import React, { useState, useMemo } from "react";
import { Card, CardContent } from "..//../components/ui/card";
import { Badge } from "..//../components/ui/badge";
import { DollarSign, ChevronRight, ChevronDown, TrendingUp, TrendingDown } from "lucide-react";

interface FinancialsTabProps {
  data: any;
}

interface QuarterData {
  year: number;
  quarter: number;
  revenue: number;
  revenue_yoy: number;
  net_profit_for_the_year: number;
  attribute_to_parent_company: number;
  attribute_to_parent_company_yoy: number;
  profit_before_tax: number;
  business_income_tax_current: number;
  business_income_tax_deferred: number;
  minority_interest: number;
}

export default function FinancialsTab({ data }: FinancialsTabProps) {
  const [expandedYears, setExpandedYears] = useState<{ [year: number]: boolean }>({});
  const [expandedQuarters, setExpandedQuarters] = useState<{ [key: string]: boolean }>({});

  // Group data by year and sort
  const groupedData = useMemo(() => {
    if (!Array.isArray(data?.incomeData)) return {};
    
    const grouped = data.incomeData.reduce((acc: { [year: number]: QuarterData[] }, item: QuarterData) => {
      if (!acc[item.year]) {
        acc[item.year] = [];
      }
      acc[item.year].push(item);
      return acc;
    }, {});

    // Sort quarters within each year
    Object.keys(grouped).forEach(year => {
      grouped[parseInt(year)].sort((a, b) => b.quarter - a.quarter);
    });

    return grouped;
  }, [data?.incomeData]);

  const years = Object.keys(groupedData)
    .map(year => parseInt(year))
    .sort((a, b) => b - a);

  const toggleYear = (year: number) => {
    setExpandedYears(prev => ({
      ...prev,
      [year]: !prev[year]
    }));
  };

  const toggleQuarter = (year: number, quarter: number) => {
    const key = `${year}-${quarter}`;
    setExpandedQuarters(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const formatNumber = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return '-';
    return value.toLocaleString('vi-VN');
  };

  const formatPercentage = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return '-';
    const percentage = (value * 100).toFixed(1);
    return `${value >= 0 ? '+' : ''}${percentage}%`;
  };

  const formatCurrency = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return '-';
    return `${formatNumber(value)} VNĐ`;
  };

  return (
    <div className="space-y-6 mt-0">
      <Card className="bg-slate-800/60 border border-blue-400/30">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-cyan-400 mb-6 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Kết quả tài chính theo quý
          </h3>
          
          <div className="space-y-2">
            {years.map((year) => (
              <div key={year} className="border border-slate-700/40 rounded-lg bg-slate-900/30">
                {/* Year Header */}
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-700/20 transition-colors"
                  onClick={() => toggleYear(year)}
                >
                  <div className="flex items-center gap-3">
                    {expandedYears[year] ? (
                      <ChevronDown className="w-5 h-5 text-cyan-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-cyan-400" />
                    )}
                    <h4 className="text-lg font-bold text-white">Năm {year}</h4>
                    <Badge className="bg-blue-500/20 text-blue-400 text-xs">
                      {groupedData[year]?.length || 0} quý
                    </Badge>
                  </div>
                  
                  {/* Year Summary */}
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <div className="text-slate-400 text-xs">Tổng doanh thu</div>
                      <div className="text-white font-semibold">
                        {formatNumber(
                          groupedData[year]?.reduce((sum, q) => sum + (q.revenue || 0), 0) || 0
                        )}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-slate-400 text-xs">Lợi nhuận ròng</div>
                      <div className="text-emerald-400 font-semibold">
                        {formatNumber(
                          groupedData[year]?.reduce((sum, q) => sum + (q.net_profit_for_the_year || 0), 0) || 0
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quarters */}
                {expandedYears[year] && (
                  <div className="border-t border-slate-700/40">
                    {groupedData[year]?.map((quarter) => {
                      const quarterKey = `${year}-${quarter.quarter}`;
                      const isExpanded = expandedQuarters[quarterKey];
                      
                      return (
                        <div key={quarterKey} className="border-b border-slate-700/30 last:border-b-0">
                          {/* Quarter Header */}
                          <div
                            className="flex items-center justify-between p-4 pl-12 cursor-pointer hover:bg-slate-700/10 transition-colors"
                            onClick={() => toggleQuarter(year, quarter.quarter)}
                          >
                            <div className="flex items-center gap-3">
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-slate-400" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                              )}
                              <span className="font-semibold text-slate-200">
                                Quý {quarter.quarter}
                              </span>
                              
                              {/* Growth indicators */}
                              <div className="flex items-center gap-2">
                                {quarter.revenue_yoy !== null && (
                                  <Badge 
                                    className={`text-xs flex items-center gap-1 ${
                                      quarter.revenue_yoy >= 0 
                                        ? 'bg-emerald-500/20 text-emerald-400' 
                                        : 'bg-red-500/20 text-red-400'
                                    }`}
                                  >
                                    {quarter.revenue_yoy >= 0 ? (
                                      <TrendingUp className="w-3 h-3" />
                                    ) : (
                                      <TrendingDown className="w-3 h-3" />
                                    )}
                                    DT: {formatPercentage(quarter.revenue_yoy)}
                                  </Badge>
                                )}
                                
                                {quarter.attribute_to_parent_company_yoy !== null && (
                                  <Badge 
                                    className={`text-xs flex items-center gap-1 ${
                                      quarter.attribute_to_parent_company_yoy >= 0 
                                        ? 'bg-emerald-500/20 text-emerald-400' 
                                        : 'bg-red-500/20 text-red-400'
                                    }`}
                                  >
                                    {quarter.attribute_to_parent_company_yoy >= 0 ? (
                                      <TrendingUp className="w-3 h-3" />
                                    ) : (
                                      <TrendingDown className="w-3 h-3" />
                                    )}
                                    LN: {formatPercentage(quarter.attribute_to_parent_company_yoy)}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            {/* Quarter Summary */}
                            <div className="flex items-center gap-6 text-sm">
                              <div className="text-center">
                                <div className="text-slate-400 text-xs">Doanh thu</div>
                                <div className="text-white font-semibold">
                                  {formatNumber(quarter.revenue)}
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-slate-400 text-xs">Lợi nhuận ròng</div>
                                <div className={`font-semibold ${
                                  quarter.net_profit_for_the_year >= 0 ? 'text-emerald-400' : 'text-red-400'
                                }`}>
                                  {formatNumber(quarter.net_profit_for_the_year)}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Quarter Details */}
                          {isExpanded && (
                            <div className="p-4 pl-16 bg-slate-800/40">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Revenue Details */}
                                <div className="p-4 bg-slate-700/30 rounded-lg">
                                  <h5 className="font-medium text-cyan-400 mb-3 text-sm">Doanh thu & Tăng trưởng</h5>
                                  <div className="space-y-2 text-xs">
                                    <div className="flex justify-between">
                                      <span className="text-slate-400">Doanh thu:</span>
                                      <span className="text-white font-semibold">{formatCurrency(quarter.revenue)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-400">Tăng trưởng YoY:</span>
                                      <span className={`font-semibold ${
                                        quarter.revenue_yoy >= 0 ? 'text-emerald-400' : 'text-red-400'
                                      }`}>
                                        {formatPercentage(quarter.revenue_yoy)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-400">Thu nhập khác (ròng):</span>
                                      <span className={`font-semibold ${
                                        (quarter as any).net_other_income_expenses >= 0 ? 'text-emerald-400' : 'text-red-400'
                                      }`}>
                                        {formatCurrency((quarter as any).net_other_income_expenses)}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Profit Details */}
                                <div className="p-4 bg-slate-700/30 rounded-lg">
                                  <h5 className="font-medium text-emerald-400 mb-3 text-sm">Lợi nhuận</h5>
                                  <div className="space-y-2 text-xs">
                                    <div className="flex justify-between">
                                      <span className="text-slate-400">LN trước thuế:</span>
                                      <span className={`font-semibold ${
                                        quarter.profit_before_tax >= 0 ? 'text-white' : 'text-red-400'
                                      }`}>
                                        {formatCurrency(quarter.profit_before_tax)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-400">LN ròng:</span>
                                      <span className={`font-semibold ${
                                        quarter.net_profit_for_the_year >= 0 ? 'text-emerald-400' : 'text-red-400'
                                      }`}>
                                        {formatCurrency(quarter.net_profit_for_the_year)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-400">LNST chủ sở hữu:</span>
                                      <span className={`font-semibold ${
                                        quarter.attribute_to_parent_company >= 0 ? 'text-emerald-400' : 'text-red-400'
                                      }`}>
                                        {formatCurrency(quarter.attribute_to_parent_company)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-400">Tăng trưởng LNST YoY:</span>
                                      <span className={`font-semibold ${
                                        quarter.attribute_to_parent_company_yoy >= 0 ? 'text-emerald-400' : 'text-red-400'
                                      }`}>
                                        {formatPercentage(quarter.attribute_to_parent_company_yoy)}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Tax & Others */}
                                <div className="p-4 bg-slate-700/30 rounded-lg">
                                  <h5 className="font-medium text-blue-400 mb-3 text-sm">Thuế & Khác</h5>
                                  <div className="space-y-2 text-xs">
                                    <div className="flex justify-between">
                                      <span className="text-slate-400">Thuế TNDN hiện hành:</span>
                                      <span className="text-red-400 font-semibold">
                                        {formatCurrency(quarter.business_income_tax_current)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-400">Thuế TNDN hoãn lại:</span>
                                      <span className={`font-semibold ${
                                        quarter.business_income_tax_deferred >= 0 ? 'text-emerald-400' : 'text-red-400'
                                      }`}>
                                        {formatCurrency(quarter.business_income_tax_deferred)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-400">Lợi ích cổ đông thiểu số:</span>
                                      <span className={`font-semibold ${
                                        quarter.minority_interest >= 0 ? 'text-white' : 'text-red-400'
                                      }`}>
                                        {formatCurrency(quarter.minority_interest)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-400">Chi phí quản lý:</span>
                                      <span className="text-red-400 font-semibold">
                                        {formatCurrency((quarter as any).general_admin_expenses)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}