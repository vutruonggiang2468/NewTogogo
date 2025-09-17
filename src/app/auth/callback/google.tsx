import { useRouter } from "next/router";
import { useEffect } from "react";

export default function GoogleCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      const code = router.query.code as string | undefined;
      if (!code) return; // đợi router có query

      try {
        const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
        const res = await fetch(`${apiBase}/api/auth/google/exchange?code=${encodeURIComponent(code)}`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          router.replace("/auth/error?reason=exchange_failed");
          return;
        }

        const data = await res.json();
        if (data?.access_token) localStorage.setItem("access_token", data.access_token);
        if (data?.refresh_token) localStorage.setItem("refresh_token", data.refresh_token);

        router.replace("/");
      } catch (e) {
        router.replace("/auth/error?reason=network");
      }
    };
    run();
  }, [router.query]);

  return <div style={{ padding: 24 }}>Đang xác thực…</div>;
}
