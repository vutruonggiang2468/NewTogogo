import axios from "axios";
// const API_URL = `${process.env.NEXT_PUBLIC_API_ORIGIN}/api`;
const API_URL = "https://payment.operis.vn/api";
console.log("API_URLLLLL", API_URL);
// Replace with your actual API URL
// const API_URL = "https://payment.operis.vn/api";
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export const getSymbolData = async (symbol: string) => {
  const response = await api.get(`/stocks/symbols?limit=8`);

  if (!response) {
    throw new Error("Failed to fetch stock data");
  }
  return response.data;
};
export const getNameData = async (code: string) => {
  const response = await api.get(`/stocks/symbols/by-name/${code}`);

  if (!response) {
    throw new Error("Failed to fetch stock data");
  }
  return response.data;
};
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
    if (res.status === "fulfilled") {
      data[endpoints[i].key] = res.value.data;
    } else {
      console.error(`Failed to fetch ${endpoints[i].key}:`, res.reason);
      data[endpoints[i].key] = null;
    }
  });

  return data;
};
