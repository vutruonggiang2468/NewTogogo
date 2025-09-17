import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Building,
  ChartColumnBig,
  ChartLine,
  Clock,
  Eye,
  Flame,
  Scale,
} from "lucide-react";

interface NewsColumnsProps {
  onViewNews: (articleId: number) => void;
}

const newsCategories = [
  {
    title: "Thị trường",
    icon: <ChartColumnBig className="w-6 h-6" />,
    color: "text-blue-600",
    articles: [
      {
        id: 5,
        title: "Cổ phiếu ACB tăng trần trong phiên sáng",
        time: "1 giờ trước",
        views: "3.2K",
      },
      {
        id: 6,
        title: "Khối lượng giao dịch HSX đạt kỷ lục mới",
        time: "2 giờ trước",
        views: "2.8K",
      },
      {
        id: 7,
        title: "Dòng tiền ngoại đổ mạnh vào công nghệ",
        time: "3 giờ trước",
        views: "1.9K",
      },
      {
        id: 8,
        title: "VN30 dẫn dắt thị trường tăng điểm",
        time: "4 giờ trước",
        views: "1.5K",
      },
    ],
  },
  {
    title: "Doanh nghiệp",
    icon: <Building className="w-6 h-6" />,
    color: "text-green-600",
    articles: [
      {
        id: 9,
        title: "FPT ký hợp đồng 500 triệu USD với đối tác Mỹ",
        time: "30 phút trước",
        views: "4.1K",
      },
      {
        id: 10,
        title: "Viettel Post IPO thu về 2,000 tỷ đồng",
        time: "1 giờ trước",
        views: "3.5K",
      },
      {
        id: 11,
        title: "Masan mua lại 25% cổ phần Techcombank",
        time: "2 giờ trước",
        views: "2.7K",
      },
      {
        id: 12,
        title: "Vingroup khởi động dự án smart city 5 tỷ USD",
        time: "3 giờ trước",
        views: "2.1K",
      },
    ],
  },
  {
    title: "Chính sách",
    icon: <Scale className="w-6 h-6" />,
    color: "text-purple-600",
    articles: [
      {
        id: 13,
        title: "Nghị định mới về thuế chứng khoán có hiệu lực",
        time: "1 giờ trước",
        views: "5.8K",
      },
      {
        id: 14,
        title: "SBV tăng room tín dụng lên 14% cho 2025",
        time: "2 giờ trước",
        views: "4.2K",
      },
      {
        id: 15,
        title: "Giảm thuế VAT xuống 8% từ quý 2",
        time: "4 giờ trước",
        views: "3.1K",
      },
      {
        id: 16,
        title: "Chính sách hỗ trợ startup công nghệ mới",
        time: "5 giờ trước",
        views: "2.3K",
      },
    ],
  },
];

export function NewsColumns({ onViewNews }: NewsColumnsProps) {
  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {newsCategories.map((category, idx) => (
          <Card
            key={idx}
            className="hover:shadow-lg transition-all bg-gradient-to-br from-slate-800/40 to-slate-700/40 border border-blue-400/20 hover:border-blue-400/40"
          >
            <CardHeader className="pb-4">
              <CardTitle
                className={`flex items-center gap-2 text-lg ${
                  idx === 0
                    ? "text-blue-400"
                    : idx === 1
                    ? "text-emerald-400"
                    : "text-purple-400"
                }`}
              >
                <span className="text-xl">{category.icon}</span>
                <span className="font-semibold text-lg">{category.title}</span>
                <Badge
                  variant="outline"
                  className={`ml-auto text-xs ${
                    idx === 0
                      ? "text-blue-300 border-blue-400/50 bg-blue-500/20"
                      : idx === 1
                      ? "text-emerald-300 border-emerald-400/50 bg-emerald-500/20"
                      : "text-purple-300 border-purple-400/50 bg-purple-500/20"
                  }`}
                >
                  {category.articles.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {category.articles.map((article, index) => (
                  <div
                    key={article.id}
                    className={`${
                      index !== category.articles.length - 1
                        ? "border-b border-blue-400/20 pb-4"
                        : ""
                    } cursor-pointer group`}
                    onClick={() => onViewNews(article.id)}
                  >
                    <h4 className="font-medium hover:text-cyan-400 transition-colors mb-2 line-clamp-2 leading-snug group-hover:text-cyan-400 text-white">
                      {article.title}
                    </h4>
                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-cyan-400" />
                        <span>{article.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4 text-blue-400" />
                        <span>{article.views}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* View More Link */}
                <div className="pt-3 border-t border-blue-400/20">
                  <button
                    className={`text-base hover:underline font-medium ${
                      idx === 0
                        ? "text-blue-400 hover:text-blue-300"
                        : idx === 1
                        ? "text-emerald-400 hover:text-emerald-300"
                        : "text-purple-400 hover:text-purple-300"
                    }`}
                  >
                    Xem thêm {category.title.toLowerCase()} →
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional News Sections */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hot Topics */}
        <Card className="bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-400/30 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-400">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-lg font-semibold">Chủ đề nóng</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-700/40 to-slate-600/40 rounded-lg border border-red-400/20">
                <span className="text-base font-medium text-white">
                  AI Trading Bot
                </span>
                <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs">
                  Hot
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-700/40 to-slate-600/40 rounded-lg border border-orange-400/20">
                <span className="text-base font-medium text-white">
                  Crypto Regulation
                </span>
                <Badge className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs">
                  Trending
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-700/40 to-slate-600/40 rounded-lg border border-emerald-400/20">
                <span className="text-base font-medium text-white">
                  Green Energy Stocks
                </span>
                <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs">
                  Rising
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/30 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-400">
              <ChartLine className="w-5 h-5" />{" "}
              <span className="text-lg font-semibold">Thống kê nhanh</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-base text-slate-400">
                  Tin đã đăng hôm nay
                </span>
                <span className="text-lg font-bold text-blue-400">247</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-base text-slate-400">
                  Lượt xem trung bình
                </span>
                <span className="text-lg font-bold text-emerald-400">3.2K</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-base text-slate-400">Tin nóng nhất</span>
                <span className="text-lg font-bold text-red-400">45.8K</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
