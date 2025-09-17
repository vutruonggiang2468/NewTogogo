// import { NextResponse } from "next/server";

// const BE =
//   process.env.BACKEND_API_BASE_URL ||
//   process.env.NEXT_PUBLIC_API_BASE_URL ||
//   process.env.NEXT_PUBLIC_API_ORIGIN ||
//   "http://127.0.0.1:8000";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json().catch(() => ({}));

//     const res = await fetch(`${BE}/api/auth/google/callback`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//       },
//       body: JSON.stringify(body),
//       cache: "no-store",
//       redirect: "manual",
//     });

//     // Trả JSON y như BE trả
//     const data = await res.json().catch(() => ({}));
//     const response = NextResponse.json(data, { status: res.status });

//     // Forward toàn bộ Set-Cookie (nếu BE có set)
//     const setCookieHeader = res.headers.get("set-cookie");
//     if (setCookieHeader) {
//       // nếu BE gộp nhiều cookie vào 1 header vẫn được append thẳng
//       response.headers.append("set-cookie", setCookieHeader);
//     }
//     // Nếu BE dùng nhiều Set-Cookie riêng lẻ (ít gặp), bạn có thể dùng:
//     // const getSetCookie = (res.headers as any).getSetCookie?.() as string[] | undefined;
//     // getSetCookie?.forEach((c) => response.headers.append("set-cookie", c));

//     return response;
//   } catch (err) {
//     return NextResponse.json(
//       { error: "proxy_error", detail: String(err) },
//       { status: 502 }
//     );
//   }
// }
import { NextResponse } from "next/server";

const BE =
  process.env.BACKEND_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://127.0.0.1:8000";

const REDIRECT_URI = "http://localhost:3000/api/auth/google/callback";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state") ?? undefined;

  if (!code) {
    return NextResponse.redirect(new URL("/auth/error?reason=missing_code", url));
  }

  // Gửi code sang BE để đổi token / set session cookie
  const res = await fetch(`${BE}/api/auth/google/callback`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ code, state, redirect_uri: REDIRECT_URI }),
    redirect: "manual",
  });

  if (!res.ok) {
    const raw = await res.text().catch(() => "");
    return NextResponse.redirect(
      new URL(`/auth/error?reason=exchange_failed&status=${res.status}&msg=${encodeURIComponent(raw.slice(0,300))}`, url)
    );
  }

  // Copy Set-Cookie từ BE (nếu BE set session)
  const setCookie = res.headers.get("set-cookie");
  const rsp = NextResponse.redirect(new URL("/", url), 302);
  if (setCookie) rsp.headers.append("set-cookie", setCookie);

  return rsp;
}
