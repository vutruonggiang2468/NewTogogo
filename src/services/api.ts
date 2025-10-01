// import axios from "axios";
// const API_URL = `${process.env.NEXT_PUBLIC_API_ORIGIN}/api`;
// // const API_URL = "https://payment.operis.vn/api";
// console.log("API_URLLLLL", API_URL);
// const api = axios.create({
//   baseURL: API_URL,
//   timeout: 10000,
// });

// export const getSymbolData = async (symbol: string) => {
//   console.log("symbol", symbol);
//   const response = await api.get(`/stocks/symbols?limit=8`);

//   if (!response) {
//     throw new Error("Failed to fetch stock data");
//   }
//   return response.data;
// };
// export const getNameData = async (code: string) => {
//   const response = await api.get(`/stocks/symbols/by-name/${code}`);

//   if (!response) {
//     throw new Error("Failed to fetch stock data");
//   }
//   return response.data;
// };
// export const getCompanyDetails = async (symbolId: string) => {
//   console.log("aaa", symbolId);
//   const endpoints = [
//     { key: "symbolData", url: `/stocks/symbols/${symbolId}` },
//     { key: "balanceData", url: `/calculate/balances/384` },
//     { key: "incomeData", url: `/calculate/incomes/384` },
//     { key: "cashflowData", url: `/calculate/cashflows/384` },
//     { key: "ratiosData", url: `/calculate/ratios/384` },
//   ];

//   const results = await Promise.allSettled(
//     endpoints.map((ep) => api.get(ep.url))
//   );

//   const data: Record<string, any> = {};
//   results.forEach((res, i) => {
//     if (res.status === "fulfilled") {
//       data[endpoints[i].key] = res.value.data;
//     } else {
//       console.error(`Failed to fetch ${endpoints[i].key}:`, res.reason);
//       data[endpoints[i].key] = null;
//     }
//   });

//   return data;
// };

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
    const response = await api.get(`/stocks/symbols?limit=8`);

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

// Lấy chi tiết công ty
export const getCompanyDetails = async (symbolId: string) => {
  console.log("aaa", symbolId);
  const endpoints = [
    { key: "symbolData", url: `/stocks/symbols/${symbolId}` },
    { key: "balanceData", url: `/calculate/balances/384` },
    { key: "incomeData", url: `/calculate/incomes/384` },
    { key: "cashflowData", url: `/calculate/cashflows/384` },
    { key: "ratiosData", url: `/calculate/ratios/384` },
  ];

  const results = await Promise.allSettled(
    endpoints.map((ep) => api.get(ep.url))
  );

  const data: Record<string, any> = {};

  results.forEach((res, i) => {
    if (res.status === "fulfilled" && res.value?.data) {
      data[endpoints[i].key] = res.value.data;
    } else {
      console.error(`Failed to fetch ${endpoints[i].key}:`, res);
      data[endpoints[i].key] = { message: "Đang cập nhật dữ liệu…" };
    }
  });

  return data;
};
