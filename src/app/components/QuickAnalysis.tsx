"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity,
  Target,
  AlertCircle,
  Zap,
  Clock,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getSymbolData } from "@/services/api";

// Stock data with detailed information
const stockData = [
  {
    code: "VSC",
    name: "Vietcombank",
    price: "95.8",
    change: "+2.1",
    changePercent: "+2.24%",
    trend: "up",
    color: "text-green-600",
    volume: "2.1M",
    value: "201.8B",
    session: {
      open: "93.5",
      high: "96.2",
      low: "93.0",
      avgPrice: "95.1",
    },
    technical: {
      rsi: 65.4,
      macd: "Bullish",
      ma20: "Above",
      support: "92.0",
      resistance: "98.0",
    },
    recommendation: "BUY",
    sector: "Banking",
  },
  {
    code: "TCB",
    name: "Techcombank",
    price: "23.4",
    change: "+0.7",
    changePercent: "+3.08%",
    trend: "up",
    color: "text-green-600",
    volume: "8.5M",
    value: "198.9B",
    session: {
      open: "22.7",
      high: "23.6",
      low: "22.6",
      avgPrice: "23.2",
    },
    technical: {
      rsi: 72.1,
      macd: "Strong Bullish",
      ma20: "Above",
      support: "22.0",
      resistance: "25.0",
    },
    recommendation: "STRONG_BUY",
    sector: "Banking",
  },
  {
    code: "BID",
    name: "BIDV",
    price: "48.2",
    change: "-0.3",
    changePercent: "-0.62%",
    trend: "down",
    color: "text-red-600",
    volume: "1.2M",
    value: "57.8B",
    session: {
      open: "48.5",
      high: "48.7",
      low: "47.8",
      avgPrice: "48.3",
    },
    technical: {
      rsi: 45.8,
      macd: "Bearish",
      ma20: "Below",
      support: "47.0",
      resistance: "50.0",
    },
    recommendation: "HOLD",
    sector: "Banking",
  },
  {
    code: "ACB",
    name: "ACB",
    price: "22.5",
    change: "+0.5",
    changePercent: "+2.27%",
    trend: "up",
    color: "text-green-600",
    volume: "3.8M",
    value: "85.5B",
    session: {
      open: "22.0",
      high: "22.7",
      low: "21.9",
      avgPrice: "22.3",
    },
    technical: {
      rsi: 58.2,
      macd: "Bullish",
      ma20: "Above",
      support: "21.5",
      resistance: "24.0",
    },
    recommendation: "BUY",
    sector: "Banking",
  },
  {
    code: "HPG",
    name: "Hoa Phat Group",
    price: "24.6",
    change: "+1.2",
    changePercent: "+5.13%",
    trend: "up",
    color: "text-green-600",
    volume: "12.3M",
    value: "302.4B",
    session: {
      open: "23.4",
      high: "24.8",
      low: "23.2",
      avgPrice: "24.1",
    },
    technical: {
      rsi: 76.3,
      macd: "Very Bullish",
      ma20: "Above",
      support: "23.0",
      resistance: "26.0",
    },
    recommendation: "STRONG_BUY",
    sector: "Steel",
  },
  {
    code: "HSG",
    name: "Hoa Sen Group",
    price: "3.4",
    change: "+0.1",
    changePercent: "+3.03%",
    trend: "up",
    color: "text-green-600",
    volume: "15.2M",
    value: "51.7B",
    session: {
      open: "3.3",
      high: "3.5",
      low: "3.3",
      avgPrice: "3.4",
    },
    technical: {
      rsi: 68.9,
      macd: "Bullish",
      ma20: "Above",
      support: "3.2",
      resistance: "3.7",
    },
    recommendation: "BUY",
    sector: "Steel",
  },
  {
    code: "VHM",
    name: "Vinhomes",
    price: "45.2",
    change: "-0.8",
    changePercent: "-1.74%",
    trend: "down",
    color: "text-red-600",
    volume: "2.9M",
    value: "131.1B",
    session: {
      open: "46.0",
      high: "46.1",
      low: "44.8",
      avgPrice: "45.4",
    },
    technical: {
      rsi: 38.7,
      macd: "Bearish",
      ma20: "Below",
      support: "43.0",
      resistance: "47.0",
    },
    recommendation: "SELL",
    sector: "Real Estate",
  },
  {
    code: "VIC",
    name: "Vingroup",
    price: "41.8",
    change: "-0.2",
    changePercent: "-0.48%",
    trend: "down",
    color: "text-red-600",
    volume: "1.8M",
    value: "75.2B",
    session: {
      open: "42.0",
      high: "42.3",
      low: "41.5",
      avgPrice: "41.9",
    },
    technical: {
      rsi: 42.1,
      macd: "Neutral",
      ma20: "At",
      support: "40.0",
      resistance: "44.0",
    },
    recommendation: "HOLD",
    sector: "Conglomerate",
  },
];

