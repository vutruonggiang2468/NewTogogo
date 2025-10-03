"use client";

import React, { useEffect, useState } from "react";

const ScrollToTopButton: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setMounted(true); // Đánh dấu đã mount client
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const percent = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
      setVisible(scrollTop > 100);
      setProgress(percent);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Tránh render khác biệt server/client
  if (!mounted) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-[#64FFDA] to-[#00E5A1] shadow-lg flex items-center justify-center transition-opacity duration-300 cursor-pointer group ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      aria-label="Scroll to top"
      style={{ outline: "none" }}
    >
      {/* Progress Circle */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 64 64">
        <circle
          cx="32"
          cy="32"
          r="28"
          fill="none"
          stroke="#0A1529"
          strokeWidth="6"
          opacity="0.15"
        />
        <circle
          cx="32"
          cy="32"
          r="28"
          fill="none"
          stroke="#fff"
          strokeWidth="6"
          strokeDasharray={2 * Math.PI * 28}
          strokeDashoffset={2 * Math.PI * 28 * (1 - progress)}
          style={{ transition: "stroke-dashoffset 0.3s" }}
        />
      </svg>
      <span className="relative z-10 text-2xl text-[#0A1529] group-hover:scale-110 transition-transform select-none">
        ▲
      </span>
    </button>
  );
};

export default ScrollToTopButton;
