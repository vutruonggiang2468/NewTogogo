"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function GoogleCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    if (!code) return;

    (async () => {
      try {
        const { data } = await axios.post(
          "/api/auth/google/callback",
          { code, state },
          { withCredentials: true }
        );

        const access_token =
          data?.access_token ||
          data?.access_token ||
          data?.id_token ||
          data?.data?.access_token ||
          data?.data?.access_token;

        if (access_token) {
          localStorage.setItem("token", access_token);
          try {
            axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
          } catch {}
        }

        router.push("/");
      } catch (error) {
        console.error("Đăng nhập Google thất bại:", error);
        router.push("/login");
      }
    })();
  }, [searchParams, router]);

  return <p>Đang xử lý đăng nhập Google...</p>;
}
