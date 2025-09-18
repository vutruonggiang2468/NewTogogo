import axios from "axios";
const API_URL = "https://payment.operis.vn/api"; // Replace with your actual API URL
const api = axios.create({
  baseURL: "https://payment.operis.vn/api/",
  timeout: 10000,
});


export const getSymbolData = async (symbol: string) => {
  const response = await axios(`${API_URL}/stocks/symbols?limit=8`);
  if (!response) {
    throw new Error("Failed to fetch stock data");
  }
  return response.data;
};
export const getCompanyDetails = async (symbolId: string | number) => {
  const endpoints = [
    { key: "symbolData", url: `/stocks/symbols/96` },   
    { key: "balanceData", url: `/calculate/balances/670` }, 
    { key: "incomeData", url: `/calculate/incomes/670` }, 
    { key: "cashflowData", url: `/calculate/cashflows/670` }, 
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