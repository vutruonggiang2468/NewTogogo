export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  address: string;
  gender: "male" | "female" | "other";
  dateOfBirth: string;
  avatar: string;
  joinDate: string;
  totalTrades: number;
  totalProfit: number;
  successRate: number;
  signalMethod: "zalo" | "telegram" | "email";
  signalEnabled: boolean;
  telegramId?: string;
  zaloPhone?: string;
}
