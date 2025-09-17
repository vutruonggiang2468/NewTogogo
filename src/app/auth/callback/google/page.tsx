"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const sp = useSearchParams();

  useEffect(() => {
    const code = sp.get("code");
    const state = sp.get("state");

    if (!code) {
      router.replace("/auth/error?reason=no_code");
      return;
    }

    (async () => {
      const res = await fetch("/api/auth/google/callback", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          state,
          redirect_uri: "http://localhost:3000/auth/callback/google",
        }),
      });

      if (!res.ok) {
        router.replace("/auth/error?reason=exchange_failed");
        return;
      }

      // Nếu BE trả access_token trong body:
      const data = await res.json().catch(() => ({}));
      if (data?.access_token) localStorage.setItem("access_token", data.access_token);
      if (data?.refresh_token) localStorage.setItem("refresh_token", data.refresh_token);

      router.replace("/"); // trang chính sau login
    })().catch(() => router.replace("/auth/error?reason=network"));
  }, [router, sp]);

  return <div className="p-6">Đang xác thực…</div>;
}
