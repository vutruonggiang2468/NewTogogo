'use client'

import { Card, CardContent } from "..//../components/ui/card";
import { Badge } from "..//../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { StockChart } from "..//../components/StockChart";
import { ShareholderStructure } from "../../components/ShareholderStructure";
import { Subsidiaries } from "../../components/Subsidiaries";
import { calculateMarketPosition } from "../../components/helpers/detailedAnalysisHelpers";
import {
  BarChart,
  DollarSign,
  Users,
  TrendingUpIcon,
  Building2,
  PieChart,
  Crown,
  Leaf,
  Shield,
  Target,
  Activity,
  LineChart,
  CheckCircle,
  Globe,
  Waves,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  BarChart3,
  Wallet,
  FileBarChart
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Calendar } from "@/app/components/ui/calendar";
import { useEffect, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Box, Stack } from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { apiGetCashflowsData } from "@/services/api";
import { useParams } from "next/navigation";


interface TabsDetailProps {
  stock: any; // Replace with proper type based on getStockAnalysis return type
  data: any;
  isPositive: boolean;
}


export default function TabsDetail({ stock, data, isPositive }: TabsDetailProps) {
  const [date, setDate] = useState<Date | null>(new Date());
  console.log("TabsDetail data:", data);
  const { slug } = useParams<{ slug: string }>();
  const [error, setError] = useState<string | null>(null);
  const [datas, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null);
      try {
        const response = await apiGetCashflowsData();
        setData(response);
        console.log("Data fetchedhhhh:", response);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  console.log("logggg:", datas);
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList className="grid w-full grid-cols-4 bg-slate-800/60 border border-blue-400/30 p-1">
        <TabsTrigger
          value="overview"
          className="data-[state=active]:bg-blue-500/20 text-white data-[state=active]:text-cyan-400 text-xs py-2"
        >
          <BarChart className="w-4 h-4 mr-1" />
          Tổng quan
        </TabsTrigger>
        <TabsTrigger
          value="financials"
          className="data-[state=active]:bg-blue-500/20 text-white data-[state=active]:text-cyan-400 text-xs py-2"
        >
          <DollarSign className="w-4 h-4 mr-1" />
          Tài chính
        </TabsTrigger>
        <TabsTrigger
          value="governance"
          className="data-[state=active]:bg-blue-500/20 text-white data-[state=active]:text-cyan-400 text-xs py-2"
        >
          <Users className="w-4 h-4 mr-1" />
          Quản trị
        </TabsTrigger>
        <TabsTrigger
          value="analysis"
          className="data-[state=active]:bg-blue-500/20 text-white data-[state=active]:text-cyan-400 text-xs py-2"
        >
          <TrendingUpIcon className="w-4 h-4 mr-1" />
          Phân tích
        </TabsTrigger>
      </TabsList>

      {/* Full Width Content */}
      <div className="w-full">
        <TabsContent value="overview" className="space-y-6 mt-0">
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
                    <div className="text-white">{data?.company?.company_name}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-700/30 rounded-lg">
                      <div className="text-xs text-slate-400">Thành lập</div>
                      <div className="text-white">
                        {data?.company?.history
                          ? data.company.history.match(/\d{4}/)?.[0] //lấy năm đầu tiên trong chuỗi
                          : '-'}
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-700/30 rounded-lg">
                    <div className="text-xs text-slate-400">Hồ sơ doanh nghiệp</div>
                    <div className="text-white text-sm leading-relaxed">{data?.company?.company_profile}</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-700/30 rounded-lg">
                    <div className="text-xs text-slate-400">Ngành</div>
                    <div className="text-white">{data?.company?.industry}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-700/30 rounded-lg">
                      <div className="text-xs text-slate-400">Nhân viên</div>
                      <div className="text-white">{data?.company?.no_employees}</div>
                    </div>
                    <div className="p-3 bg-slate-700/30 rounded-lg">
                      <div className="text-xs text-slate-400">Website</div>
                      <div className="text-cyan-400 text-xs">{data?.company?.website}</div>
                    </div>
                    <div className="p-3 bg-slate-700/30 rounded-lg">
                      <div className="text-xs text-slate-400">Sàn giao dịch</div>
                      <div className="text-cyan-400 text-xs">{data?.exchange}</div>
                    </div>
                    <div className="p-3 bg-slate-700/30 rounded-lg">
                      <div className="text-xs text-slate-400">Tổng số cổ phần phát hành</div>
                      <div className="text-white">
                        {data?.company?.financial_ratio_issue_share
                          ? `${Number(data?.company?.financial_ratio_issue_share).toLocaleString('vi-VN')} cổ phiếu`
                          : '-'}
                      </div>
                    </div>
                    <div className="p-3 bg-slate-700/30 rounded-lg">
                      <div className="text-xs text-slate-400">Vốn điều lệ</div>
                      <div className="text-white">
                        {data?.company?.charter_capital
                          ? Number(data.company.charter_capital).toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                          })
                          : '-'}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  {/* <div className="p-3 bg-slate-700/30 rounded-lg">
                    <div className="text-xs text-slate-400">Trụ sở chính</div>
                    <div className="text-white">{stock.detailedInfo.companyOverview.headquarters}</div>
                  </div> */}
                </div>
              </div>

              {/* Key Products - Full Width */}
              {/* <div className="mt-4">
                <div className="text-sm text-slate-400 mb-3">Sản phẩm/Dịch vụ chính:</div>
                <div className="flex flex-wrap gap-2">
                  {stock.detailedInfo.businessActivities.keyProducts.map((product: string, index: number) => (
                    <Badge key={index} className="bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 text-sm px-3 py-1">
                      {product}
                    </Badge>
                  ))}
                </div>
              </div> */}
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
                {data?.industries.map((industries: any, index: number) => (
                  <div key={index} className="p-4 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white">{industries.name}</h4>
                      <Badge className="bg-emerald-500/20 text-emerald-400 text-xs">
                        {industries.updated_at}
                      </Badge>
                    </div>
                    {/* <div className="space-y-2 text-sm">
                      <div>
                        <div className="text-slate-400">Doanh thu</div>
                        <div className="font-semibold text-white">{industries.revenue}</div>
                        <div className="text-xs text-slate-500">{industries.revenueShare}</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Lợi nhuận</div>
                        <div className="font-semibold text-emerald-400">{industries.profit}</div>
                        <div className="text-xs text-slate-500">{industries .profitShare}</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Mô tả</div>
                        <div className="text-xs text-slate-300">{industries.description}</div>
                      </div>
                    </div> */}
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
              <div className="grid grid-cols-2 gap-4"> {/* ✅ 2 cột full màn hình */}
                {data?.company?.events?.length ? (
                  data.company.events.map((events: any, index: number) => (
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
                        <div className="text-slate-400">{events?.public_date || "Ngày công bố"}</div>
                        <div className="text-slate-400">{events?.issue_date || "Ngày phát hành hiệu lực"}</div>
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

        </TabsContent>
        <TabsContent value="financials" className="space-y-6 mt-0">
          {/* Financial Highlights - Full Width */}
          <Card className="bg-slate-800/60 border border-blue-400/30">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Kết quả tài chính
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-700/30 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-400 text-sm">Doanh thu</span>
                    <Badge className="bg-emerald-500/20 text-emerald-400 text-xs">
                      {stock.detailedInfo.financialHighlights.revenueGrowth}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-white">{stock.detailedInfo.financialHighlights.revenue}</div>
                </div>

                <div className="p-4 bg-slate-700/30 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-400 text-sm">Lợi nhuận ròng</span>
                    <Badge className="bg-emerald-500/20 text-emerald-400 text-xs">
                      {stock.detailedInfo.financialHighlights.profitGrowth}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-emerald-400">{stock.detailedInfo.financialHighlights.netIncome}</div>
                </div>

                <div className="p-4 bg-slate-700/30 rounded-lg">
                  <div className="text-slate-400 text-sm mb-2">Tổng tài sản</div>
                  <div className="text-2xl font-bold text-blue-400">{stock.detailedInfo.financialHighlights.totalAssets}</div>
                </div>

                <div className="p-4 bg-slate-700/30 rounded-lg">
                  <div className="text-slate-400 text-sm mb-2">Biên lợi nhuận</div>
                  <div className="text-2xl font-bold text-purple-400">{stock.detailedInfo.financialHighlights.profitMargin}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance History - Full Width */}
          <Card className="bg-slate-800/60 border border-blue-400/30">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                <LineChart className="w-5 h-5" />
                Hiệu suất lịch sử
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {(Object.entries(stock.performance) as [string, string][]).map(([period, value]) => (
                  <div key={period} className="text-center p-3 bg-slate-700/30 rounded-lg">
                    <div className="text-xs text-slate-400 mb-1">{period}</div>
                    <div className={`font-bold ${value.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="governance" className="space-y-6 mt-0">
          {/* Shareholder Structure - Full Width */}
          <ShareholderStructure shareholderData={stock.detailedInfo.shareholderStructure} data={data} />

          {/* Management Team - Full Width Grid */}
          <Card className="bg-slate-800/60 border border-blue-400/30">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                <Crown className="w-5 h-5" />
                Ban lãnh đạo
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data?.company?.officers?.map((officer: any, index: number) => (
                  <div key={index} className="p-4 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white font-bold">
                        {officer.officer_name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white text-sm">{officer.officer_name}</h4>
                        <div className="text-xs text-orange-400">{officer.position_short_name}</div>
                      </div>
                    </div>
                    <div className="text-xs text-slate-400 space-y-1">
                      <div>Chức vụ: {officer.officer_position}</div>
                      <div>Tỷ lệ sở hữu: {officer.officer_owner_percent}%</div>
                      <div>Cập nhật: {new Date(officer.updated_at).toLocaleDateString("vi-VN")}</div>
                    </div>
                  </div>
                ))}
              </div>

            </CardContent>
          </Card>

          {/* Subsidiaries - Full Width */}
          <Subsidiaries subsidiaries={stock.detailedInfo.subsidiaries} data={data} />

          {/* ESG & Risk - Full Width Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-slate-800/60 border border-blue-400/30">
              <CardContent className="p-4">
                <h3 className="font-bold text-cyan-400 mb-3 flex items-center gap-2 text-sm">
                  <Leaf className="w-4 h-4" />
                  ESG Rating
                </h3>
                <div className="text-center">
                  <div className="text-xl font-bold text-emerald-400 mb-2">
                    {stock.detailedInfo.esgInfo.overallRating}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <div className="text-slate-400">E</div>
                      <div className="font-bold text-emerald-400">{stock.detailedInfo.esgInfo.environmentalScore}</div>
                    </div>
                    <div>
                      <div className="text-slate-400">S</div>
                      <div className="font-bold text-emerald-400">{stock.detailedInfo.esgInfo.socialScore}</div>
                    </div>
                    <div>
                      <div className="text-slate-400">G</div>
                      <div className="font-bold text-emerald-400">{stock.detailedInfo.esgInfo.governanceScore}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/60 border border-blue-400/30">
              <CardContent className="p-4">
                <h3 className="font-bold text-cyan-400 mb-3 flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4" />
                  Credit Risk
                </h3>
                <div className="space-y-2">
                  <Badge className="bg-emerald-500/20 text-emerald-400 text-xs w-full justify-center">
                    {stock.detailedInfo.riskAssessment.creditRisk.level}
                  </Badge>
                  <div className="text-xs text-slate-400">
                    NPL: {stock.detailedInfo.riskAssessment.creditRisk.nplRatio}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/60 border border-blue-400/30">
              <CardContent className="p-4">
                <h3 className="font-bold text-cyan-400 mb-3 flex items-center gap-2 text-sm">
                  <Target className="w-4 h-4" />
                  Market Risk
                </h3>
                <div className="space-y-2">
                  <Badge className="bg-yellow-500/20 text-yellow-400 text-xs w-full justify-center">
                    {stock.detailedInfo.riskAssessment.marketRisk.level}
                  </Badge>
                  <div className="text-xs text-slate-400">
                    VaR: {stock.detailedInfo.riskAssessment.marketRisk.var}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/60 border border-blue-400/30">
              <CardContent className="p-4">
                <h3 className="font-bold text-cyan-400 mb-3 flex items-center gap-2 text-sm">
                  <Activity className="w-4 h-4" />
                  52W Range
                </h3>
                <div className="space-y-2">
                  <div className="relative">
                    <div className="h-2 bg-gradient-to-r from-red-400/30 via-yellow-400/30 to-emerald-400/30 rounded-full"></div>
                    <div
                      className="absolute top-0 h-2 w-1 bg-white rounded-full transform -translate-x-1/2"
                      style={{ left: `${calculateMarketPosition(stock.currentPrice, stock.additionalMetrics.week52Low, stock.additionalMetrics.week52High)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>{stock.additionalMetrics.week52Low}</span>
                    <span>{stock.additionalMetrics.week52High}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6 mt-0">
          {/* Investment Recommendation - Full Width
          <Card className="bg-slate-800/60 border border-blue-400/30">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Khuyến nghị đầu tư
                <Badge className={`${stock?.detailedInfo.investment.recommendation === "MUA MẠNH" ? "bg-emerald-500" :
                  stock?.detailedInfo.investment.recommendation === "MUA" ? "bg-blue-500" :
                    "bg-yellow-500"
                  } text-white`}>
                  {stock?.detailedInfo.investment.recommendation}
                </Badge>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gradient-to-br from-slate-700/30 to-emerald-500/20 rounded-lg">
                  <div className="text-sm text-slate-400 mb-1">Mục tiêu giá</div>
                  <div className="text-2xl font-bold text-emerald-400 mb-1">{stock?.detailedInfo.investment.priceTarget}</div>
                  <Badge className="bg-emerald-500/20 text-emerald-400 text-sm">
                    {stock?.detailedInfo.investment.upside} upside
                  </Badge>
                </div>

                <div className="p-4 bg-slate-700/30 rounded-lg">
                  <div className="text-slate-400 text-sm mb-2">Khung thời gian</div>
                  <div className="font-semibold text-white text-lg">{stock?.detailedInfo.investment.timeHorizon}</div>
                </div>

                <div className="p-4 bg-slate-700/30 rounded-lg">
                  <div className="text-slate-400 text-sm mb-2">Luận điểm đầu tư:</div>
                  <div className="space-y-2">
                    {stock?.detailedInfo.investment.investmentThesis.slice(0, 3).map((thesis: string, index: number) => (
                      <div key={index} className="flex items-start gap-2 text-xs">
                        <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-300">{thesis}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card> */}

          {/* Analyst Consensus - Full Width
          <Card className="bg-slate-800/60 border border-blue-400/30">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Đồng thuận phân tích viên
                <Badge className="bg-blue-500/20 text-blue-400">
                  {stock?.detailedInfo.analystConsensus.totalAnalysts} chuyên gia
                </Badge>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                  <div className="text-sm text-slate-400 mb-1">Mục tiêu giá TB</div>
                  <div className="text-2xl font-bold text-blue-400">{stock.detailedInfo.analystConsensus.avgPriceTarget}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {stock.detailedInfo.analystConsensus.priceTargetLow} - {stock.detailedInfo.analystConsensus.priceTargetHigh}
                  </div>
                </div>

                <div className="p-3 bg-emerald-500/20 rounded-lg text-center">
                  <div className="text-emerald-400 text-sm">Mua mạnh</div>
                  <div className="text-emerald-400 font-bold text-xl">{stock.detailedInfo.analystConsensus.strongBuy}</div>
                </div>

                <div className="p-3 bg-blue-500/20 rounded-lg text-center">
                  <div className="text-blue-400 text-sm">Mua</div>
                  <div className="text-blue-400 font-bold text-xl">{stock.detailedInfo.analystConsensus.buy}</div>
                </div>

                <div className="p-3 bg-yellow-500/20 rounded-lg text-center">
                  <div className="text-yellow-400 text-sm">Giữ</div>
                  <div className="text-yellow-400 font-bold text-xl">{stock.detailedInfo.analystConsensus.hold}</div>
                </div>
              </div>
            </CardContent>
          </Card> */}
          {/* Cash Flow Analysis - Full Width */}
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-cyan-400 flex items-center gap-3">
                <Waves className="w-6 h-6" />
                Phân tích dòng tiền (Cash Flow Analysis)
              </h3>
              <div className="flex gap-2">
                <Badge className="bg-cyan-500/20 text-cyan-400 px-3 py-1">
                  Báo cáo 2024
                </Badge>
                <Badge className="bg-emerald-500/20 text-emerald-400 px-3 py-1">
                  Đã kiểm toán
                </Badge>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="mb-8 p-6 bg-gradient-to-r from-slate-900/60 to-slate-800/40 rounded-xl border border-slate-600/40">
              <h4 className="text-lg font-semibold text-white mb-4">Tóm tắt điều hành (Executive Summary)</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-emerald-500/10 rounded-lg border border-emerald-400/30">
                  <div className="text-sm text-emerald-300 mb-2">Free Cash Flow (FCF)</div>
                  <div className="text-2xl font-bold text-emerald-400">30,085 tỷ</div>
                  <div className="text-xs text-emerald-300 mt-1">+8.7% so với cùng kỳ năm trước</div>
                  <div className="text-xs text-slate-400 mt-2">FCF Margin: 12.1%</div>
                </div>
                <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-400/30">
                  <div className="text-sm text-blue-300 mb-2">Operating Cash Flow Yield</div>
                  <div className="text-2xl font-bold text-blue-400">18.2%</div>
                  <div className="text-xs text-blue-300 mt-1">Vượt trội so với ngành</div>
                  <div className="text-xs text-slate-400 mt-2">Trung bình ngành: 14.8%</div>
                </div>
                <div className="text-center p-4 bg-purple-500/10 rounded-lg border border-purple-400/30">
                  <div className="text-sm text-purple-300 mb-2">Cash Conversion Cycle</div>
                  <div className="text-2xl font-bold text-purple-400">45 ngày</div>
                  <div className="text-xs text-emerald-300 mt-1">Cải thiện -12 ngày YoY</div>
                  <div className="text-xs text-slate-400 mt-2">Mục tiêu 2025: 40 ngày</div>
                </div>
              </div>
            </div>

            {/* Key Performance Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="p-5 bg-gradient-to-br from-emerald-500/15 to-emerald-600/5 rounded-xl border border-emerald-400/30">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-emerald-400">Dòng tiền HĐKD</h4>
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">53.7 tỷ</div>
                <div className="text-sm text-emerald-300 mb-1">+9.9% so với cùng kỳ</div>
                <div className="text-xs text-slate-300">OCF Margin: 21.6%</div>
                <div className="mt-3 w-full bg-slate-700/50 rounded-full h-2">
                  <div className="bg-emerald-400 h-2 rounded-full" style={{ width: '86%' }}></div>
                </div>
              </div>

              <div className="p-5 bg-gradient-to-br from-blue-500/15 to-blue-600/5 rounded-xl border border-blue-400/30">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-blue-400">Dòng tiền ĐT</h4>
                  <TrendingDown className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">-18.7 tỷ</div>
                <div className="text-sm text-red-300 mb-1">+31.1% chi tiêu ĐT</div>
                <div className="text-xs text-slate-300">CAPEX/Sales: 6.1%</div>
                <div className="mt-3 w-full bg-slate-700/50 rounded-full h-2">
                  <div className="bg-blue-400 h-2 rounded-full" style={{ width: '72%' }}></div>
                </div>
              </div>

              <div className="p-5 bg-gradient-to-br from-purple-500/15 to-purple-600/5 rounded-xl border border-purple-400/30">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-purple-400">Dòng tiền TC</h4>
                  <Activity className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">-10.4 tỷ</div>
                <div className="text-sm text-red-300 mb-1">Cổ tức & hoàn vốn</div>
                <div className="text-xs text-slate-300">Payout Ratio: 38.5%</div>
                <div className="mt-3 w-full bg-slate-700/50 rounded-full h-2">
                  <div className="bg-purple-400 h-2 rounded-full" style={{ width: '64%' }}></div>
                </div>
              </div>

              <div className="p-5 bg-gradient-to-br from-cyan-500/15 to-cyan-600/5 rounded-xl border border-cyan-400/30">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-cyan-400">Vị thế tiền mặt</h4>
                  <Wallet className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">42.6 tỷ</div>
                <div className="text-sm text-emerald-300 mb-1">+140.6% so với đầu năm</div>
                <div className="text-xs text-slate-300">Cash/Assets: 14.8%</div>
                <div className="mt-3 w-full bg-slate-700/50 rounded-full h-2">
                  <div className="bg-cyan-400 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
            </div>

            {/* Comprehensive Cash Flow Statement */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                  <FileBarChart className="w-5 h-5" />
                  Báo cáo lưu chuyển tiền tệ (Consolidated Cash Flow Statement)
                </h4>
                <div className="text-left p-4 text-slate-200 font-semibold min-w-[120px]">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack spacing={2}>
                      <Box sx={{
                        width: 200,
                        "& .MuiInputBase-root": {
                          color: "white",
                        },
                        "& .MuiInputLabel-root": {
                          color: "white",
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "white",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "white",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "white",
                        },
                      }}>
                        <DatePicker label="Year" openTo="year" />
                      </Box>
                    </Stack>
                  </LocalizationProvider>
                </div>
                <div className="text-sm text-slate-400">Đơn vị: Tỷ VND | Đã kiểm toán</div>
              </div>
              <div className="overflow-x-auto rounded-lg border border-slate-600/40">
                <table className="w-full text-sm border-collapse bg-slate-900/20">
                  <thead>
                    <tr className="border-b-2 border-slate-600/60 bg-slate-800/50">
                      <th className="text-left p-4 text-slate-200 font-semibold min-w-[300px]">Khoản mục</th>
                      <th className="text-right p-4 text-slate-200 font-semibold w-[100px]">Quý 1</th>
                      <th className="text-right p-4 text-slate-200 font-semibold w-[100px]">Quý 2</th>
                      <th className="text-right p-4 text-slate-200 font-semibold w-[100px]">Quý 3</th>
                      <th className="text-right p-4 text-slate-200 font-semibold w-[100px]">Quý 4</th>
                      <th className="text-right p-4 text-slate-200 font-semibold w-[100px]">% YoY</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Operating Activities Section */}
                    <tr className="bg-emerald-500/8 border-b border-emerald-400/20">
                      <td className="p-4 font-bold text-emerald-400 text-base" colSpan={5}>
                        I. HOẠT ĐỘNG KINH DOANH (OPERATING ACTIVITIES)
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-700/20 transition-colors border-b border-slate-700/40">
                      <td className="p-4 text-slate-200 pl-8 font-medium">Lợi nhuận trước thuế</td>
                      <td className="p-4 text-right text-white font-semibold">{datas?.net_profit_loss_before_tax}</td>
                      <td className="p-4 text-right text-slate-300">48,250</td>
                      <td className="p-4 text-right text-slate-300">8</td>
                      <td className="p-4 text-right text-slate-300">44,100</td>
                      <td className="p-4 text-right text-emerald-400 font-semibold">+8.8%</td>
                    </tr>
                    <tr className="hover:bg-slate-700/20 transition-colors border-b border-slate-700/40">
                      <td className="p-4 text-slate-300 pl-8">Điều chỉnh cho các khoản mục phi tiền tệ:</td>
                      <td className="p-4 text-right text-slate-400" colSpan={4}></td>
                    </tr>
                    <tr className="hover:bg-slate-700/20 transition-colors border-b border-slate-700/40">
                      <td className="p-4 text-slate-300 pl-12">• Khấu hao và phân bổ</td>
                      <td className="p-4 text-right text-white">8,450</td>
                      <td className="p-4 text-right text-slate-300">7,980</td>
                      <td className="p-4 text-right text-slate-300">8</td>
                      <td className="p-4 text-right text-slate-300">7,200</td>
                      <td className="p-4 text-right text-emerald-400">+5.9%</td>
                    </tr>
                    <tr className="hover:bg-slate-700/20 transition-colors border-b border-slate-700/40">
                      <td className="p-4 text-slate-300 pl-12">• Chi phí dự phòng rủi ro tín dụng</td>
                      <td className="p-4 text-right text-white">3,250</td>
                      <td className="p-4 text-right text-slate-300">2,850</td>
                      <td className="p-4 text-right text-slate-300">8</td>
                      <td className="p-4 text-right text-slate-300">3,100</td>
                      <td className="p-4 text-right text-yellow-400">+14.0%</td>
                    </tr>
                    <tr className="hover:bg-slate-700/20 transition-colors border-b border-slate-700/40">
                      <td className="p-4 text-slate-300 pl-12">• Lãi/lỗ chênh lệch tỷ giá chưa thực hiện</td>
                      <td className="p-4 text-right text-red-400">-450</td>
                      <td className="p-4 text-right text-emerald-400">320</td>
                      <td className="p-4 text-right text-slate-300">8</td>
                      <td className="p-4 text-right text-red-400">-180</td>
                      <td className="p-4 text-right text-red-400">-240.6%</td>
                    </tr>
                    <tr className="hover:bg-slate-700/20 transition-colors border-b border-slate-700/40">
                      <td className="p-4 text-slate-300 pl-12">• Lãi/lỗ từ hoạt động đầu tư</td>
                      <td className="p-4 text-right text-emerald-400">2,150</td>
                      <td className="p-4 text-right text-slate-300">1,850</td>
                      <td className="p-4 text-right text-slate-300">8</td>
                      <td className="p-4 text-right text-slate-300">1,200</td>
                      <td className="p-4 text-right text-emerald-400">+16.2%</td>
                    </tr>
                    <tr className="hover:bg-slate-700/20 transition-colors border-b border-slate-700/40">
                      <td className="p-4 text-slate-300 pl-12">• Chi phí lãi vay</td>
                      <td className="p-4 text-right text-red-400">4,220</td>
                      <td className="p-4 text-right text-slate-300">3,980</td>
                      <td className="p-4 text-right text-slate-300">8</td>
                      <td className="p-4 text-right text-slate-300">3,650</td>
                      <td className="p-4 text-right text-red-400">+6.0%</td>
                    </tr>
                    <tr className="bg-slate-700/30 font-semibold border-b border-slate-600/50">
                      <td className="p-4 text-slate-200 pl-8">Lợi nhuận từ HĐKD trước thay đổi vốn lưu động</td>
                      <td className="p-4 text-right text-white font-bold">70,100</td>
                      <td className="p-4 text-right text-slate-300 font-medium">64,230</td>
                      <td className="p-4 text-right text-slate-300 font-medium">8</td>
                      <td className="p-4 text-right text-slate-300 font-medium">58,270</td>
                      <td className="p-4 text-right text-emerald-400 font-bold">+9.1%</td>
                    </tr>

                    <tr className="hover:bg-slate-700/20 transition-colors border-b border-slate-700/40">
                      <td className="p-4 text-slate-200 pl-8 font-medium">Thay đổi vốn lưu động:</td>
                      <td className="p-4 text-right text-slate-400" colSpan={4}></td>
                    </tr>
                    <tr className="hover:bg-slate-700/20 transition-colors border-b border-slate-700/40">
                      <td className="p-4 text-slate-300 pl-12">• Tăng/giảm phải thu khách hàng</td>
                      <td className="p-4 text-right text-red-400">-8,450</td>
                      <td className="p-4 text-right text-slate-300">-6,200</td>
                      <td className="p-4 text-right text-slate-300">8</td>
                      <td className="p-4 text-right text-slate-300">-7,100</td>
                      <td className="p-4 text-right text-red-400">+36.3%</td>
                    </tr>
                    <tr className="hover:bg-slate-700/20 transition-colors border-b border-slate-700/40">
                      <td className="p-4 text-slate-300 pl-12">• Tăng/giảm hàng tồn kho</td>
                      <td className="p-4 text-right text-red-400">-2,850</td>
                      <td className="p-4 text-right text-slate-300">-1,950</td>
                      <td className="p-4 text-right text-slate-300">8</td>
                      <td className="p-4 text-right text-slate-300">-2,200</td>
                      <td className="p-4 text-right text-red-400">+46.2%</td>
                    </tr>
                    <tr className="hover:bg-slate-700/20 transition-colors border-b border-slate-700/40">
                      <td className="p-4 text-slate-300 pl-12">• Tăng/giảm phải trả người bán</td>
                      <td className="p-4 text-right text-emerald-400">3,850</td>
                      <td className="p-4 text-right text-slate-300">2,650</td>
                      <td className="p-4 text-right text-slate-300">8</td>
                      <td className="p-4 text-right text-slate-300">3,100</td>
                      <td className="p-4 text-right text-emerald-400">+45.3%</td>
                    </tr>
                    <tr className="hover:bg-slate-700/20 transition-colors border-b border-slate-700/40">
                      <td className="p-4 text-slate-300 pl-12">• Tăng/giảm chi phí trả trước</td>
                      <td className="p-4 text-right text-red-400">-1,250</td>
                      <td className="p-4 text-right text-slate-300">-980</td>
                      <td className="p-4 text-right text-slate-300">8</td>
                      <td className="p-4 text-right text-slate-300">-850</td>
                      <td className="p-4 text-right text-red-400">+27.6%</td>
                    </tr>
                    <tr className="hover:bg-slate-700/20 transition-colors border-b border-slate-700/40">
                      <td className="p-4 text-slate-200 pl-8">Tiền lãi vay đã trả</td>
                      <td className="p-4 text-right text-red-400">-4,150</td>
                      <td className="p-4 text-right text-slate-300">-3,850</td>
                      <td className="p-4 text-right text-slate-300">8</td>
                      <td className="p-4 text-right text-slate-300">-3,520</td>
                      <td className="p-4 text-right text-red-400">+7.8%</td>
                    </tr>
                    <tr className="hover:bg-slate-700/20 transition-colors border-b border-slate-700/40">
                      <td className="p-4 text-slate-200 pl-8">Thuế thu nhập doanh nghiệp đã nộp</td>
                      <td className="p-4 text-right text-red-400">-3,525</td>
                      <td className="p-4 text-right text-slate-300">-3,220</td>
                      <td className="p-4 text-right text-slate-300">8</td>
                      <td className="p-4 text-right text-slate-300">-2,950</td>
                      <td className="p-4 text-right text-red-400">+9.5%</td>
                    </tr>
                    <tr className="bg-emerald-500/15 font-bold border-b-2 border-emerald-400/40">
                      <td className="p-5 text-emerald-400 pl-6 text-base">Lưu chuyển tiền thuần từ HĐKD</td>
                      <td className="p-5 text-right text-emerald-400 font-bold text-lg">53,725</td>
                      <td className="p-5 text-right text-slate-300 font-semibold">48,880</td>
                      <td className="p-4 text-right text-slate-300">8</td>
                      <td className="p-5 text-right text-slate-300 font-semibold">44,750</td>
                      <td className="p-5 text-right text-emerald-400 font-bold">+9.9%</td>
                    </tr>

                    {/* Investing Activities Section */}
                    <tr className="bg-blue-500/8 border-b border-blue-400/20">
                      <td className="p-4 font-bold text-blue-400 text-base" colSpan={5}>
                        II. HOẠT ĐỘNG ĐẦU TƯ (INVESTING ACTIVITIES)
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-700/20 transition-colors border-b border-slate-700/40">
                      <td className="p-4 text-slate-200 pl-8">Mua sắm tài sản cố định</td>
                      <td className="p-4 text-right text-red-400 font-medium">-15,200</td>
                      <td className="p-4 text-right text-slate-300">-12,800</td>
                      <td className="p-4 text-right text-slate-300">8</td>
                      <td className="p-4 text-right text-slate-300">-10,500</td>
                      <td className="p-4 text-right text-red-400">+18.8%</td>
                    </tr>
                    <tr className="hover:bg-slate-700/20 transition-colors border-b border-slate-700/40">
                      <td className="p-4 text-slate-200 pl-8">Thu từ thanh lý tài sản cố định</td>
                      <td className="p-4 text-right text-emerald-400">850</td>
                      <td className="p-4 text-right text-slate-300">620</td>
                      <td className="p-4 text-right text-slate-300">8</td>
                      <td className="p-4 text-right text-slate-300">480</td>
                      <td className="p-4 text-right text-emerald-400">+37.1%</td>
                    </tr>
                    <tr className="hover:bg-slate-700/20 transition-colors border-b border-slate-700/40">
                      <td className="p-4 text-slate-200 pl-8">Cho vay/mua các công cụ nợ</td>
                      <td className="p-4 text-right text-red-400">-8,500</td>
                      <td className="p-4 text-right text-slate-300">-6,200</td>
                      <td className="p-4 text-right text-slate-300">8</td>
                      <td className="p-4 text-right text-slate-300">-5,800</td>
                      <td className="p-4 text-right text-red-400">+37.1%</td>
                    </tr>
                    <tr className="hover:bg-slate-700/20 transition-colors border-b border-slate-700/40">
                      <td className="p-4 text-slate-200 pl-8">Thu hồi cho vay/bán công cụ nợ</td>
                      <td className="p-4 text-right text-emerald-400">6,850</td>
                      <td className="p-4 text-right text-slate-300">5,200</td>
                      <td className="p-4 text-right text-slate-300">8</td>
                      <td className="p-4 text-right text-slate-300">4,800</td>
                      <td className="p-4 text-right text-emerald-400">+31.7%</td>
                    </tr>
                    <tr className="hover:bg-slate-700/20 transition-colors border-b border-slate-700/40">
                      <td className="p-4 text-slate-200 pl-8">Đầu tư vào các đơn vị khác</td>
                      <td className="p-4 text-right text-red-400">-5,500</td>
                      <td className="p-4 text-right text-slate-300">-3,200</td>
                      <td className="p-4 text-right text-slate-300">8</td>
                      <td className="p-4 text-right text-slate-300">-2,800</td>
                      <td className="p-4 text-right text-red-400">+71.9%</td>
                    </tr>
                    <tr className="hover:bg-slate-700/20 transition-colors border-b border-slate-700/40">
                      <td className="p-4 text-slate-200 pl-8">Thu từ thoái vốn đầu tư</td>
                      <td className="p-4 text-right text-emerald-400">2,350</td>
                      <td className="p-4 text-right text-slate-300">1,800</td>
                      <td className="p-4 text-right text-slate-300">8</td>
                      <td className="p-4 text-right text-slate-300">1,500</td>
                      <td className="p-4 text-right text-emerald-400">+30.6%</td>
                    </tr>
                    <tr className="hover:bg-slate-700/20 transition-colors border-b border-slate-700/40">
                      <td className="p-4 text-slate-200 pl-8">Cổ tức và lợi nhuận nhận được</td>
                      <td className="p-4 text-right text-emerald-400">1,200</td>
                      <td className="p-4 text-right text-slate-300">1,150</td>
                      <td className="p-4 text-right text-slate-300">8</td>
                      <td className="p-4 text-right text-slate-300">950</td>
                      <td className="p-4 text-right text-emerald-400">+4.3%</td>
                    </tr>
                    <tr className="bg-blue-500/15 font-bold border-b-2 border-blue-400/40">
                      <td className="p-5 text-blue-400 pl-6 text-base">Lưu chuyển tiền thuần từ HĐĐT</td>
                      <td className="p-5 text-right text-blue-400 font-bold text-lg">-18,650</td>
                      <td className="p-5 text-right text-slate-300 font-semibold">-14,230</td>
                      <td className="p-4 text-right text-slate-300">8</td>
                      <td className="p-5 text-right text-slate-300 font-semibold">-11,870</td>
                      <td className="p-5 text-right text-red-400 font-bold">+31.1%</td>
                    </tr>

                    {/* Financing Activities Section */}
                    <tr className="bg-purple-500/8 border-b border-purple-400/20">
                      <td className="p-4 font-bold text-purple-400 text-base" colSpan={5}>
                        III. HOẠT ĐỘNG TÀI CHÍNH (FINANCING ACTIVITIES)
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-700/20 transition-colors border-b border-slate-700/40">
                      <td className="p-4 text-slate-200 pl-8">Tăng vốn điều lệ từ cổ đông</td>
                      <td className="p-4 text-right text-slate-400">0</td>
                      <td className="p-4 text-right text-emerald-400">8,500</td>
                      <td className="p-4 text-right text-slate-300">8</td>
                      <td className="p-4 text-right text-slate-400">0</td>
                      <td className="p-4 text-right text-slate-400">-</td>
                    </tr>
                    <tr className="hover:bg-slate-700/20 transition-colors border-b border-slate-700/40">
                      <td className="p-4 text-slate-200 pl-8">Chi mua lại cổ phiếu quỹ</td>
                      <td className="p-4 text-right text-red-400">-1,500</td>
                      <td className="p-4 text-right text-slate-300">-800</td>
                      <td className="p-4 text-right text-slate-300">8</td>
                      <td className="p-4 text-right text-slate-300">-650</td>
                      <td className="p-4 text-right text-red-400">+87.5%</td>
                    </tr>
                    <tr className="hover:bg-slate-700/20 transition-colors border-b border-slate-700/40">
                      <td className="p-4 text-slate-200 pl-8">Tiền vay nhận được</td>
                      <td className="p-4 text-right text-emerald-400">15,850</td>
                      <td className="p-4 text-right text-slate-300">12,500</td>
                      <td className="p-4 text-right text-slate-300">8</td>
                      <td className="p-4 text-right text-slate-300">18,200</td>
                      <td className="p-4 text-right text-emerald-400">+26.8%</td>
                    </tr>
                    <tr className="hover:bg-slate-700/20 transition-colors border-b border-slate-700/40">
                      <td className="p-4 text-slate-200 pl-8">Trả nợ gốc vay</td>
                      <td className="p-4 text-right text-red-400">-16,570</td>
                      <td className="p-4 text-right text-slate-300">-12,150</td>
                      <td className="p-4 text-right text-slate-300">8</td>
                      <td className="p-4 text-right text-slate-300">-19,550</td>
                      <td className="p-4 text-right text-red-400">+36.4%</td>
                    </tr>
                    <tr className="hover:bg-slate-700/20 transition-colors border-b border-slate-700/40">
                      <td className="p-4 text-slate-200 pl-8">Thanh toán nợ gốc thuê tài chính</td>
                      <td className="p-4 text-right text-red-400">-2,000</td>
                      <td className="p-4 text-right text-slate-300">-1,200</td>
                      <td className="p-4 text-right text-slate-300">8</td>
                      <td className="p-4 text-right text-slate-300">-850</td>
                      <td className="p-4 text-right text-red-400">+66.7%</td>
                    </tr>
                    <tr className="hover:bg-slate-700/20 transition-colors border-b border-slate-700/40">
                      <td className="p-4 text-slate-200 pl-8">Cổ tức đã trả cho cổ đông</td>
                      <td className="p-4 text-right text-red-400">-6,200</td>
                      <td className="p-4 text-right text-slate-300">-5,800</td>
                      <td className="p-4 text-right text-slate-300">8</td>
                      <td className="p-4 text-right text-slate-300">-5,200</td>
                      <td className="p-4 text-right text-red-400">+6.9%</td>
                    </tr>
                    <tr className="bg-purple-500/15 font-bold border-b-2 border-purple-400/40">
                      <td className="p-5 text-purple-400 pl-6 text-base">Lưu chuyển tiền thuần từ HĐTC</td>
                      <td className="p-5 text-right text-purple-400 font-bold text-lg">-10,420</td>
                      <td className="p-5 text-right text-slate-300 font-semibold">1,050</td>
                      <td className="p-4 text-right text-slate-300">8</td>
                      <td className="p-5 text-right text-slate-300 font-semibold">-8,050</td>
                      <td className="p-5 text-right text-red-400 font-bold">-1,092%</td>
                    </tr>

                    {/* Cash Position Summary */}
                    <tr className="bg-cyan-500/8 border-b border-cyan-400/20">
                      <td className="p-4 font-bold text-cyan-400 text-base" colSpan={5}>
                        IV. TÌNH HÌNH TIỀN MẶT VÀ TƯƠNG ĐƯƠNG TIỀN
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-700/20 transition-colors border-b border-slate-700/40">
                      <td className="p-4 text-slate-200 pl-8">Tăng/giảm tiền thuần trong kỳ</td>
                      <td className="p-4 text-right text-white font-medium">24,655</td>
                      <td className="p-4 text-right text-slate-300">35,700</td>
                      <td className="p-4 text-right text-slate-300">8</td>
                      <td className="p-4 text-right text-slate-300">24,830</td>
                      <td className="p-4 text-right text-red-400 font-medium">-30.9%</td>
                    </tr>
                    <tr className="hover:bg-slate-700/20 transition-colors border-b border-slate-700/40">
                      <td className="p-4 text-slate-200 pl-8">Tiền và tương đương tiền đầu kỳ</td>
                      <td className="p-4 text-right text-white">17,775</td>
                      <td className="p-4 text-right text-slate-300">-17,925</td>
                      <td className="p-4 text-right text-slate-300">8</td>
                      <td className="p-4 text-right text-slate-300">-42,755</td>
                      <td className="p-4 text-right text-emerald-400">-199.2%</td>
                    </tr>
                    <tr className="hover:bg-slate-700/20 transition-colors border-b border-slate-700/40">
                      <td className="p-4 text-slate-200 pl-8">Ảnh hưởng thay đổi tỷ giá hối đoái</td>
                      <td className="p-4 text-right text-white">150</td>
                      <td className="p-4 text-right text-slate-300">-80</td>
                      <td className="p-4 text-right text-slate-300">8</td>
                      <td className="p-4 text-right text-slate-300">120</td>
                      <td className="p-4 text-right text-emerald-400">-287%</td>
                    </tr>
                    <tr className="bg-cyan-500/15 font-bold border-b-2 border-cyan-400/40">
                      <td className="p-5 text-cyan-400 pl-6 text-base">Tiền và tương đương tiền cuối kỳ</td>
                      <td className="p-5 text-right text-cyan-400 font-bold text-lg">42,580</td>
                      <td className="p-5 text-right text-slate-300 font-semibold">17,695</td>
                      <td className="p-4 text-right text-slate-300">8</td>
                      <td className="p-5 text-right text-slate-300 font-semibold">-17,805</td>
                      <td className="p-5 text-right text-emerald-400 font-bold">+140.6%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Financial Ratios & Metrics */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Chỉ số tài chính và dòng tiền (Key Financial & Cash Flow Ratios)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-gradient-to-br from-slate-700/40 to-slate-800/20 rounded-xl border border-slate-600/40">
                  <h5 className="font-medium text-cyan-400 mb-4">Chỉ số thanh khoản (Liquidity)</h5>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center p-2 bg-slate-600/20 rounded">
                      <span className="text-slate-300">Operating Cash Flow Ratio:</span>
                      <span className="text-white font-semibold">2.45x</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-slate-600/20 rounded">
                      <span className="text-slate-300">Cash Ratio:</span>
                      <span className="text-white font-semibold">0.82x</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-slate-600/20 rounded">
                      <span className="text-slate-300">Current Cash Debt Coverage:</span>
                      <span className="text-white font-semibold">15.2%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-slate-600/20 rounded">
                      <span className="text-slate-300">Quick Ratio:</span>
                      <span className="text-white font-semibold">1.38x</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 rounded-xl border border-emerald-400/20">
                  <h5 className="font-medium text-emerald-400 mb-4">Chỉ số hiệu quả (Efficiency)</h5>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center p-2 bg-emerald-500/10 rounded">
                      <span className="text-slate-300">Cash Flow Margin:</span>
                      <span className="text-emerald-400 font-semibold">21.6%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-emerald-500/10 rounded">
                      <span className="text-slate-300">Free Cash Flow Margin:</span>
                      <span className="text-emerald-400 font-semibold">12.1%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-emerald-500/10 rounded">
                      <span className="text-slate-300">Cash Return on Assets:</span>
                      <span className="text-emerald-400 font-semibold">8.7%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-emerald-500/10 rounded">
                      <span className="text-slate-300">Cash Flow Coverage:</span>
                      <span className="text-emerald-400 font-semibold">3.24x</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-xl border border-blue-400/20">
                  <h5 className="font-medium text-blue-400 mb-4">Chỉ số đầu tư (Investment)</h5>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center p-2 bg-blue-500/10 rounded">
                      <span className="text-slate-300">CAPEX/Sales Ratio:</span>
                      <span className="text-blue-400 font-semibold">6.1%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-blue-500/10 rounded">
                      <span className="text-slate-300">CAPEX/Depreciation:</span>
                      <span className="text-blue-400 font-semibold">1.8x</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-blue-500/10 rounded">
                      <span className="text-slate-300">Reinvestment Rate:</span>
                      <span className="text-blue-400 font-semibold">28.3%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-blue-500/10 rounded">
                      <span className="text-slate-300">FCF Yield:</span>
                      <span className="text-blue-400 font-semibold">12.1%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Analysis & Commentary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Strengths Analysis */}
              <div className="p-6 bg-gradient-to-br from-emerald-500/8 to-emerald-600/5 rounded-xl border border-emerald-400/30">
                <h4 className="text-lg font-semibold text-emerald-400 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Điểm mạnh (Key Strengths)
                </h4>
                <ul className="space-y-3 text-sm text-slate-200">
                  <li className="flex items-start gap-3 p-3 bg-emerald-500/10 rounded-lg">
                    <span className="text-emerald-400 font-bold mt-1 text-lg">•</span>
                    <div>
                      <strong className="text-white">Dòng tiền hoạt động vững mạnh:</strong>
                      <p className="text-slate-300 mt-1">OCF tăng 9.9% đạt 53.7 tỷ VND, thể hiện khả năng tạo tiền mặt từ hoạt động cốt lõi xuất sắc với margin 21.6%</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-3 bg-emerald-500/10 rounded-lg">
                    <span className="text-emerald-400 font-bold mt-1 text-lg">•</span>
                    <div>
                      <strong className="text-white">Cải thiện thanh khoản đáng kể:</strong>
                      <p className="text-slate-300 mt-1">Tiền mặt cuối kỳ tăng 140.6% lên 42.6 tỷ, đảm bảo khả năng chi trả và linh hoạt tài chính</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-3 bg-emerald-500/10 rounded-lg">
                    <span className="text-emerald-400 font-bold mt-1 text-lg">•</span>
                    <div>
                      <strong className="text-white">Tối ưu hóa tài sản hiệu quả:</strong>
                      <p className="text-slate-300 mt-1">Thu từ thanh lý TSCĐ và thoái vốn đầu tư tăng mạnh, cho thấy quản lý tài sản chủ động</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-3 bg-emerald-500/10 rounded-lg">
                    <span className="text-emerald-400 font-bold mt-1 text-lg">•</span>
                    <div>
                      <strong className="text-white">Free Cash Flow tích cực:</strong>
                      <p className="text-slate-300 mt-1">FCF 30.1 tỷ với margin 12.1%, vượt trội so với trung bình ngành 8.5%</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Areas of Concern */}
              <div className="p-6 bg-gradient-to-br from-yellow-500/8 to-orange-500/5 rounded-xl border border-yellow-400/30">
                <h4 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Điểm cần lưu ý (Areas of Concern)
                </h4>
                <ul className="space-y-3 text-sm text-slate-200">
                  <li className="flex items-start gap-3 p-3 bg-yellow-500/10 rounded-lg">
                    <span className="text-yellow-400 font-bold mt-1 text-lg">•</span>
                    <div>
                      <strong className="text-white">CAPEX tăng đáng kể:</strong>
                      <p className="text-slate-300 mt-1">Chi đầu tư TSCĐ tăng 18.8% lên 15.2 tỷ, cần theo dõi ROI và payback period các dự án</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-3 bg-yellow-500/10 rounded-lg">
                    <span className="text-yellow-400 font-bold mt-1 text-lg">•</span>
                    <div>
                      <strong className="text-white">Áp lực vốn lưu động:</strong>
                      <p className="text-slate-300 mt-1">Phải thu tăng 36.3%, hàng tồn kho tăng 46.2%, ảnh hưởng chu kỳ chuyển đổi tiền</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-3 bg-yellow-500/10 rounded-lg">
                    <span className="text-yellow-400 font-bold mt-1 text-lg">•</span>
                    <div>
                      <strong className="text-white">Chi phí tài chính gia tăng:</strong>
                      <p className="text-slate-300 mt-1">Chi phí lãi vay tăng 6.0% do mở rộng đầu tư bằng đòn bẩy tài chính</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-3 bg-yellow-500/10 rounded-lg">
                    <span className="text-yellow-400 font-bold mt-1 text-lg">•</span>
                    <div>
                      <strong className="text-white">Chính sách mua lại cổ phiếu:</strong>
                      <p className="text-slate-300 mt-1">Chi 1.5 tỷ mua cổ phiếu quỹ, cần đánh giá hiệu quả so với reinvestment</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Management Assessment */}
            <div className="mb-8 p-6 bg-gradient-to-r from-slate-900/60 to-slate-800/40 rounded-xl border border-slate-600/50">
              <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                Đánh giá quản lý dòng tiền (Management Cash Flow Assessment)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h5 className="font-medium text-cyan-400 mb-3">Chiến lược tài chính (Financial Strategy)</h5>
                  <p className="text-sm text-slate-300 leading-relaxed mb-4">
                    Ban lãnh đạo thể hiện chiến lược cân bằng tốt giữa tăng trưởng và hoàn vốn cho cổ đông.
                    Dòng tiền hoạt động mạnh mẽ 53.7 tỷ cho phép doanh nghiệp duy trì CAPEX cao 15.2 tỷ
                    đồng trong khi vẫn chi trả cổ tức 6.2 tỷ đồng (tỷ lệ chi trả 38.5%).
                  </p>
                  <div className="flex items-center gap-3 text-xs">
                    <Badge className="bg-emerald-500/20 text-emerald-400 px-2 py-1">Đánh giá: Tích cực</Badge>
                    <span className="text-slate-400">Cân bằng optimal capital allocation</span>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-blue-400 mb-3">Triển vọng 2025 (2025 Outlook)</h5>
                  <p className="text-sm text-slate-300 leading-relaxed mb-4">
                    Với vị thế tiền mặt mạnh 42.6 tỷ và OCF margin 21.6%, công ty có đủ tài chính để
                    thực hiện kế hoạch mở rộng. Dự kiến Free Cash Flow sẽ cải thiện 15-20% khi các dự án
                    đầu tư 2024 bắt đầu sinh lời từ H2/2025.
                  </p>
                  <div className="flex items-center gap-3 text-xs">
                    <Badge className="bg-blue-500/20 text-blue-400 px-2 py-1">Dự báo: Khả quan</Badge>
                    <span className="text-slate-400">FCF target: 35-40 tỷ năm 2025</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
                <h6 className="font-medium text-white mb-2">Khuyến nghị quản lý (Management Recommendations)</h6>
                <ul className="text-xs text-slate-300 space-y-1">
                  <li>• Tối ưu hóa chu kỳ thu tiền từ 45 ngày xuống 40 ngày để cải thiện working capital</li>
                  <li>• Theo dõi chặt chẽ ROI các dự án CAPEX, đặt target tối thiểu 15% IRR</li>
                  <li>• Cân nhắc tăng tỷ lệ chi trả cổ tức lên 45% nếu FCF đạt target 2025</li>
                  <li>• Duy trì cash buffer 25-30 tỷ để đảm bảo tính linh hoạt tài chính</li>
                </ul>
              </div>
            </div>

            {/* Industry Benchmark */}
            <div className="p-6 bg-gradient-to-r from-slate-800/50 to-slate-700/30 rounded-xl border border-slate-600/40">
              <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <BarChart className="w-5 h-5" />
                So sánh ngành (Industry Benchmark Analysis)
              </h4>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-slate-700/40 rounded-lg">
                  <div className="text-slate-400 mb-2 text-sm">OCF Margin</div>
                  <div className="text-2xl font-bold text-emerald-400 mb-1">21.6%</div>
                  <div className="text-xs text-slate-500 mb-2">TB ngành: 18.3%</div>
                  <Badge className="bg-emerald-500/20 text-emerald-400 text-xs">Vượt trội</Badge>
                </div>
                <div className="text-center p-4 bg-slate-700/40 rounded-lg">
                  <div className="text-slate-400 mb-2 text-sm">CAPEX/Sales</div>
                  <div className="text-2xl font-bold text-blue-400 mb-1">6.1%</div>
                  <div className="text-xs text-slate-500 mb-2">TB ngành: 5.8%</div>
                  <Badge className="bg-blue-500/20 text-blue-400 text-xs">Tương đương</Badge>
                </div>
                <div className="text-center p-4 bg-slate-700/40 rounded-lg">
                  <div className="text-slate-400 mb-2 text-sm">Free CF Yield</div>
                  <div className="text-2xl font-bold text-purple-400 mb-1">12.1%</div>
                  <div className="text-xs text-slate-500 mb-2">TB ngành: 9.7%</div>
                  <Badge className="bg-purple-500/20 text-purple-400 text-xs">Xuất sắc</Badge>
                </div>
                <div className="text-center p-4 bg-slate-700/40 rounded-lg">
                  <div className="text-slate-400 mb-2 text-sm">Cash/Assets</div>
                  <div className="text-2xl font-bold text-cyan-400 mb-1">14.8%</div>
                  <div className="text-xs text-slate-500 mb-2">TB ngành: 12.1%</div>
                  <Badge className="bg-cyan-500/20 text-cyan-400 text-xs">Tốt</Badge>
                </div>
              </div>

              <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
                <h6 className="font-medium text-white mb-3">Xếp hạng trong ngành (Industry Ranking)</h6>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-slate-400">Dòng tiền</div>
                    <div className="text-emerald-400 font-bold">Top 15%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-slate-400">Hiệu quả đầu tư</div>
                    <div className="text-blue-400 font-bold">Top 25%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-slate-400">Thanh khoản</div>
                    <div className="text-cyan-400 font-bold">Top 20%</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </TabsContent >
      </div >
    </Tabs >
  );
}
