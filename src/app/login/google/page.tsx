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
    if (!code) { router.replace("/login"); return; }

    (async () => {
      const { data } = await axios.post(
        "/api/auth/google/callback",
        { code, state },
        { withCredentials: true }
      );

      const access =
        data?.access_token || 
        data?.token || 
        data?.id_token || 
        data?.data?.access_token;
      const refresh = data?.refresh_token || data?.data?.refresh_token;

      if (!access) throw new Error("Không nhận được access_token");

      localStorage.setItem("access_token", access);
      if (refresh) localStorage.setItem("refresh_token", refresh);
      axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;

      router.replace("/app");
    })().catch(() => router.replace("/login?error=oauth_failed"));
  }, [q, router]);

  return <p>Đang xử lý đăng nhập Google...</p>;
}
