import React from "react";
import { Card, CardContent } from "..//../components/ui/card";
import { Badge } from "..//../components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { StockChart } from "..//../components/StockChart";
import {
  Building2,
  PieChart,
  Globe
} from "lucide-react";

interface OverviewTabProps {
  stock: any;
  data: any;
  isPositive: boolean;
}

export default function OverviewTab({ stock, data, isPositive }: OverviewTabProps) {
  return (
    <div className="space-y-6 mt-0">
      {/* Stock Chart - Full Width */}
      <StockChart
        stockCode={stock.code}
        currentPrice={stock.currentPrice}
        change={stock.change}
        changePercent={stock.changePercent}
        isPositive={isPositive}
      />

      {/* Company Overview - Full Width */}
      <Card className="bg-slate-800/60 border border-blue-400/30">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Thông tin doanh nghiệp
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-3">
              <div className="p-3 bg-slate-700/30 rounded-lg">
                <div className="text-xs text-slate-400">Tên đầy đủ</div>
                <div className="text-white">{data?.symbolData.company?.company_name}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <div className="text-xs text-slate-400">Thành lập</div>
                  <div className="text-white">
                    {data?.symbolData.company?.history
                      ? data.symbolData.company.history.match(/\d{4}/)?.[0] // lấy năm đầu tiên trong chuỗi
                      : '-'}
                  </div>
                </div>
              </div>
              <div className="p-3 bg-slate-700/30 rounded-lg">
                <div className="text-xs text-slate-400">Hồ sơ doanh nghiệp</div>
                <div className="text-white text-sm leading-relaxed">
                  {data?.symbolData.company?.company_profile}
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-slate-700/30 rounded-lg">
                <div className="text-xs text-slate-400">Ngành</div>
                <div className="text-white">{data?.symbolData.company?.industry}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <div className="text-xs text-slate-400">Nhân viên</div>
                  <div className="text-white">{data?.symbolData.company?.no_employees}</div>
                </div>
                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <div className="text-xs text-slate-400">Website</div>
                  <div className="text-cyan-400 text-xs">{data?.symbolData.company?.website}</div>
                </div>
                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <div className="text-xs text-slate-400">Sàn giao dịch</div>
                  <div className="text-cyan-400 text-xs">{data?.symbolData.company?.exchange}</div>
                </div>
                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <div className="text-xs text-slate-400">Tổng số cổ phần phát hành</div>
                  <div className="text-white">
                    {data?.symbolData.company?.financial_ratio_issue_share
                      ? `${Number(data?.symbolData.company?.financial_ratio_issue_share).toLocaleString('vi-VN')} cổ phiếu`
                      : '-'}
                  </div>
                </div>
                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <div className="text-xs text-slate-400">Vốn điều lệ</div>
                  <div className="text-white">
                    {data?.symbolData.company?.charter_capital
                      ? Number(data.symbolData.company.charter_capital).toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      })
                      : '-'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Segments - Full Width */}
      <Card className="bg-slate-800/60 border border-blue-400/30">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Phân khúc kinh doanh
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {Array.isArray(data?.symbolData?.industries) && 
              data.symbolData.industries.map((industries: any, index: number) => (
                <div key={index} className="p-4 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-white">{industries.name}</h4>
                    <Badge className="bg-emerald-500/20 text-emerald-400 text-xs">
                      {industries.updated_at}
                    </Badge>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Corporate Events - Full Width */}
      <Card className="bg-slate-800/60 border border-blue-400/30">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
            Sự kiện doanh nghiệp
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {data?.symbolData.company?.events?.length ? (
              data.symbolData.company.events.map((events: any, index: number) => (
                <div
                  key={index}
                  className="p-5 bg-slate-700/30 backdrop-blur-sm rounded-xl border border-indigo-400/20"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h5 className="font-bold text-white mb-1">
                        {events.event_title}
                      </h5>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="text-slate-400">
                      {events?.public_date || "Ngày công bố"}
                    </div>
                    <div className="text-slate-400">
                      {events?.issue_date || "Ngày phát hành hiệu lực"}
                    </div>
                  </div>
                  <div className="mt-3">
                    <Button
                      size="sm"
                      className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-400/30 text-xs"
                      onClick={() => window.open(events?.source_url, "_blank")}
                    >
                      <Globe className="w-3 h-3 mr-1" />
                      Xem chi tiết
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center text-slate-400">
                Không có sự kiện nào
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}