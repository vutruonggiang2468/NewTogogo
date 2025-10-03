import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faPhone, faHouse, faGlobe } from "@fortawesome/free-solid-svg-icons";
import { Badge } from "@/components/ui/badge";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-slate-900/60 to-slate-900/90 border-t border-blue-400/20 backdrop-blur-sm mt-24">
      <div className="container mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">StockVN Pro</h3>
                <Badge
                  variant="outline"
                  className="text-cyan-400 border-cyan-400/50 bg-cyan-400/10 text-xs"
                >
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse mr-1"></div>
                  Premium
                </Badge>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Nền tảng phân tích chứng khoán hàng đầu Việt Nam với công nghệ AI
              tiên tiến, cung cấp insights chuyên sâu cho nhà đầu tư thông minh.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-gray-400 hover:text-cyan-400 transition-colors"
              >
                <FontAwesomeIcon icon={faFacebook} className="fa-lg" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-cyan-400 transition-colors"
              >
                <FontAwesomeIcon icon={faTwitter} className="fa-lg" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-cyan-400 transition-colors"
              >
                <FontAwesomeIcon icon={faInstagram} className="fa-lg" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-cyan-400 transition-colors"
              >
                <FontAwesomeIcon icon={faYoutube} className="fa-lg" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-4 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
              <h4 className="text-white font-semibold">Liên kết nhanh</h4>
            </div>
            <ul className="space-y-4">
              <li>
                <Link
                  href="#quick-analysis"
                  className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 text-base"
                >
                  Phân tích nhanh
                </Link>
              </li>
              <li>
                <Link
                  href={"/viewdetails"}
                  className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 text-base"
                >
                  Phân tích chuyên sâu
                </Link>
              </li>
              <li>
                <Link
                  href="#trading-bot"
                  className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 text-base"
                >
                  Trading Bot
                </Link>
              </li>
              <li>
                <Link
                  href="#economic-calendar"
                  className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 text-base"
                >
                  Lịch kinh tế
                </Link>
              </li>
              <li>
                <Link
                  href={"#news"}
                  className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 text-base"
                >
                  Tin tức
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-4 bg-gradient-to-b from-teal-400 to-cyan-500 rounded-full"></div>
              <h4 className="text-white font-semibold">Hỗ trợ</h4>
            </div>
            <ul className="space-y-4">
              <li>
                <Link href={"/"}>
                  <span className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 text-base">
                    Hướng dẫn sử dụng
                  </span>
                </Link>
              </li>
              <li>
                <Link href={"/"}>
                  <span className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 text-base">
                    Câu hỏi thường gặp
                  </span>
                </Link>
              </li>
              <li>
                <Link href={"/"}>
                  <span className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 text-base">
                    Phản hồi & đóng góp
                  </span>
                </Link>
              </li>
              <li>
                <Link href={"/"}>
                  <span className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 text-base">
                    Báo cáo lỗi
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-4 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
              <h4 className="text-white font-semibold">Liên hệ</h4>
            </div>
            <ul className="space-y-4" id="contact-info">
              <li>
                <Link
                  href="https://togogo.vn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#a8b9cd] text-base hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  <FontAwesomeIcon icon={faGlobe} className="mr-2" />{" "}
                  https://togogo.vn
                </Link>
              </li>
              <li>
                <span className="text-[#a8b9cd] text-base hover:text-cyan-400 transition-colors cursor-pointer">
                  <FontAwesomeIcon icon={faPhone} className="mr-2" /> (+84)
                  853.336.668
                </span>
              </li>
              <li>
                <span className="text-[#a8b9cd] text-base hover:text-cyan-400 transition-colors cursor-pointer">
                  <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                  hungle@hagency.vn
                </span>
              </li>
              <li>
                <span className="text-[#a8b9cd] text-base hover:text-cyan-400 transition-colors cursor-pointer">
                  <FontAwesomeIcon icon={faHouse} className="mr-2" /> CT1AB khu
                  đô thị VOV, Nam Từ Liêm, Từ Liêm
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="pt-4 pb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <p className="text-[#a8b9cd] text-base mb-4 md:mb-0 text-center md:text-left">
              &copy; {new Date().getFullYear()} TOGOGO. All rights reserved.
            </p>
          </div>
        </div>

        {/* Google Maps */}
        <div className="w-full h-72">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.899255391922!2d105.78257067608789!3d20.996675130644643!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135acb49b94ab1b%3A0x58570ca03e970d9a!2zQ2h1bmcgY8awIFZPViBN4buFIFRyw6w!5e0!3m2!1sen!2s!4v1739454201386!5m2!1sen!2s"
            className="w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps"
          ></iframe>
        </div>
      </div>
    </footer>
  );
}
