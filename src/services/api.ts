import axios from "axios";
const API_URL = "http://localhost:8000/api";

export const getSymbolData = async (symbol: string) => {
  const response = await axios(`${API_URL}/stocks/symbols/${symbol}`);
  if (!response) {
    throw new Error("Failed to fetch stock data");
  }
  return response.data;
};
export const apiGetSymbolByNameData = async () => {
  const response = await axios(`${API_URL}/stocks/symbols?limit=8`);
  if (!response) {
    throw new Error("Failed to fetch stock data");
  }
  return response.data;
};
export const apiGetCashflowsData = async () => {
  const response = await axios(`${API_URL}/calculate/cashflows/667?limit=10`);
  if (!response) {
    throw new Error("Failed to fetch stock data");
  }
  return response.data;
};