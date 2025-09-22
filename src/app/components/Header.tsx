"use client";

import { useState, useEffect } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Calendar,
  TrendingUp,
  Search,
  Bell,
  User,
  Menu,
  X,
  Globe,
  BarChart3,
  Newspaper,
  Bot,
  Settings,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";

type UserProfile = {
  email?: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  displayName?: string;
  [key: string]: unknown;
};

const PROFILE_ENDPOINT = "https://payment.operis.vn/api/auth/profile";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const resolveDisplayName = (profile?: UserProfile | null) => {
  if (!profile) return "";
  const fromDisplayName =
    typeof profile.displayName === "string" ? profile.displayName.trim() : "";
  if (fromDisplayName) return fromDisplayName;

  const fromName =
    typeof profile.name === "string" ? profile.name.trim() : "";
  if (fromName) return fromName;

  const first =
    typeof profile.first_name === "string" ? profile.first_name.trim() : "";
  const last =
    typeof profile.last_name === "string" ? profile.last_name.trim() : "";
  const full = [first, last].filter(Boolean).join(" ").trim();
  if (full) return full;

  const username =
    typeof profile.username === "string" ? profile.username.trim() : "";
  if (username) return username;

  const email =
    typeof profile.email === "string" ? profile.email.trim() : "";
  if (email) return email;

  return "";
};

const safeParseUser = (raw: string | null): UserProfile | null => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    return isRecord(parsed) ? (parsed as UserProfile) : null;
  } catch (error) {
    console.warn("Failed to parse cached user:", error);
    return null;
  }
};

const extractProfileRecord = (value: unknown): Record<string, unknown> | null => {
  const visited = new Set<unknown>();
  let current: unknown = value;

  while (isRecord(current) && !visited.has(current)) {
    visited.add(current);
    const record = current as Record<string, unknown>;

    const hasIdentity =
      typeof record["email"] === "string" ||
      typeof record["name"] === "string" ||
      typeof record["username"] === "string" ||
      typeof record["first_name"] === "string" ||
      typeof record["last_name"] === "string";

    if (hasIdentity) {
      return record;
    }

    const nextKeys = ["user", "profile", "result", "data", "account"];
    let nextCandidate: unknown = null;
    for (const key of nextKeys) {
      if (key in record) {
        const candidate = record[key];
        if (candidate !== undefined && candidate !== null) {
          nextCandidate = candidate;
          break;
        }
      }
    }

    if (!isRecord(nextCandidate) || visited.has(nextCandidate)) {
      break;
    }

    current = nextCandidate;
  }

  return null;
};


