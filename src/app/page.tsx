"use client";
import Image from "next/image";
import { useState } from "react";
import { useEffect } from "react";
import { ChartColumnBig, Clock, Eye, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DeepAnalysisPage } from "./components/DeepAnalysisPage";
import { NewsDetailPage } from "./components/NewDetailPage";
import { QuickAnalysis } from "./components/QuickAnalysis";
import { TogogoTradingBotCompact } from "./components/TogogoTradingBotCompact";
import { NewsColumns } from "./components/NewsColumns";
import { EconomicCalendar } from "./components/EconomicCalendar";
import { NewsSidebar } from "./components/NewsSidebar";

export default function Home() {
  const [currentView, setCurrentView] = useState<
    "home" | "details" | "news-detail" | "deep-analysis"
  >("home");
  const [selectedStock, setSelectedStock] = useState<string>("");
  const [selectedArticle, setSelectedArticle] = useState<number>(1);

  const [time, setTime] = useState(new Date());
  const formattedTime = time.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleViewDetails = (stockCode: string) => {
    setSelectedStock(stockCode);
    setCurrentView("details");
  };

  const handleViewNews = (articleId: number) => {
    setSelectedArticle(articleId);
    setCurrentView("news-detail");
  };

  const handleViewDeepAnalysis = () => {
    setCurrentView("deep-analysis");
  };

  const handleBackToHome = () => {
    setCurrentView("home");
    setSelectedStock("");
    setSelectedArticle(1);
  };

  if (currentView === "news-detail") {
    return (
      <NewsDetailPage
        articleId={selectedArticle}
        onBack={handleBackToHome}
        onViewDetails={handleViewDetails}
      />
    );
  }

  if (currentView === "deep-analysis") {
    return <DeepAnalysisPage onBack={handleBackToHome} />;
  }
  return (
    <div className="min-h-screen">
      {/* Add top padding to account for fixed header (smaller on mobile) */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-4">
          {/* Quick Analysis Section - Enhanced */}
          <Card
            className="mb-4 shadow-xl bg-gray-900/80 border border-gray-600/30 backdrop-blur-md relative overflow-hidden"
            id="quick-analysis"
          >
            {/* Card decorative pattern */}
            <div className="absolute inset-0 pattern-gentle-dots opacity-70 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-blue-400/15 via-blue-400/8 to-transparent rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-emerald-400/10 to-transparent rounded-full blur-xl"></div>
            <CardContent className="p-4 relative z-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
                  <h2 className="text-2xl font-bold text-white">
                    PHÂN TÍCH NHANH
                  </h2>
                  <Badge
                    variant="outline"
                    className="ml-3 text-blue-300 border-blue-500/50 bg-blue-500/10 px-2 py-1 text-xs"
                  >
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse mr-1"></div>
                    Live
                  </Badge>
                </div>
                <div className="text-xs text-gray-400 bg-gray-800/60 px-2 py-1 rounded">
                  12:45 PM
                </div>
              </div>
              <QuickAnalysis />
            </CardContent>
          </Card>

          {/* Trading Bot Suggestions Section - Enhanced */}
          <Card
            className="mb-4 shadow-xl bg-gray-900/80 border border-gray-600/30 backdrop-blur-md relative overflow-hidden"
            id="trading-bot"
          >
            {/* Card decorative pattern */}
            <div className="absolute inset-0 pattern-waves opacity-80 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-emerald-400/18 via-emerald-400/10 to-transparent rounded-full blur-2xl"></div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-400/12 to-transparent rounded-full blur-xl"></div>
            <CardContent className="p-4 relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1.5 h-6 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-white">
                  GỢI Ý TRADING BOT
                </h2>
                <Badge
                  variant="outline"
                  className="ml-3 text-emerald-300 border-emerald-500/50 bg-emerald-500/10 px-2 py-1 text-xs"
                >
                  <Sparkles className="w-3 h-3 mr-1 text-yellow-400" />
                  AI v2.1
                </Badge>
              </div>
              <TogogoTradingBotCompact />
            </CardContent>
          </Card>

          {/* Economic Calendar Section - New */}
          <div className="mb-4" id="economic-calendar">
            <EconomicCalendar />
          </div>

          {/* Main Content Grid - 3:1 Layout */}
          <div className="flex items-center gap-2 mb-6 mt-12" id="news">
            <div className="w-1.5 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
            <h2 className="text-2xl font-bold text-white">
              TIN TỨC THEO CHUYÊN MỤC
            </h2>
            <Badge
              variant="outline"
              className="ml-3 text-cyan-400 border-cyan-400/50 bg-cyan-400/10 px-3 py-1"
            >
              Đa dạng
            </Badge>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Main Content Area - 3 columns */}
            <div className="lg:col-span-3 space-y-4">
              {/* News Columns */}

              <NewsColumns onViewNews={handleViewNews} />

              {/* Latest News Section */}
              <Card className="border border-gray-600/30 bg-gray-900/80 backdrop-blur-md shadow-xl relative overflow-hidden">
                {/* Card decorative pattern */}
                <div className="absolute inset-0 pattern-organic opacity-75 pointer-events-none"></div>
                <div className="absolute top-4 left-4 w-32 h-32 bg-gradient-to-br from-blue-400/12 via-purple-400/8 to-transparent rounded-full blur-2xl"></div>
                <div className="absolute bottom-4 right-4 w-24 h-24 bg-gradient-to-tl from-emerald-400/10 to-transparent rounded-full blur-xl"></div>
                <CardContent className="p-4 relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1.5 h-10 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
                    <h3 className="font-bold text-2xl text-white">
                      Tin tức mới nhất
                    </h3>
                    <Badge className="bg-blue-500/20 border-blue-500/50 text-blue-300 px-2 py-1 text-xs">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse mr-1"></div>
                      Live
                    </Badge>
                  </div>

                  {/* Grid layout for news items - 2 columns, 3 rows */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-800/60 rounded-lg border border-gray-600/40 hover:border-gray-500/60 cursor-pointer transition-all duration-300 hover:shadow-lg hover:bg-gray-800/80 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/8 via-transparent to-emerald-400/4 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-emerald-400/6 to-transparent rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="flex items-start gap-3 relative z-10">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0 animate-pulse"></div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-2 text-white leading-tight text-base hover:text-gray-100 transition-colors">
                            VN-Index vượt mốc 1,280 điểm trong phiên chiều với
                            thanh khoản cao
                          </h4>
                          <p className="text-gray-300 text-base mb-3 leading-relaxed">
                            Chỉ số VN-Index tiếp tục đà tăng mạnh với thanh
                            khoản đạt gần 15,000 tỷ đồng, được dẫn dắt bởi nhóm
                            ngân hàng và bất động sản.
                          </p>
                          <div className="flex items-center gap-4 text-base text-gray-400">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-gray-400" />
                              <span>2h</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5 text-gray-400" />
                              <span>12.5K</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-800/60 rounded-lg border border-gray-600/40 hover:border-gray-500/60 cursor-pointer transition-all duration-300 hover:shadow-lg hover:bg-gray-800/80 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/8 via-transparent to-blue-400/4 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-blue-400/6 to-transparent rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="flex items-start gap-3 relative z-10">
                        <div
                          className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0 animate-pulse"
                          style={{ animationDelay: "0.5s" }}
                        ></div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-2 text-white leading-tight text-base hover:text-gray-100 transition-colors">
                            Khối ngoại mua ròng 500 tỷ đồng, tập trung vào nhóm
                            ngân hàng
                          </h4>
                          <p className="text-gray-300 text-base mb-3 leading-relaxed">
                            Dòng tiền từ khối ngoại tiếp tục đổ mạnh vào thị
                            trường, VSC, TCB, BID là những mã được quan tâm
                            nhất.
                          </p>
                          <div className="flex items-center gap-4 text-base text-gray-400">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-gray-400" />
                              <span>3h</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5 text-gray-400" />
                              <span>8.2K</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-800/60 rounded-lg border border-gray-600/40 hover:border-gray-500/60 cursor-pointer transition-all duration-300 hover:shadow-lg hover:bg-gray-800/80 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-400/8 via-transparent to-purple-400/4 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute top-0 left-0 w-18 h-18 bg-gradient-to-br from-purple-400/6 to-transparent rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="flex items-start gap-3 relative z-10">
                        <div
                          className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0 animate-pulse"
                          style={{ animationDelay: "1s" }}
                        ></div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-2 text-white leading-tight text-base hover:text-gray-100 transition-colors">
                            HPG công bố kết quả kinh doanh Q4 vượt kỳ vọng
                          </h4>
                          <p className="text-gray-300 text-base mb-3 leading-relaxed">
                            Tập đoàn Hòa Phát ghi nhận doanh thu Q4/2024 đạt
                            45,600 tỷ đồng, lợi nhuận vượt 15% so với dự báo.
                          </p>
                          <div className="flex items-center gap-4 text-base text-gray-400">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-gray-400" />
                              <span>4h</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5 text-gray-400" />
                              <span>6.1K</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-800/60 rounded-lg border border-gray-600/40 hover:border-gray-500/60 cursor-pointer transition-all duration-300 hover:shadow-lg hover:bg-gray-800/80 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-red-400/8 via-transparent to-red-400/4 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-red-400/6 to-transparent rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="flex items-start gap-3 relative z-10">
                        <div
                          className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0 animate-pulse"
                          style={{ animationDelay: "1.5s" }}
                        ></div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-2 text-white leading-tight text-base hover:text-gray-100 transition-colors">
                            Fed cắt giảm lãi suất 0.25%, tác động tích cực đến
                            TTCK Việt Nam
                          </h4>
                          <p className="text-gray-300 text-base mb-3 leading-relaxed">
                            Quyết định của Fed giúp giảm áp lực lên USD, dự báo
                            VN-Index có thể hướng tới 1,350 điểm.
                          </p>
                          <div className="flex items-center gap-4 text-base text-gray-400">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-gray-400" />
                              <span>5h</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5 text-gray-400" />
                              <span>15.3K</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-800/60 rounded-lg border border-gray-600/40 hover:border-gray-500/60 cursor-pointer transition-all duration-300 hover:shadow-lg hover:bg-gray-800/80 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/8 via-transparent to-yellow-400/4 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-yellow-400/6 to-transparent rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="flex items-start gap-3 relative z-10">
                        <div
                          className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0 animate-pulse"
                          style={{ animationDelay: "2s" }}
                        ></div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-2 text-white leading-tight text-base hover:text-gray-100 transition-colors">
                            Chính phủ công bố gói hỗ trợ phục hồi kinh tế
                            120,000 tỷ đồng
                          </h4>
                          <p className="text-gray-300 text-base mb-3 leading-relaxed">
                            Gói hỗ trợ tập trung vào hạ tầng, công nghệ và phát
                            triển bền vững, kỳ vọng thúc đẩy tăng trưởng GDP
                            2025.
                          </p>
                          <div className="flex items-center gap-4 text-base text-gray-400">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-gray-400" />
                              <span>6h</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5 text-gray-400" />
                              <span>9.8K</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-800/60 rounded-lg border border-gray-600/40 hover:border-gray-500/60 cursor-pointer transition-all duration-300 hover:shadow-lg hover:bg-gray-800/80 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-400/8 via-transparent to-orange-400/4 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute bottom-0 left-0 w-18 h-18 bg-gradient-to-tr from-orange-400/6 to-transparent rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="flex items-start gap-3 relative z-10">
                        <div
                          className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0 animate-pulse"
                          style={{ animationDelay: "2.5s" }}
                        ></div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-2 text-white leading-tight text-base hover:text-gray-100 transition-colors">
                            Bitcoin tăng vượt $45,000, dòng tiền crypto ảnh
                            hưởng CK công nghệ
                          </h4>
                          <p className="text-gray-300 text-base mb-3 leading-relaxed">
                            FPT, CMG, VNG dự kiến hưởng lợi từ xu hướng phục hồi
                            của thị trường cryptocurrency.
                          </p>
                          <div className="flex items-center gap-4 text-base text-gray-400">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-gray-400" />
                              <span>7h</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5 text-gray-400" />
                              <span>7.2K</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Market Insights Section */}
              <Card className="border border-gray-600/30 bg-gray-900/80 backdrop-blur-md shadow-xl relative overflow-hidden">
                {/* Card decorative pattern */}
                <div className="absolute inset-0 pattern-clouds opacity-90 pointer-events-none"></div>
                <div className="absolute top-4 right-4 w-36 h-36 bg-gradient-to-br from-blue-400/15 to-purple-400/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-4 left-4 w-28 h-28 bg-gradient-to-tr from-emerald-400/12 to-transparent rounded-full blur-xl"></div>
                <CardContent className="p-4 relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1.5 h-10 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
                    <h3 className="font-bold text-2xl text-white">
                      Market Insights
                    </h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed mb-3 text-base">
                    Thị trường chứng khoán Việt Nam đang cho thấy những dấu hiệu
                    tích cực với sự phục hồi mạnh mẽ của các nhóm cổ phiếu lớn.
                    Thanh khoản gia tăng và dòng tiền từ khối ngoại tiếp tục đổ
                    vào thị trường tạo động lực tích cực cho xu hướng tăng trong
                    các phiên giao dịch tới.
                  </p>
                  <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                    <p className="text-blue-200 text-sm">
                      <ChartColumnBig className="inline-block w-5 h-5 mb-1 mr-2 text-white" />
                      <strong className="text-white text-base mr-2 mb-1">
                        Điểm nhấn:
                      </strong>
                      VN-Index có thể thử thách vùng kháng cự 1,300 điểm trong
                      tuần tới nếu duy trì được momentum hiện tại.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - NewsSidebar - 1 column */}
            <div className="lg:col-span-1">
              <NewsSidebar onViewDetails={handleViewDetails} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
