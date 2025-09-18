// "use client";
// import { useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import axios from "axios";

// export default function GoogleCallback() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   useEffect(() => {
//     const code = searchParams.get("code");
//     const state = searchParams.get("state");
//     if (!code) return;

//     (async () => {
//       try {
//         const { data } = await axios.post(
//           "/api/auth/google/callback",
//           { code, state },
//           { withCredentials: true }
//         );

//         const access_token =
//           data?.access_token ||
//           data?.access_token ||
//           data?.id_token ||
//           data?.data?.access_token ||
//           data?.data?.access_token;

//         if (access_token) {
//           localStorage.setItem("token", access_token);
//           try {
//             axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
//           } catch {}
//         }

//         router.push("/");
//       } catch (error) {
//         console.error("Đăng nhập Google thất bại:", error);
//         router.push("/login");
//       }
//     })();
//   }, [searchParams, router]);

//   return <p>Đang xử lý đăng nhập Google...</p>;
// }
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function GoogleCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // ✅ Lấy "code" và "state" từ URL Google redirect về
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    console.log("code, state:", code, state);
    if (!code) return;

    (async () => {
      try {
        // ✅ Gọi BE để đổi "code" lấy token
        const { data } = await axios.post(
          "/api/auth/google/login",
          { code },
          { withCredentials: true } // giữ cookie nếu BE set
        );

        // ✅ Lấy access_token (BE có thể trả theo nhiều key khác nhau)
        const access_token =
          data?.access_token ||
          data?.id_token || // nhiều BE trả id_token thay cho access_token
          data?.token ||
          data?.data?.access_token;

        if (access_token) {
          // 1️⃣ Lưu token vào localStorage
          localStorage.setItem("token", access_token);


          

          // 2️⃣ Set token cho axios để dùng cho các request tiếp theo
          axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
        }

        // 3️⃣ Redirect về trang chủ
        router.push("/");
      } catch (error) {
        console.error("❌ Đăng nhập Google thất bại:", error);

        // Nếu lỗi thì quay lại trang login
        router.push("/login");
      }
    })();
  }, [searchParams, router]);

  return <p>🔄 Đang xử lý đăng nhập Google...</p>;
}
