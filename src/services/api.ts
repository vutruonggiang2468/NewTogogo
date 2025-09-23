import axios from "axios";
const API_URL = "http://192.168.31.248:8000/api"; // Replace with your actual API URL
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export const getSymbolData = async () => {
  const response = await api.get(`/stocks/symbols?limit=8`);
  if (!response) {
    throw new Error("Failed to fetch stock data");
  }
  return response.data;
};
export const getCompanyDetails = async (symbolId: string) => {
  console.log("aaa", symbolId);
  const endpoints = [
    { key: "symbolData", url: `/stocks/symbols/${symbolId}` },
    { key: "balanceData", url: `/calculate/balances/659` },
    { key: "incomeData", url: `/calculate/incomes/659` },
    { key: "cashflowData", url: `/calculate/cashflows/659` },
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
