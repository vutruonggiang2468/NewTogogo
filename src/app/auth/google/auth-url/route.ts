// import { NextResponse } from "next/server";

// const BE =
//   process.env.BACKEND_API_BASE_URL ||
//   process.env.NEXT_PUBLIC_API_BASE_URL ||
//   process.env.NEXT_PUBLIC_API_ORIGIN ||
//   "http://127.0.0.1:8000";

// export async function GET(req: Request) {
//   try {
//     const url = new URL(req.url);
//     const shouldRedirect = url.searchParams.get("redirect") === "1";

//     // Gọi BE xin URL, KHÔNG forward cookie, và KHÔNG auto-follow redirect
//     const be = await fetch(`${BE}/api/auth/google/auth-url`, {
//       method: "GET",
//       redirect: "manual",
//       cache: "no-store",
//       headers: { Accept: "application/json" },
//     });

//     // TRƯỜNG HỢP 1: BE trả 302 Location -> chuyển thẳng user tới Google
//     const loc = be.headers.get("location");
//     if (loc) {
//       // nếu bạn muốn luôn redirect thì có thể bỏ shouldRedirect check
//       if (shouldRedirect) return NextResponse.redirect(loc, { status: 302 });
//       return NextResponse.json({ auth_url: loc, via: "location" });
//     }

//     // TRƯỜNG HỢP 2: BE trả JSON { auth_url: "..." }
//     const data = await be.json().catch(() => ({} as any));
//     const authUrl =
//       data?.auth_url || data?.authUrl || data?.url || data?.data?.auth_url || data?.data?.authUrl;

//     if (authUrl && shouldRedirect) return NextResponse.redirect(authUrl, { status: 302 });
//     if (authUrl) return NextResponse.json({ auth_url: authUrl, via: "json" });

//     // Không lấy được URL
//     return NextResponse.json({ error: "cannot_get_auth_url" }, { status: be.status || 500 });
//   } catch (err) {
//     return NextResponse.json({ error: "proxy_error", detail: String(err) }, { status: 502 });
//   }
// }
import { NextResponse } from "next/server";

const redirectUri = "http://localhost:3000/api/auth/google/callback";

export async function GET() {
  const url =
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "consent",
    });

  // Có thể trả JSON {url} để FE window.location.href = url
  // hoặc redirect thẳng:
  return NextResponse.redirect(url);
}
