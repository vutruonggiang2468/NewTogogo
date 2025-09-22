"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/components/ui/utils";
import {
  Bot,
  Crown,
  CreditCard,
  Package as PackageIcon,
  TrendingUp,
  Zap,
} from "lucide-react";
import type { ReactNode } from "react";

import { Transaction } from "../../types";

interface TransactionHistoryTabProps {
  transactions: Transaction[];
}

function getTransactionIcon(type: Transaction["type"]): ReactNode {
  switch (type) {
    case "bot_subscription":
      return <Bot className="w-5 h-5" />;
    case "signal_package":
      return <Zap className="w-5 h-5" />;
    case "analysis_package":
      return <TrendingUp className="w-5 h-5" />;
    case "premium_upgrade":
      return <Crown className="w-5 h-5" />;
    default:
      return <PackageIcon className="w-5 h-5" />;
  }
}

function getTransactionColor(type: Transaction["type"]): string {
  switch (type) {
    case "bot_subscription":
      return "border-blue-400/30 text-blue-400 bg-blue-400/10";
    case "signal_package":
      return "border-yellow-400/30 text-yellow-400 bg-yellow-400/10";
    case "analysis_package":
      return "border-emerald-400/30 text-emerald-400 bg-emerald-400/10";
    case "premium_upgrade":
      return "border-purple-400/30 text-purple-400 bg-purple-400/10";
    default:
      return "border-slate-400/30 text-slate-400 bg-slate-400/10";
  }
}

export default function TransactionHistoryTab({
  transactions,
}: TransactionHistoryTabProps) {
  return (
    <TabsContent
      value="history"
      className="p-8 pt-12 space-y-6 bg-slate-900/40"
    >
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">
          Lịch sử giao dịch
        </h2>
        <p className="text-slate-400">
          Theo dõi lịch sử giao dịch và thanh toán của bạn
        </p>
      </div>

      <Card className="bg-gradient-to-br from-slate-800/40 to-slate-700/40 border border-purple-400/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2 text-lg font-semibold">
            <CreditCard className="w-6 h-6 text-purple-400" />
            Lịch sử thanh toán
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/30"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center border",
                      getTransactionColor(transaction.type)
                    )}
                  >
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <p className="text-white text-base font-medium">
                      {transaction.description}
                    </p>
                    <p className="text-slate-400 text-sm">
                      {new Date(transaction.date).toLocaleDateString("vi-VN")}
                      {transaction.duration ? (
                        <span> • {transaction.duration}</span>
                      ) : null}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-white font-semibold">
                    {transaction.amount.toLocaleString("vi-VN")} VNĐ
                  </span>
                  <Badge
                    className={cn(
                      "text-xs",
                      transaction.status === "completed"
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-400/30"
                        : transaction.status === "pending"
                        ? "bg-yellow-500/20 text-yellow-400 border-yellow-400/30"
                        : "bg-red-500/20 text-red-400 border-red-400/30"
                    )}
                  >
                    {transaction.status === "completed"
                      ? "Hoàn thành"
                      : transaction.status === "pending"
                      ? "Chờ xử lý"
                      : "Thất bại"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