export function Header() {

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [activeSearchFilter, setActiveSearchFilter] = useState("Tổng quan");
  const [searchQuery, setSearchQuery] = useState("");
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const userDisplayName = resolveDisplayName(user);
  const showAuthLinks = !userDisplayName && !isCheckingAuth;

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchProfile = async () => {
      setIsCheckingAuth(true);
      const cachedUser = safeParseUser(localStorage.getItem("user"));
      const token = (
        localStorage.getItem("token") ??
        localStorage.getItem("access_token") ??
        localStorage.getItem("accessToken")
      );

      if (!token) {
        localStorage.removeItem("user");
        if (isMounted) {
          setUser(null);
          setIsCheckingAuth(false);
        }
        return;
      }

      try {
        const response = await fetch(PROFILE_ENDPOINT, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          signal: controller.signal,
        });

        if (response.status === 401) {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          localStorage.removeItem("access_token");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refresh_token");
          if (isMounted) {
            setUser(null);
          }
          return;
        }

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = (await response.json()) as unknown;
        const profileRecord = extractProfileRecord(payload);

        if (!profileRecord) {
          throw new Error("Invalid profile payload");
        }

        const normalized: UserProfile = {
          ...(cachedUser ?? {}),
          ...profileRecord,
        };

        if (!normalized.email && cachedUser?.email) {
          normalized.email = cachedUser.email;
        }

        const displayName =
          resolveDisplayName(normalized) || resolveDisplayName(cachedUser);
        if (displayName) {
          normalized.displayName = displayName;
        }

        if (isMounted) {
          setUser(normalized);
          localStorage.setItem("user", JSON.stringify(normalized));
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        console.error("Failed to load profile:", error);
        if (isMounted) {
          setUser(cachedUser ?? null);
        }
      } finally {
        if (isMounted) {
          setIsCheckingAuth(false);
        }
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);
  // Handle scroll to show/hide header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        // Always show header when near top
        setIsHeaderVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Hide header when scrolling down (after 100px)
        setIsHeaderVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Show header when scrolling up
        setIsHeaderVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navigationItems = [
    {
      label: "TRANG CHỦ",
      href: "#",
      isActive: true,
      icon: <Globe className="w-4 h-4" />,
    },
    {
      label: "THỊ TRƯỜNG",
      href: "#",
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      label: "DOANH NGHIỆP",
      href: "#",
      icon: <Newspaper className="w-4 h-4" />,
    },
    {
      label: "KINH TẾ",
      href: "#",
      icon: <TrendingUp className="w-4 h-4" />,
    },
    {
      label: "CHÍNH SÁCH",
      href: "#",
      icon: <Settings className="w-4 h-4" />,
    },
    {
      label: "PHÂN TÍCH",
      href: "#",
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      label: "AI TRADING",
      href: "#",
      icon: <Bot className="w-4 h-4" />,
    },
  ];

  const searchFilters = [
    {
      label: "Tổng quan",
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      label: "Kỹ thuật",
      icon: <TrendingUp className="w-4 h-4" />,
    },
    {
      label: "Tin tức",
      icon: <Newspaper className="w-4 h-4" />,
    },
  ];

  const breakingNews = [
    "🔥 VN-Index vượt mốc 1,280 điểm trong phiên chiều",
    "📈 Khối ngoại mua ròng 500 tỷ đồng",
    "💰 Cổ phiếu ngân hàng tăng mạnh",
    "⚡ HPG công bố kết quả kinh doanh vượt kỳ vọng",
    "🏆 TCB đạt ROE cao nhất ngành ngân hàng",
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setUser(null);
    setIsProfileMenuOpen(false);
    setIsCheckingAuth(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery, "in", activeSearchFilter);
    // Handle search logic here
  };
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();

      // Map thứ
      const weekdays = [
        "Chủ nhật",
        "Thứ 2",
        "Thứ 3",
        "Thứ 4",
        "Thứ 5",
        "Thứ 6",
        "Thứ 7",
      ];

      const dayName = weekdays[now.getDay()];
      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const year = now.getFullYear();

      setDateStr(`${dayName}, ${day}/${month}/${year}`);
    };

    updateDate(); // chạy lần đầu
    const timer = setInterval(updateDate, 60 * 1000); // cập nhật mỗi phút
    return () => clearInterval(timer);
  }, []);

  return (
    <header
      className={`bg-gray-900/95 border-b border-gray-600/30 fixed top-0 left-0 right-0 z-50 shadow-xl backdrop-blur-md transition-transform duration-300 ease-in-out ${isHeaderVisible ? "translate-y-0" : "-translate-y-full"
        }`}
    >
      {/* Breaking News Ticker - Enhanced */}
      <div className="bg-blue-600 text-white py-2 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/10 animate-pulse"></div>
        <div className="container mx-auto px-4 relative">
          <div className="flex items-center gap-4">
            <Badge className="bg-white text-blue-600 px-3 py-1 font-medium flex-shrink-0 shadow-md">
              <span className="animate-pulse">●</span>
              <span className="ml-1">HOT NEWS</span>
            </Badge>
            <div className="flex-1 overflow-hidden">
              <div className="flex animate-marquee">
                {breakingNews.map((news, index) => (
                  <span
                    key={index}
                    className="mr-12 whitespace-nowrap cursor-pointer hover:text-cyan-200 transition-colors"
                  >
                    {news}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Top bar - Enhanced */}
        <div className="flex items-center justify-between py-4 border-b border-gray-600/30">
          {/* Logo and Brand - Enhanced */}
          <Link
            href={"/"}
            className="flex items-center space-x-4 cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">24H</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-gray-900 animate-pulse"></div>
              </div>
              <div>
                <div className="text-xl font-bold text-white">
                  TOGOGO ANALYTICS
                </div>
                <div className="text-xs text-gray-400 flex items-center gap-2">
                  <span>Tin tức & Phân tích tài chính</span>
                  <Badge
                    variant="outline"
                    className="text-xs px-1 py-0 text-emerald-400 border-emerald-400/50 bg-emerald-400/10"
                  >
                    Live
                  </Badge>
                </div>
              </div>
            </div>
          </Link>

          {/* Right side - Enhanced */}
          <div className="flex items-center space-x-4">
            {/* Market Summary - Enhanced */}
            <div className="hidden lg:flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2 px-3 py-2 bg-gray-800/60 rounded-lg border border-gray-600/40">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">{dateStr}</span>
              </div>
              <div className="text-gray-600">|</div>
              <div className="flex items-center space-x-2 px-3 py-2 bg-emerald-500/10 rounded-lg border border-emerald-400/30">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="text-emerald-300 font-medium">
                    VN-Index: 1,278.45
                  </span>
                  <span className="text-emerald-400 ml-2">(+0.97%)</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 px-3 py-2 bg-blue-500/10 rounded-lg border border-blue-400/30">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-blue-300">Phiên ATC</span>
              </div>
            </div>

            {/* Action buttons - Enhanced */}
            <div className="flex items-center space-x-2">


              {userDisplayName && !isCheckingAuth && (
                <span className="hidden md:block text-sm text-blue-300 font-medium">
                  {userDisplayName}
                </span>
              )}
              {showAuthLinks && (
                <div className="hidden md:flex items-center gap-2 text-sm text-blue-300 font-medium">
                  {/* <Link
                    href={"/login"}
                    className="hover:text-white transition-colors"
                  >
                    Đăng nhập
                  </Link>
                  <span className="text-slate-600">/</span>
                  <a
                    href="#"
                    className="hover:text-white transition-colors"
                  >
                    Đăng ký
                  </a> */}
                </div>
              )}

              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-gray-700/50 text-gray-300 hover:text-white"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                >
                  <User className="w-4 h-4" />
                </Button>

                {/* Profile Dropdown - Enhanced */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-gradient-to-br from-slate-800 to-slate-700 border border-blue-400/30 rounded-lg shadow-xl py-2 z-50 backdrop-blur-sm">
                    <div className="px-4 py-2 border-b border-blue-400/20">
                      <div className="text-sm font-medium text-white">
                        Tài khoản
                      </div>
                      <div className="text-xs text-slate-400">
                        {isCheckingAuth ? (
                          <span>Đang kiểm tra...</span>
                        ) : userDisplayName ? (
                          <span className="text-blue-300 font-medium">{userDisplayName}</span>
                        ) : (
                          <span>Khách</span>
                        )}
                      </div>
                    </div>
                    {showAuthLinks ? (
                      <>
                        <Link
                          href={"/login"}
                          className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-blue-500/20 hover:text-white transition-colors"
                        >
                          Đăng nhập
                        </Link>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-slate-300 hover:bg-blue-500/20 hover:text-white transition-colors"
                        >
                          Đăng ký
                        </a>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-blue-500/20 hover:text-white transition-colors"
                      >
                        Đăng xuất
                      </button>
                    )}
                    {/* <a
                      href="#"
                      className="block px-4 py-2 text-sm text-slate-300 hover:bg-blue-500/20 hover:text-white transition-colors"
                    >
                      Cài đặt
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-slate-300 hover:bg-blue-500/20 hover:text-white transition-colors"
                    >
                      Trợ giúp
                    </a> */}
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-gray-700/50 text-gray-300 hover:text-white"
              >
                <Bell className="w-4 h-4" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </div>
              </Button>
              {/* Mobile menu button - Enhanced */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden hover:bg-blue-500/20 text-slate-300 hover:text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Menu className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop Navigation - Enhanced Search Bar */}
        <div className="hidden md:block py-4">
          <div className="max-w-4xl mx-auto">
            {/* Search Bar with Filter Tabs - Enhanced */}
            <div className="bg-gradient-to-r from-slate-700/40 to-slate-600/40 rounded-2xl p-1 shadow-inner border border-blue-400/20 backdrop-blur-sm">
              <div className="flex items-center">
                {/* Filter Tabs - Enhanced */}
                <div className="flex bg-gradient-to-r from-slate-800/60 to-slate-700/60 rounded-xl shadow-sm mr-3 border border-blue-400/20">
                  {searchFilters.map((filter) => (
                    <button
                      key={filter.label}
                      onClick={() => setActiveSearchFilter(filter.label)}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all rounded-xl ${activeSearchFilter === filter.label
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-sm"
                        : "text-slate-300 hover:text-white hover:bg-blue-500/20"
                        }`}
                    >
                      {filter.icon}
                      <span>{filter.label}</span>
                    </button>
                  ))}
                </div>

                {/* Search Input - Enhanced */}
                <form onSubmit={handleSearch} className="flex-1 relative">
                  <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Tìm kiếm ${activeSearchFilter.toLowerCase()}... (VD: VSC, HPG, tin tức ngân hàng)`}
                    className="pl-12 pr-20 py-3 text-base bg-gradient-to-r from-slate-800/60 to-slate-700/60 border-0 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-0 transition-all text-white placeholder-slate-400"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="text-xs px-2 py-1 text-slate-400 bg-slate-600/50 border-slate-500"
                    >
                      ⌘K
                    </Badge>
                    <Button
                      type="submit"
                      size="sm"
                      className="px-3 py-1.5 text-xs bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                    >
                      Tìm
                    </Button>
                  </div>
                </form>
              </div>
            </div>

            {/* Search Suggestions - Enhanced */}
            {searchQuery && (
              <div className="mt-2 bg-gradient-to-br from-slate-800/90 to-slate-700/90 rounded-lg shadow-xl border border-blue-400/30 py-2 max-w-4xl mx-auto backdrop-blur-sm">
                <div className="px-4 py-2 text-xs text-slate-400 border-b border-blue-400/20">
                  Gợi ý tìm kiếm trong &quot;{activeSearchFilter}&quot;
                </div>
                <div className="space-y-1">
                  {activeSearchFilter === "Tổng quan" && (
                    <>
                      <div className="px-4 py-2 hover:bg-blue-500/20 cursor-pointer flex items-center gap-3 transition-colors">
                        <BarChart3 className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-slate-300">
                          VSC - Vietcombank
                        </span>
                        <span className="text-xs text-slate-500 ml-auto">
                          Cổ phiếu
                        </span>
                      </div>
                      <div className="px-4 py-2 hover:bg-blue-500/20 cursor-pointer flex items-center gap-3 transition-colors">
                        <BarChart3 className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm text-slate-300">
                          HPG - Hoa Phat Group
                        </span>
                        <span className="text-xs text-slate-500 ml-auto">
                          Cổ phiếu
                        </span>
                      </div>
                    </>
                  )}
                  {activeSearchFilter === "Kỹ thuật" && (
                    <>
                      <div className="px-4 py-2 hover:bg-blue-500/20 cursor-pointer flex items-center gap-3 transition-colors">
                        <TrendingUp className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-slate-300">
                          Phân tích kỹ thuật VN-Index
                        </span>
                        <span className="text-xs text-slate-500 ml-auto">
                          Báo cáo
                        </span>
                      </div>
                      <div className="px-4 py-2 hover:bg-blue-500/20 cursor-pointer flex items-center gap-3 transition-colors">
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm text-slate-300">
                          Đường MA và RSI
                        </span>
                        <span className="text-xs text-slate-500 ml-auto">
                          Chỉ báo
                        </span>
                      </div>
                    </>
                  )}
                  {activeSearchFilter === "Tin tức" && (
                    <>
                      <div className="px-4 py-2 hover:bg-blue-500/20 cursor-pointer flex items-center gap-3 transition-colors">
                        <Newspaper className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm text-slate-300">
                          Tin tức ngân hàng mới nhất
                        </span>
                        <span className="text-xs text-slate-500 ml-auto">
                          Bài viết
                        </span>
                      </div>
                      <div className="px-4 py-2 hover:bg-blue-500/20 cursor-pointer flex items-center gap-3 transition-colors">
                        <Newspaper className="w-4 h-4 text-teal-400" />
                        <span className="text-sm text-slate-300">
                          Chính sách mới từ SBV
                        </span>
                        <span className="text-xs text-slate-500 ml-auto">
                          Tin tức
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation - Enhanced */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-blue-400/20">
            {/* Mobile Search with Filters - Enhanced */}
            <div className="mb-4">
              {/* Mobile Filter Tabs - Enhanced */}
              <div className="flex mb-3 bg-gradient-to-r from-slate-700/50 to-slate-600/50 rounded-lg p-1 border border-blue-400/20">
                {searchFilters.map((filter) => (
                  <button
                    key={filter.label}
                    onClick={() => setActiveSearchFilter(filter.label)}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium transition-all rounded-md ${activeSearchFilter === filter.label
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-sm"
                      : "text-slate-300"
                      }`}
                  >
                    {filter.icon}
                    <span>{filter.label}</span>
                  </button>
                ))}
              </div>

              {/* Mobile Search Input - Enhanced */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Tìm ${activeSearchFilter.toLowerCase()}...`}
                  className="pl-10 pr-12 bg-gradient-to-r from-slate-700/50 to-slate-600/50 border-blue-400/20 text-white placeholder-slate-400"
                />
                <Button
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 text-xs bg-gradient-to-r from-blue-500 to-cyan-500"
                >
                  Tìm
                </Button>
              </div>
            </div>

            {/* Mobile Market Info - Enhanced */}
            <div className="mb-4 p-3 bg-gradient-to-r from-slate-700/50 to-slate-600/50 rounded-lg border border-blue-400/20">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-300">VN-Index: 1,278.45</span>
                </div>
                <span className="text-emerald-400 font-medium">+0.97%</span>
              </div>
            </div>

            {/* Mobile Menu Items - Enhanced */}
            <div className="space-y-2">
              {navigationItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${item.isActive
                    ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-cyan-300 font-medium border border-blue-400/30"
                    : "text-slate-300 hover:bg-blue-500/20 hover:text-white"
                    }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </a>
              ))}
            </div>

            {/* Mobile Actions - Enhanced */}
            <div className="mt-4 pt-4 border-t border-blue-400/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Calendar className="w-4 h-4" />
                  <span>Thứ 2, 25/08/2025</span>
                </div>
                <Badge
                  variant="outline"
                  className="text-cyan-400 border-cyan-400/50 bg-cyan-400/10"
                >
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse mr-1"></div>
                  Phiên ATC
                </Badge>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
