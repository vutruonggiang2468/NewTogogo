"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function GoogleCallback() {
  const router = useRouter();
  const q = useSearchParams();

  useEffect(() => {
    const code = q.get("code");
    const state = q.get("state");
    console.log("code, state:", code, state);

    if (!code) {
      router.replace("/login");
      return;
    }

    (async () => {
      try {
        // 🚀 Gọi BE để đổi code -> token
        const { data } = await axios.post(
          "https://payment.operis.vn/api/auth/google/login", // ⚠️ dùng endpoint callback thay vì login
          { code }, // state null thì không gửi
          { withCredentials: true }
        );

        const access =
          data?.access_token ||
          data?.token ||
          data?.id_token ||
          data?.data?.access_token;

        const refresh =
          data?.refresh_token || data?.data?.refresh_token;

        if (!access) throw new Error("Không nhận được access_token");
        const user = await axios.get("https://payment.operis.vn/api/auth/profile", {
          headers: { Authorization: `Bearer ${access}` },
        });
        console.log("✅ User info:", user.data);
        // ✅ Lưu token
        localStorage.setItem("access_token", access);
        if (refresh) localStorage.setItem("refresh_token", refresh);

        axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;

        // 🔁 Redirect về trang chủ
        router.replace("/");
      } catch (err) {
        console.error("❌ Lỗi đăng nhập Google:", err);
        router.replace("/login");
      }
    })();
  }, [q, router]);

  return <p>🔄 Đang xử lý đăng nhập Google...</p>;
}