const getTrendIcon = (trend: string) => {
  return trend === "up" ? (
    <TrendingUp className="w-4 h-4" />
  ) : (
    <TrendingDown className="w-4 h-4" />
  );
};

const getRecommendationColor = (rec: string) => {
  switch (rec) {
    case "STRONG_BUY":
      return "text-emerald-300 bg-emerald-500/20 border-emerald-400/50";
    case "BUY":
      return "text-blue-300 bg-blue-500/20 border-blue-400/50";
    case "HOLD":
      return "text-amber-300 bg-amber-500/20 border-amber-400/50";
    case "SELL":
      return "text-red-300 bg-red-500/20 border-red-400/50";
    default:
      return "text-slate-300 bg-slate-500/20 border-slate-400/50";
  }
};

const getRecommendationIcon = (rec: string) => {
  switch (rec) {
    case "STRONG_BUY":
      return <ArrowUpRight className="w-3 h-3" />;
    case "BUY":
      return <TrendingUp className="w-3 h-3" />;
    case "HOLD":
      return <Minus className="w-3 h-3" />;
    case "SELL":
      return <ArrowDownRight className="w-3 h-3" />;
    default:
      return <AlertCircle className="w-3 h-3" />;
  }
};

export function QuickAnalysis() {

  const [selectedStock, setSelectedStock] = useState("VSC");
  const [activeTab, setActiveTab] = useState("overview");


  const { slug } = useParams<{ slug: string }>();
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<SymbolByNameData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  type SymbolByNameData = {

    name: string;
    id: string;
    exchange: string;
    updated_at: string;
  };
  useEffect(() => {
    const fetchSymbols = async () => {
      try {
        const data = await getSymbolData(selectedStock);
        setData(data);
      } catch (err) {
        setError("Không lấy được dữ liệu symbol");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    setLoading(true);
    fetchSymbols();
    // No return value here (void)
  }, [selectedStock]);

  const selectedData =
    data?.find((stock) => stock.name === selectedStock);
    
  console.log("Data  fix:", selectedData);
  return (
    <div className="space-y-6">
      {/* Stock Selection Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
        {data?.map((data) => (
          <Card
            key={data.name}
            className={`cursor-pointer transition-all hover:shadow-lg border-2 ${selectedStock === data.name
              ? "ring-2 ring-blue-400 bg-blue-500/20 border-blue-400/50"
              : "hover:bg-gray-800/60 bg-gray-800/40 border-gray-600/30 hover:border-gray-500/50"
              }`}
            onClick={() => setSelectedStock(data.name)}
          >
            <CardContent className="p-3 text-center">
              <div className="text-base font-medium mb-1 text-white">
                {data.name}
              </div>
              <div className="text-sm text-gray-300 mb-1">{data.name}</div>
              <div
                className={`text-sm flex items-center justify-center gap-1 ${data.id === "up" ? "text-emerald-400" : "text-red-400"
                  }`}
              >
                {getTrendIcon(data.id)}
                <span>{data.id}</span>
              </div>
              <div className="mt-1">
                <Badge
                  variant="outline"
                  className={`text-xs ${getRecommendationColor(
                    data.name
                  )}`}
                >
                  {getRecommendationIcon(data.name)}
                  <span className="ml-1">
                    {data.name === "STRONG_BUY"
                      ? "MUA MẠNH"
                      : data.name === "BUY"
                        ? "MUA"
                        : data.name === "HOLD"
                          ? "GIỮ"
                          : "BÁN"}
                  </span>
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Analysis Content */}
      <div className="">
        {/* Chart and Visual Section */}
        <div className="">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 bg-gray-800/60 border border-gray-600/30">
              <TabsTrigger
                value="overview"
                className="flex items-center gap-2 data-[state=active]:bg-blue-500/20 data-[state=active]:text-white text-gray-300"
              >
                <BarChart3 className="w-4 h-4" />
                Tổng quan
              </TabsTrigger>
              <TabsTrigger
                value="technical"
                className="flex items-center gap-2 data-[state=active]:bg-blue-500/20 data-[state=active]:text-white text-gray-300"
              >
                <Activity className="w-4 h-4" />
                Kỹ thuật
              </TabsTrigger>
              <TabsTrigger
                value="news"
                className="flex items-center gap-2 data-[state=active]:bg-blue-500/20 data-[state=active]:text-white text-gray-300"
              >
                <Eye className="w-4 h-4" />
                Tin tức
              </TabsTrigger>
            </TabsList>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4 w-full">
              <div className="lg:col-span-2">
                <TabsContent value="overview">
                  <Card className="bg-gray-800/60 border border-gray-600/30">
                    <CardContent className="p-4">
                      {/* Stock Chart */}
                      {/* <div className="bg-gray-800/40 rounded-lg p-4 mb-4 border border-gray-600/30">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-white text-lg">
                              {selectedData?.name}
                            </h3>
                            <Badge
                              variant="outline"
                              className="text-xs text-blue-300 border-blue-400/50 bg-blue-400/10"
                            >
                              {selectedData.sector}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Clock className="w-4 h-4 text-blue-400" />
                            <span>Cập nhật: 14:32</span>
                          </div>
                        </div>

                        <Image
                          width={1080}
                          height={720}
                          src="/temp.jpg"
                          alt={`Biểu đồ giao dịch ${selectedData.name}`}
                          className="w-full h-48 object-cover rounded"
                        />
                      </div> */}

                      {/* Simple Text Analysis */}
                      <div className="space-y-4">
                        <h4 className="text-xl font-semibold text-white flex items-center gap-2">
                          <Activity className="w-5 h-5 text-blue-400" />
                          Thông tin phân tích
                        </h4>
                        <div
                          className="p-4 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-lg border border-blue-400/20">

                          <h5 className="text-base font-medium text-slate-400 mb-3">
                            {selectedData?.name}
                            {selectedData?.exchange}
                          </h5>

                        </div>
                        {/* <div className="bg-gray-800/40 rounded-lg border border-gray-600/30 p-4">
                          <div className="space-y-2 text-base leading-relaxed">
                            <p className="text-gray-300">
                              <span className="text-gray-400">RSI (14):</span>
                              <span
                                className={`ml-2 font-medium ${selectedData.technical.rsi > 70
                                  ? "text-red-400"
                                  : selectedData.technical.rsi < 30
                                    ? "text-emerald-400"
                                    : "text-yellow-400"
                                  }`}
                              >
                                {selectedData.technical.rsi}
                                {selectedData.technical.rsi > 70
                                  ? " (Quá mua)"
                                  : selectedData.technical.rsi < 30
                                    ? " (Quá bán)"
                                    : " (Trung tính)"}
                              </span>
                            </p>

                            <p className="text-slate-300">
                              <span className="text-slate-400">MACD:</span>
                              <span
                                className={`ml-2 font-medium ${selectedData.technical.macd.includes(
                                  "Bullish"
                                )
                                  ? "text-emerald-400"
                                  : selectedData.technical.macd.includes(
                                    "Bearish"
                                  )
                                    ? "text-red-400"
                                    : "text-yellow-400"
                                  }`}
                              >
                                {selectedData.technical.macd}
                              </span>
                            </p>

                            <p className="text-slate-300">
                              <span className="text-slate-400">
                                Đường trung bình 20:
                              </span>
                              <span
                                className={`ml-2 font-medium ${selectedData.technical.ma20 === "Above"
                                  ? "text-emerald-400"
                                  : selectedData.technical.ma20 === "Below"
                                    ? "text-red-400"
                                    : "text-yellow-400"
                                  }`}
                              >
                                {selectedData.technical.ma20 === "Above"
                                  ? "Trên MA20"
                                  : selectedData.technical.ma20 === "Below"
                                    ? "Dưới MA20"
                                    : "Tại MA20"}
                              </span>
                            </p>

                            <p className="text-slate-300">
                              <span className="text-slate-400">
                                Vùng hỗ trợ:
                              </span>
                              <span className="ml-2 font-medium text-cyan-400">
                                {selectedData.technical.support}
                              </span>
                              <span className="text-slate-400"> • </span>
                              <span className="text-slate-400">
                                Vùng kháng cự:
                              </span>
                              <span className="ml-1 font-medium text-orange-400">
                                {selectedData.technical.resistance}
                              </span>
                            </p>

                            <p className="text-slate-300">
                              <span className="text-slate-400">
                                Khối lượng giao dịch:
                              </span>
                              <span className="ml-2 font-medium text-white">
                                {selectedData.volume}
                              </span>
                              <span className="text-slate-400"> • </span>
                              <span className="text-slate-400">Giá trị:</span>
                              <span className="ml-1 font-medium text-white">
                                {selectedData.value}
                              </span>
                            </p>

                            <div className="pt-2 border-t border-slate-600/50">
                              <p className="text-slate-300">
                                <span className="text-slate-400">
                                  Khuyến nghị đầu tư:
                                </span>
                                <span
                                  className={`ml-2 font-medium ${selectedData.recommendation === "STRONG_BUY"
                                    ? "text-emerald-400"
                                    : selectedData.recommendation === "BUY"
                                      ? "text-blue-400"
                                      : selectedData.recommendation === "SELL"
                                        ? "text-red-400"
                                        : "text-yellow-400"
                                    }`}
                                >
                                  {selectedData.recommendation === "STRONG_BUY"
                                    ? "MUA MẠNH"
                                    : selectedData.recommendation === "BUY"
                                      ? "MUA"
                                      : selectedData.recommendation === "SELL"
                                        ? "BÁN"
                                        : "GIỮ"}
                                </span>
                                <span className="text-slate-400">
                                  {" "}
                                  cho nhóm{" "}
                                </span>
                                <span className="font-medium text-cyan-400">
                                  {selectedData.sector}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div> */}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="technical">
                  <Card className="bg-gradient-to-br from-slate-800/40 to-slate-700/40 border border-blue-400/20">
                    <CardContent className="p-4">
                      <h4 className="text-lg font-medium text-slate-300 mb-4 flex items-center gap-2">
                        <Target className="w-6 h-6 text-teal-400" />
                        Phân tích kỹ thuật
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* Technical Indicators */}
                        {/* <div className="space-y-3">
                          <h5 className="text-base font-medium text-slate-400">
                            Chỉ báo kỹ thuật
                          </h5>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-lg border border-blue-400/30">
                              <span className="text-base text-slate-300">
                                RSI (14):
                              </span>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className={
                                    selectedData.technical.rsi > 70
                                      ? "text-red-300 border-red-400/50 bg-red-500/20"
                                      : selectedData.technical.rsi < 30
                                        ? "text-emerald-300 border-emerald-400/50 bg-emerald-500/20"
                                        : "text-amber-300 border-amber-400/50 bg-amber-500/20"
                                  }
                                >
                                  {selectedData.technical.rsi}
                                </Badge>
                                <span className="text-sm text-slate-400">
                                  {selectedData.technical.rsi > 70
                                    ? "Quá mua"
                                    : selectedData.technical.rsi < 30
                                      ? "Quá bán"
                                      : "Trung tính"}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-lg border border-emerald-400/30">
                              <span className="text-base text-slate-300">
                                MACD:
                              </span>
                              <Badge
                                variant="outline"
                                className={
                                  selectedData.technical.macd.includes(
                                    "Bullish"
                                  )
                                    ? "text-emerald-300 border-emerald-400/50 bg-emerald-500/20"
                                    : selectedData.technical.macd.includes(
                                      "Bearish"
                                    )
                                      ? "text-red-300 border-red-400/50 bg-red-500/20"
                                      : "text-amber-300 border-amber-400/50 bg-amber-500/20"
                                }
                              >
                                {selectedData.technical.macd}
                              </Badge>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-400/30">
                              <span className="text-base text-slate-300">
                                MA20:
                              </span>
                              <Badge
                                variant="outline"
                                className={
                                  selectedData.technical.ma20 === "Above"
                                    ? "text-emerald-300 border-emerald-400/50 bg-emerald-500/20"
                                    : selectedData.technical.ma20 === "Below"
                                      ? "text-red-300 border-red-400/50 bg-red-500/20"
                                      : "text-amber-300 border-amber-400/50 bg-amber-500/20"
                                }
                              >
                                {selectedData.technical.ma20 === "Above"
                                  ? "Trên MA20"
                                  : selectedData.technical.ma20 === "Below"
                                    ? "Dưới MA20"
                                    : "Tại MA20"}
                              </Badge>
                            </div>
                          </div>
                        </div> */}

                        {/* Support/Resistance */}
                        {/* <div className="space-y-3">
                          <h5 className="text-base font-medium text-slate-400">
                            Hỗ trợ & Kháng cự
                          </h5>
                          <div className="space-y-2">
                            <div className="p-3 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-lg border border-red-400/30">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-base text-red-300">
                                  Kháng cự:
                                </span>
                                <span className="font-medium text-red-400">
                                  {selectedData.technical.resistance}
                                </span>
                              </div>
                              <div className="text-sm text-red-300/80">
                                Khoảng cách:{" "}
                                {(
                                  ((parseFloat(
                                    selectedData.technical.resistance
                                  ) -
                                    parseFloat(selectedData.price)) /
                                    parseFloat(selectedData.price)) *
                                  100
                                ).toFixed(2)}
                                %
                              </div>
                            </div>

                            <div className="p-3 bg-gradient-to-r from-slate-700/50 to-slate-600/50 rounded-lg border border-blue-400/20">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-base text-slate-300">
                                  Giá hiện tại:
                                </span>
                                <span className="font-medium text-white">
                                  {selectedData.price}
                                </span>
                              </div>
                              <div className="text-sm text-slate-400">
                                Biến động: {selectedData.change} (
                                {selectedData.changePercent})
                              </div>
                            </div>

                            <div className="p-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-lg border border-emerald-400/30">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-base text-emerald-300">
                                  Hỗ trợ:
                                </span>
                                <span className="font-medium text-emerald-400">
                                  {selectedData.technical.support}
                                </span>
                              </div>
                              <div className="text-sm text-emerald-300/80">
                                Khoảng cách:{" "}
                                {(
                                  ((parseFloat(selectedData.price) -
                                    parseFloat(
                                      selectedData.technical.support
                                    )) /
                                    parseFloat(selectedData.price)) *
                                  100
                                ).toFixed(2)}
                                %
                              </div>
                            </div>
                          </div>
                        </div> */}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* <TabsContent value="news">
                  <Card className="bg-gradient-to-br from-slate-800/40 to-slate-700/40 border border-blue-400/20">
                    <CardContent className="p-4">
                      <h4 className="text-lg font-medium text-slate-300 mb-4 flex items-center gap-2">
                        <Eye className="w-6 h-6 text-sky-400" />
                        Tin tức liên quan {selectedData.code}
                      </h4>

                      <div className="space-y-3">
                        <div className="p-3 border border-blue-400/20 bg-gradient-to-r from-slate-700/40 to-slate-600/40 rounded-lg hover:bg-gradient-to-r hover:from-slate-700/60 hover:to-slate-600/60 cursor-pointer transition-all">
                          <h5 className="text-base font-medium mb-2 text-white">
                            {selectedData.code} công bố kết quả kinh doanh quý 4
                            vượt kỳ vọng
                          </h5>
                          <div className="flex items-center justify-between text-sm text-slate-400">
                            <span>2 giờ trước</span>
                            <Badge
                              variant="outline"
                              className="text-emerald-300 border-emerald-400/50 bg-emerald-500/20"
                            >
                              Tích cực
                            </Badge>
                          </div>
                        </div>

                        <div className="p-3 border border-blue-400/20 bg-gradient-to-r from-slate-700/40 to-slate-600/40 rounded-lg hover:bg-gradient-to-r hover:from-slate-700/60 hover:to-slate-600/60 cursor-pointer transition-all">
                          <h5 className="text-base font-medium mb-2 text-white">
                            Khuyến nghị mua mạnh {selectedData.code} từ CTCK ABC
                          </h5>
                          <div className="flex items-center justify-between text-sm text-slate-400">
                            <span>4 giờ trước</span>
                            <Badge
                              variant="outline"
                              className="text-blue-300 border-blue-400/50 bg-blue-500/20"
                            >
                              Phân tích
                            </Badge>
                          </div>
                        </div>

                        <div className="p-3 border border-blue-400/20 bg-gradient-to-r from-slate-700/40 to-slate-600/40 rounded-lg hover:bg-gradient-to-r hover:from-slate-700/60 hover:to-slate-600/60 cursor-pointer transition-all">
                          <h5 className="text-base font-medium mb-2 text-white">
                            {selectedData.sector === "Banking"
                              ? "Ngân hàng"
                              : selectedData.sector}{" "}
                            - Triển vọng tích cực trong quý tới
                          </h5>
                          <div className="flex items-center justify-between text-sm text-slate-400">
                            <span>1 ngày trước</span>
                            <Badge
                              variant="outline"
                              className="text-purple-300 border-purple-400/50 bg-purple-500/20"
                            >
                              Ngành
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent> */}
              </div>
              {/* Action and Summary Section */}
              <div className="space-y-4">
                {/* Stock Summary Card */}
                <Card className="bg-gradient-to-br from-blue-500/20 via-cyan-500/20 to-teal-500/20 border border-blue-400/30 shadow-lg">
                  <CardContent className="p-4">
                    {/* <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-lg text-white">
                          {selectedData.code}
                        </h3>
                        <p className="text-base text-slate-400">
                          {selectedData.name}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`${getRecommendationColor(
                          selectedData.recommendation
                        )} font-medium`}
                      >
                        {getRecommendationIcon(selectedData.recommendation)}
                      </Badge>
                    </div> */}

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-base text-slate-400">
                          Cập nhật:
                        </span>
                        <div className="text-right">
                          <div
                            className={`font-medium text-lg ${selectedData?.name === "up"
                              ? "text-emerald-400"
                              : "text-red-400"
                              }`}
                          >
                            {selectedData?.updated_at}
                          </div>
                          <div
                            className={`text-sm flex items-center gap-1 ${selectedData?.exchange === "up"
                              ? "text-emerald-400"
                              : "text-red-400"
                              }`}
                          >
                            {selectedData?.exchange === "up"
                              ? getTrendIcon("up")
                              : getTrendIcon("down")}
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-blue-400/20">
                        <Link href={`/viewdetails/${selectedData?.name}`}>
                          <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0">
                            <Eye className="w-6 h-6 mr-2" />
                            <span className="text-sm">Xem chi tiết</span>
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                {/* <Card className="bg-gradient-to-br from-slate-800/40 to-slate-700/40 border border-blue-400/20">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-3 text-white text-lg">
                      Thống kê nhanh
                    </h4>
                    <div className="space-y-2 text-base">
                      <div className="flex justify-between">
                        <span className="text-slate-400">
                          Cao nhất trong ngày:
                        </span>
                        <span className="text-emerald-400">
                          {selectedData.session.high}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">
                          Thấp nhất trong ngày:
                        </span>
                        <span className="text-red-400">
                          {selectedData.session.low}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Giá mở cửa:</span>
                        <span className="text-white">
                          {selectedData.session.open}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Khối lượng:</span>
                        <span className="text-cyan-400">
                          {selectedData.volume}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card> */}
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

