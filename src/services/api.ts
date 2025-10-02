import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_ORIGIN}/api`;
// const API_URL = "https://payment.operis.vn/api";

console.log("API_URLLLLL", API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Lấy danh sách symbols
export const getSymbolData = async (symbol: string) => {
  try {
    console.log("symbol", symbol);
    const response = await api.get(`/stocks/symbols?limit=10`);

    if (!response?.data || response.data.length === 0) {
      return { message: "Đang cập nhật dữ liệu…" };
    }

    return response.data;
  } catch (error) {
    console.error("getSymbolData error:", error);
    return { message: "Đang cập nhật dữ liệu…" };
  }
};

// Lấy dữ liệu theo tên mã
export const getNameData = async (code: string) => {
  try {
    const response = await api.get(`/stocks/symbols/by-name/${code}`);

    if (!response?.data) {
      return { message: "Đang cập nhật dữ liệu…" };
    }

    return response.data;
  } catch (error) {
    console.error("getNameData error:", error);
    return { message: "Đang cập nhật dữ liệu…" };
  }
};
// export const getSymbolId = async (symbolId : string) => {
//   try {
//     const response = await api.get(`/stocks/symbols/${symbolId}`);

//     if (!response?.data) {
//       return { message: "Đang cập nhật dữ liệu…" };
//     }

//     return response.data;
//   } catch (error) {
//     console.error("getSymbolId error:", error);
//     return { message: "Đang cập nhật dữ liệu…" };
//   }
// };
// export const getSymbolByName = async (name: string) => {
//   try {
//     const response = await api.get(`/stocks/symbols/by-name/${name}`);
//   } catch (error) {
//     console.error("getSymbolByName error:", error);
//     return { message: "Đang cập nhật dữ liệu…" };
//   }
// Lấy chi tiết công ty
export const getCompanyDetails = async (symbolId: number) => {
  console.log("📞 getCompanyDetails called with symbolId:", symbolId);
  const endpoints = [
    { key: "symbolData", url: `/stocks/symbols/${symbolId}` },
    { key: "balanceData", url: `/calculate/balances/${symbolId}` },
    { key: "incomeData", url: `/calculate/incomes/${symbolId}` },
    { key: "cashflowData", url: `/calculate/cashflows/${symbolId}` },
    { key: "ratiosData", url: `/calculate/ratios/${symbolId}` },
  ];

  console.log("🌐 API endpoints:", endpoints.map(e => e.url));

  const results = await Promise.allSettled(
    endpoints.map((ep) => api.get(ep.url))
  );

  const data: Record<string, any> = {};

  results.forEach((res, i) => {
    if (res.status === "fulfilled" && res.value?.data) {
      data[endpoints[i].key] = res.value.data;
      console.log(`✅ ${endpoints[i].key}:`, Array.isArray(res.value.data) ? `${res.value.data.length} items` : 'object');
    } else {
      const error = res.status === "rejected" ? res.reason : "Unknown error";
      console.error(`❌ Failed to fetch ${endpoints[i].key}:`, {
        url: endpoints[i].url,
        error: error?.response?.status,
        message: error?.message,
        data: error?.response?.data
      });
      data[endpoints[i].key] = { message: "Đang cập nhật dữ liệu…" };
    }
  });

  console.log("📦 Final data:", data);
  return data;
};
