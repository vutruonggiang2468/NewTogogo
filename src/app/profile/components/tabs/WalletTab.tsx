"use client";

import {
  AlertCircle,
  CheckCircle,
  Clock,
  Copy,
  QrCode,
  Wallet,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { WalletBalance } from "../../types";
import { cn } from "@/components/ui/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface WalletTabProps {
  walletBalance: WalletBalance;
  setWalletBalance: React.Dispatch<React.SetStateAction<WalletBalance>>;
  formatCurrency: (amount: number) => string;
}

export default function WalletTab({
  walletBalance,
  setWalletBalance,
  formatCurrency,
}: WalletTabProps) {
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});
  const [showTopUpDialog, setShowTopUpDialog] = useState(false);

  // QR Payment States
  const [paymentStatus, setPaymentStatus] = useState<
    "waiting" | "processing" | "success" | "failed"
  >("waiting");
  const [qrData, setQrData] = useState("");
  const [topUpAmount, setTopUpAmount] = useState<number>(500000);

  // NEW: Validation function for top-up amounts
  const validateTopUpAmount = (amount: number): string | null => {
    const minTopUp = 50000;
    const maxTopUp = 50000000; // 50 million VND max per transaction

    if (amount < minTopUp) {
      return `Số tiền nạp tối thiểu là ${formatCurrency(minTopUp)} VNĐ`;
    }
    if (amount > maxTopUp) {
      return `Số tiền nạp tối đa là ${formatCurrency(maxTopUp)} VNĐ`;
    }
    if (amount % 1000 !== 0) {
      return "Số tiền nạp phải là bội số của 1,000 VNĐ";
    }
    return null;
  };

  // Sửa regex + cho phép bỏ trường mà không nhảy về 0
  const handleTopUpAmountChange = (value: string) => {
    const numericValue = value.replace(/[^\d]/g, ""); // <-- đúng: [^\d]
    if (numericValue === "") {
      setTopUpAmount(0); // giữ state số, nhưng hiển thị trống ở input (xem value dưới)
    } else {
      setTopUpAmount(Number(numericValue));
    }
    setValidationErrors((prev) => ({ ...prev, topUpAmount: "" }));
  };

  const handleTopUp = () => {
    // Validate the top-up amount before proceeding
    const validationError = validateTopUpAmount(topUpAmount);
    if (validationError) {
      setValidationErrors((prev) => ({
        ...prev,
        topUpAmount: validationError,
      }));
      return;
    }

    // Clear any previous validation errors
    setValidationErrors((prev) => ({ ...prev, topUpAmount: "" }));

    setShowTopUpDialog(true);
    const orderId = `TOP${Date.now()}`;
    const qrString = `TOPUP|${orderId}|${topUpAmount}|WALLET_RECHARGE`;
    setQrData(qrString);
    setPaymentStatus("waiting");
  };

  const handleTopUpSuccess = () => {
    setWalletBalance((prev) => ({
      ...prev,
      balance: prev.balance + topUpAmount,
      lastTopUp: new Date().toISOString().split("T")[0],
    }));
    setShowTopUpDialog(false);
    setPaymentStatus("waiting");
  };

  const handleCopyQR = () => {
    navigator.clipboard.writeText(qrData);
  };

  return (
    <div>
      <TabsContent
        value="wallet"
        className="p-8 pt-12 space-y-6 bg-slate-900/40"
      >
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Ví & Nạp tiền</h2>
          <p className="text-slate-400">Quản lý ví và nạp tiền vào tài khoản</p>
        </div>

        {/* Wallet Balance */}
        <Card className="bg-gradient-to-br from-slate-800/40 to-slate-700/40 border border-emerald-400/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-400" />
              Số dư ví
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-6 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-lg border border-emerald-400/30">
              <div className="text-3xl font-bold text-white mb-2">
                {formatCurrency(walletBalance.balance)} VNĐ
              </div>
              <p className="text-emerald-400 text-sm">Số dư hiện tại</p>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                <p className="text-slate-400">Lần nạp gần nhất</p>
                <p className="text-white font-semibold">
                  {new Date(walletBalance.lastTopUp).toLocaleDateString(
                    "vi-VN"
                  )}
                </p>
              </div>
              <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                <p className="text-slate-400">Trạng thái</p>
                <p className="text-emerald-400 font-semibold">Hoạt động</p>
              </div>
              <div className="text-center p-3 bg-slate-700/30 rounded-lg md:col-span-1 col-span-2">
                <p className="text-slate-400">Tự động gia hạn</p>
                <p className="text-white font-semibold">
                  {walletBalance.autoRenewal.enabled ? "Đang bật" : "Đang tắt"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Up Section */}
        <Card className="bg-gradient-to-br from-slate-800/40 to-slate-700/40 border border-blue-400/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <QrCode className="w-5 h-5 text-blue-400" />
              Nạp tiền qua QR Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-slate-300 mb-2 block">
                Nhập số tiền muốn nạp
              </Label>
              <Input
                type="text"
                value={formatCurrency(topUpAmount)}
                onChange={(e) => handleTopUpAmountChange(e.target.value)}
                className={cn(
                  "bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 text-lg",
                  validationErrors.topUpAmount && "border-red-400"
                )}
                placeholder="0"
              />
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-slate-400">
                  Số tiền tối thiểu: 50,000 VNĐ
                </p>
                {validationErrors.topUpAmount && (
                  <p className="text-red-400 text-xs">
                    {validationErrors.topUpAmount}
                  </p>
                )}
              </div>
            </div>

            {/* Quick amount buttons */}
            <div className="grid grid-cols-3 gap-2">
              {[100000, 500000, 1000000].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setTopUpAmount(amount)}
                  className="border-blue-400/30 text-blue-400 hover:bg-blue-400/10 hover:text-white font-bold text-base py-5"
                >
                  {formatCurrency(amount)}
                </Button>
              ))}
            </div>

            <Button
              onClick={handleTopUp}
              disabled={topUpAmount < 50000}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white disabled:opacity-50 font-bold py-5 text-base"
            >
              <QrCode className="w-6 h-6 mr-2" />
              Tạo mã QR nạp tiền
            </Button>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="bg-gradient-to-br from-slate-800/40 to-slate-700/40 border border-cyan-400/20 backdrop-blur-sm">
          <CardContent className="p-4">
            <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-cyan-400" />
              Hướng dẫn nạp tiền
            </h4>
            <div className="text-sm text-slate-400 space-y-1">
              <p>1. Nhập số tiền muốn nạp (tối thiểu 50,000 VNĐ)</p>
              <p>2. Nhấn &quot;Tạo mã QR nạp tiền&quot;</p>
              <p>3. Sử dụng app ngân hàng quét mã QR để thanh toán</p>
              <p>4. Tiền sẽ được cộng vào ví sau 1-5 phút</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <Dialog open={showTopUpDialog} onOpenChange={setShowTopUpDialog}>
        <DialogContent className="bg-slate-800 border-slate-600 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-emerald-400" />
              Nạp tiền vào ví qua QR Code
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Quét mã QR bên dưới để nạp {formatCurrency(topUpAmount)} VNĐ vào
              ví
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* QR Code Display */}
            <div className="flex justify-center">
              <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <QrCode className="w-24 h-24 text-slate-800 mx-auto mb-2" />
                  <p className="text-slate-800 text-xs">QR Code nạp tiền</p>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-3 p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
              <div className="flex justify-between">
                <span className="text-slate-400">Loại giao dịch:</span>
                <span className="text-white">Nạp tiền ví</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Mã giao dịch:</span>
                <span className="text-white font-mono text-sm">
                  {qrData.split("|")[1] || "TOP" + Date.now()}
                </span>
              </div>
              <div className="flex justify-between font-bold border-t border-slate-600 pt-2">
                <span className="text-white">Số tiền nạp:</span>
                <span className="text-emerald-400">
                  {formatCurrency(topUpAmount)} VNĐ
                </span>
              </div>
            </div>

            {/* Payment Status */}
            <div className="text-center">
              {paymentStatus === "waiting" && (
                <div className="flex items-center justify-center gap-2 text-yellow-400">
                  <Clock className="w-4 h-4 animate-pulse" />
                  <span>Chờ thanh toán...</span>
                </div>
              )}
              {paymentStatus === "success" && (
                <div className="flex items-center justify-center gap-2 text-emerald-400">
                  <CheckCircle className="w-4 h-4" />
                  <span>Nạp tiền thành công!</span>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={handleCopyQR}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <Copy className="w-4 h-4 mr-2" />
              Sao chép mã
            </Button>
            <Button
              onClick={handleTopUpSuccess}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
              disabled={paymentStatus === "success"}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Đã thanh toán
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowTopUpDialog(false);
                setPaymentStatus("waiting");
              }}
              className="border-red-600 text-red-400 hover:bg-red-600/10"
            >
              Hủy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
