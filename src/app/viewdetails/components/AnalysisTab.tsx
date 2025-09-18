"use client";

import React, { useMemo, useState, useEffect } from "react";
import dayjs from "dayjs";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge"; // ⬅️ badge của bạn (ví dụ shadcn)
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import {
  Activity,
  AlertTriangle,
  BarChart,
  BarChart3,
  CheckCircle,
  FileBarChart,
  Lightbulb,
  TrendingDown,
  TrendingUp,
  Wallet,
  Waves,
} from "lucide-react";

import type { CompanyDetails } from "../type";



/** ========== TYPES từ BE ========== */
type Quarter = 1 | 2 | 3 | 4;

export type CashFlowRow = {
  year: number;
  quarter: number;

  // Operating
  net_profit_loss_before_tax: number;
  depreciation_and_amortisation: number;
  provision_for_credit_losses: number;
  unrealized_foreign_exchange_gain_loss: number;
  profit_loss_from_investing_activities: number;
  interest_expense: number;
  operating_profit_before_changes_in_working_capital: number;
  increase_decrease_in_receivables: number;
  increase_decrease_in_inventories: number;
  increase_decrease_in_payables: number;
  increase_decrease_in_prepaid_expenses: number;
  interest_paid: number;
  business_income_tax_paid: number;
  net_cash_inflows_outflows_from_operating_activities: number;

  // Investing
  purchase_of_fixed_assets: number;
  proceeds_from_disposal_of_fixed_assets: number;
  loans_granted_purchases_of_debt_instruments_bn_vnd: number;
  collection_of_loans_proceeds_sales_instruments_vnd: number;
  investment_in_other_entities: number;
  proceeds_from_divestment_in_other_entities: number;
  gain_on_dividend: number;
  net_cash_flows_from_investing_activities: number;

  // Financing
  increase_in_charter_captial: number;
  payments_for_share_repurchases: number;
  proceeds_from_borrowings: number;
  repayment_of_borrowings: number;
  finance_lease_principal_payments: number;
  dividends_paid: number;
  cash_flows_from_financial_activities: number;

  // Cash summary
  net_increase_decrease_in_cash_and_cash_equivalents: number;
  cash_and_cash_equivalents: number; // đầu kỳ
  foreign_exchange_differences_adjustment: number;
  cash_and_cash_equivalents_at_the_end_of_period: number; // cuối kỳ
};

type Props = { data?: CompanyDetails | null; loading?: boolean; error?: string | null };

type YoYMode = "annual" | "quarter-latest";
type Metric = { label: string; field: keyof CashFlowRow; yoy?: YoYMode; strong?: boolean };

/** ========== UTILS ========== */
const TO_BILLION = 1e9;

const fmtBnVND = (v?: number | null) => {
  if (v == null) return "—";
  const bn = v / TO_BILLION;
  if (Math.abs(bn) < 1e-9) return "0";
  return bn.toLocaleString("vi-VN", { maximumFractionDigits: 3 });
};

const amountClass = (v?: number | null) =>
  v == null ? "text-slate-400" : v < 0 ? "text-red-400" : "text-slate-200";

const yoyClass = (pct?: number | null) =>
  pct == null || !Number.isFinite(pct) ? "text-slate-400" : pct >= 0 ? "text-emerald-400" : "text-red-400";

const fmtYoY = (pct?: number | null) =>
  pct == null || !Number.isFinite(pct) ? "—" : `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`;

/** Helper: record theo năm/quý */
const getQuarterRow = (rows: CashFlowRow[], year: number, quarter: Quarter) =>
  rows.find((r) => r.year === year && r.quarter === quarter);

/** Danh sách năm giảm dần */
const getYearsDesc = (rows: CashFlowRow[]) =>
  Array.from(new Set(rows.map((r) => r.year))).sort((a, b) => b - a);

/** Tổng 4 quý của 1 năm cho 1 field */
const sumYear = (rows: CashFlowRow[], year: number, field: keyof CashFlowRow) =>
  rows.filter((r) => r.year === year).reduce((s, r) => s + (Number(r[field]) || 0), 0);

/** Quý mới nhất có dữ liệu trong 1 năm */
// const latestQuarterOfYear = (rows: CashFlowRow[], year: number): Quarter | null => {
//   const qs = rows.filter((r) => r.year === year).map((r) => r.quarter);
//   if (!qs.length) return null;
//   return qs.sort((a, b) => b - a)[0] ?? null;
// };
const latestQuarterOfYear = (rows: CashFlowRow[], year: number): Quarter | null => {
  const qs = rows.filter((r) => r.year === year).map((r) => r.quarter);
  if (!qs.length) return null;

  const max = Math.max(...qs);
  return [1, 2, 3, 4].includes(max) ? (max as Quarter) : null; // ✅ an toàn
};


/** YoY tổng năm */
const yoyAnnual = (rows: CashFlowRow[], year: number, field: keyof CashFlowRow) => {
  const cur = sumYear(rows, year, field);
  const prev = sumYear(rows, year - 1, field);
  if (!Number.isFinite(prev) || prev === 0) return null;
  return ((cur - prev) / Math.abs(prev)) * 100;
};

/** YoY theo quý mới nhất (so cùng quý năm trước) */
const yoyQuarterLatest = (rows: CashFlowRow[], year: number, field: keyof CashFlowRow) => {
  const q = latestQuarterOfYear(rows, year);
  if (!q) return null;
  const cur = getQuarterRow(rows, year, q)?.[field] as number | undefined;
  const prev = getQuarterRow(rows, year - 1, q)?.[field] as number | undefined;
  if (cur == null || prev == null || prev === 0) return null;
  return ((cur - prev) / Math.abs(prev)) * 100;
};

/** Cấu hình các dòng trong bảng */
const OPERATING_ROWS: Metric[] = [
  { label: "Lợi nhuận trước thuế", field: "net_profit_loss_before_tax", yoy: "annual", strong: true },
  { label: "Khấu hao và phân bổ", field: "depreciation_and_amortisation", yoy: "annual" },
  { label: "Chi phí dự phòng rủi ro tín dụng", field: "provision_for_credit_losses", yoy: "annual" },
  { label: "Lãi/lỗ chênh lệch tỷ giá (chưa thực hiện)", field: "unrealized_foreign_exchange_gain_loss", yoy: "annual" },
  { label: "Lãi/lỗ từ HĐ đầu tư", field: "profit_loss_from_investing_activities", yoy: "annual" },
  { label: "Chi phí lãi vay", field: "interest_expense", yoy: "annual" },
  { label: "LN từ HĐKD trước thay đổi VLĐ", field: "operating_profit_before_changes_in_working_capital", yoy: "annual", strong: true },
  { label: "Tăng/giảm phải thu KH", field: "increase_decrease_in_receivables", yoy: "annual" },
  { label: "Tăng/giảm hàng tồn kho", field: "increase_decrease_in_inventories", yoy: "annual" },
  { label: "Tăng/giảm phải trả NB", field: "increase_decrease_in_payables", yoy: "annual" },
  { label: "Tăng/giảm chi phí trả trước", field: "increase_decrease_in_prepaid_expenses", yoy: "annual" },
  { label: "Tiền lãi vay đã trả", field: "interest_paid", yoy: "annual" },
  { label: "Thuế TNDN đã nộp", field: "business_income_tax_paid", yoy: "annual" },
];

const INVESTING_ROWS: Metric[] = [
  { label: "Mua sắm TSCĐ", field: "purchase_of_fixed_assets", yoy: "annual" },
  { label: "Thu từ thanh lý TSCĐ", field: "proceeds_from_disposal_of_fixed_assets", yoy: "annual" },
  { label: "Cho vay/Mua công cụ nợ", field: "loans_granted_purchases_of_debt_instruments_bn_vnd", yoy: "annual" },
  { label: "Thu hồi cho vay/Bán công cụ nợ", field: "collection_of_loans_proceeds_sales_instruments_vnd", yoy: "annual" },
  { label: "Đầu tư vào đơn vị khác", field: "investment_in_other_entities", yoy: "annual" },
  { label: "Thu từ thoái vốn", field: "proceeds_from_divestment_in_other_entities", yoy: "annual" },
  { label: "Cổ tức/Lợi nhuận nhận được", field: "gain_on_dividend", yoy: "annual" },
];

const FINANCING_ROWS: Metric[] = [
  { label: "Tăng vốn điều lệ", field: "increase_in_charter_captial", yoy: "annual" },
  { label: "Chi mua lại cổ phiếu quỹ", field: "payments_for_share_repurchases", yoy: "annual" },
  { label: "Tiền vay nhận được", field: "proceeds_from_borrowings", yoy: "annual" },
  { label: "Trả nợ gốc vay", field: "repayment_of_borrowings", yoy: "annual" },
  { label: "Thanh toán nợ gốc thuê TC", field: "finance_lease_principal_payments", yoy: "annual" },
  { label: "Cổ tức đã trả", field: "dividends_paid", yoy: "annual" },
];

const CASH_ROWS: Metric[] = [
  { label: "Tăng/giảm tiền thuần trong kỳ", field: "net_increase_decrease_in_cash_and_cash_equivalents", yoy: "annual", strong: true },
  { label: "Tiền & TĐT đầu kỳ", field: "cash_and_cash_equivalents", yoy: "quarter-latest" },
  { label: "Ảnh hưởng thay đổi tỷ giá", field: "foreign_exchange_differences_adjustment", yoy: "annual" },
];

/** ========== COMPONENT ========== */
export default function CashFlow({ data, loading, error }: Props) {
  /** Sắp xếp để hiển thị ổn định */
  const cashflowRaw = data?.cashflowData;
  
  const rows = useMemo<CashFlowRow[]>(
    () => {
      if (!cashflowRaw) return [];
      const list = Array.isArray(cashflowRaw) ? cashflowRaw : [cashflowRaw];

      return list
        .map((row) => {
          const partial = row as Partial<CashFlowRow> & { symbol?: unknown; year?: number | string; quarter?: number | string };
          const yearNum = Number(partial.year);
          const yearInt = Number.isFinite(yearNum) ? Math.trunc(yearNum) : Number.NaN;
          const quarterNum = Number(partial.quarter);
          const quarterInt = Number.isFinite(quarterNum) ? Math.trunc(quarterNum) : Number.NaN;

          if (!Number.isFinite(yearInt) || ![1, 2, 3, 4].includes(quarterInt)) {
            return null;
          }

          const { symbol: _symbol, year: _year, quarter: _quarter, ...rest } =
            partial as Partial<CashFlowRow> & { symbol?: unknown };

          const numericRest = Object.entries(rest as Record<string, unknown>).reduce<Partial<CashFlowRow>>((acc, [key, value]) => {
            if (value == null) return acc;

            if (typeof value === "number") {
              acc[key as keyof CashFlowRow] = value;
              return acc;
            }

            if (typeof value === "string") {
              const parsed = Number(value.replace(/,/g, ""));
              if (Number.isFinite(parsed)) {
                acc[key as keyof CashFlowRow] = parsed;
              }
              return acc;
            }

            const parsed = Number(value);
            if (Number.isFinite(parsed)) {
              acc[key as keyof CashFlowRow] = parsed;
            }

            return acc;
          }, {});

          return {
            ...numericRest,
            year: yearInt,
            quarter: quarterInt as Quarter,
          } as CashFlowRow;
        })
        .filter((row): row is CashFlowRow => row != null)
        .sort((a, b) => a.year - b.year || a.quarter - b.quarter);
    },
    [cashflowRaw]
  );

  /** Danh sách năm & năm đang chọn */
  const yearsDesc = useMemo(() => getYearsDesc(rows), [rows]);
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    if (!year && yearsDesc.length) setYear(yearsDesc[0]); // auto chọn năm mới nhất
  }, [yearsDesc, year]);

  /** Cell hiển thị theo quý */
  const Cell = (q: Quarter, field: keyof CashFlowRow, y: number | null, strong = false) => {
    if (!y) return <td className="p-4 text-right text-slate-400">—</td>;
    const v = getQuarterRow(rows, y, q)?.[field] as number | undefined;
    return (
      <td className={`p-4 text-right ${amountClass(v)} ${strong ? "font-bold" : ""}`}>
        {fmtBnVND(v)}
      </td>
    );
  };

  /** Tính %YoY cho 1 field theo mode */
  const yoyValue = (field: keyof CashFlowRow, mode: YoYMode = "annual") => {
    if (!year) return null;
    return mode === "quarter-latest"
      ? yoyQuarterLatest(rows, year, field)
      : yoyAnnual(rows, year, field);
  };

  /** 1 hàng chỉ tiêu chung */
  const MetricRow: React.FC<Metric> = ({ label, field, yoy = "annual", strong }) => {
    const pct = yoyValue(field, yoy);
    return (
      <tr className="hover:bg-slate-700/20 transition-colors border-b border-slate-700/40">
        <td className={`p-4 pl-8 ${strong ? "text-slate-200 font-medium" : "text-slate-300"}`}>{label}</td>
        {Cell(1, field, year, !!strong)}
        {Cell(2, field, year)}
        {Cell(3, field, year)}
        {Cell(4, field, year)}
        <td className={`p-4 text-right font-semibold ${yoyClass(pct)}`}>{fmtYoY(pct)}</td>
      </tr>
    );
  };

  /** Hàng tổng (màu nhấn) */
  const TotalRow: React.FC<{
    label: string;
    field: keyof CashFlowRow;
    color: "emerald" | "blue" | "purple" | "cyan";
    yoy?: YoYMode;
  }> = ({ label, field, color, yoy = "annual" }) => {
    const pct = yoyValue(field, yoy);
    const mapColor = {
      emerald: { text: "text-emerald-400", bg: "bg-emerald-500/15", border: "border-emerald-400/40" },
      blue: { text: "text-blue-400", bg: "bg-blue-500/15", border: "border-blue-400/40" },
      purple: { text: "text-purple-400", bg: "bg-purple-500/15", border: "border-purple-400/40" },
      cyan: { text: "text-cyan-400", bg: "bg-cyan-500/15", border: "border-cyan-400/40" },
    }[color];

    return (
      <tr className={`${mapColor.bg} ${mapColor.border} font-bold border-b-2`}>
        <td className={`p-5 pl-6 ${mapColor.text} text-base`}>{label}</td>
        {Cell(1, field, year, true)}
        {Cell(2, field, year)}
        {Cell(3, field, year)}
        {Cell(4, field, year)}
        <td className={`p-5 text-right font-bold ${yoyClass(pct)}`}>{fmtYoY(pct)}</td>
      </tr>
    );
  };

  /** Loading / Error / Empty */
  if (loading) return <div className="p-6 text-slate-300">Đang tải dữ liệu…</div>;
  if (error) return <div className="p-6 text-red-400">Lỗi: {error}</div>;
  if (!rows.length) return <div className="p-6 text-slate-300">Không có dữ liệu để hiển thị</div>;

  /** KPI (ví dụ động cơ bản) */
  const ocfSum = year ? sumYear(rows, year, "net_cash_inflows_outflows_from_operating_activities") : null;
  const ocfYoy = year ? yoyAnnual(rows, year, "net_cash_inflows_outflows_from_operating_activities") : null;

  const invSum = year ? sumYear(rows, year, "net_cash_flows_from_investing_activities") : null;
  const invYoy = year ? yoyAnnual(rows, year, "net_cash_flows_from_investing_activities") : null;

  const finSum = year ? sumYear(rows, year, "cash_flows_from_financial_activities") : null;
  const finYoy = year ? yoyAnnual(rows, year, "cash_flows_from_financial_activities") : null;

  const latestQ = year ? latestQuarterOfYear(rows, year) : null;
  const cashEnd = latestQ && year ? getQuarterRow(rows, year, latestQ)?.cash_and_cash_equivalents_at_the_end_of_period : null;
  const cashEndYoY = year ? yoyQuarterLatest(rows, year, "cash_and_cash_equivalents_at_the_end_of_period") : null;

  console.log("CashFlow rows:", data);
  return (
    <Card className="bg-slate-800/60 border border-blue-400/30">
      <CardContent className="p-8">
        {/* Header + Year Picker */}

        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-cyan-400 flex items-center gap-3">
            <Waves className="w-6 h-6" />
            Phân tích dòng tiền (Cash Flow Analysis)
          </h3>

          <div className="flex items-center gap-4">
            <div className="text-left text-slate-200 font-semibold min-w-[120px]">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack spacing={2}>
                  <Box
                    sx={{
                      width: 200,
                      "& .MuiInputBase-root": { color: "white" },
                      "& .MuiInputLabel-root": { color: "white" },
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
                      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
                    }}
                  >
                    <DatePicker
                      label="Year"
                      views={["year"]}
                      openTo="year"
                      value={year ? dayjs(`${year}-01-01`) : null}
                      onChange={(v) => v && setYear(v.year())}
                    />
                  </Box>
                </Stack>
              </LocalizationProvider>
            </div>

            <div className="flex gap-2">
              <Badge className="bg-cyan-500/20 text-cyan-400 px-3 py-1">Báo cáo {year ?? "—"}</Badge>
              <Badge className="bg-emerald-500/20 text-emerald-400 px-3 py-1">Đã kiểm toán</Badge>
            </div>
          </div>
        </div>

        {/* KPI Cards (động) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="p-5 bg-gradient-to-br from-emerald-500/15 to-emerald-600/5 rounded-xl border border-emerald-400/30">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-emerald-400">Dòng tiền HĐKD</h4>
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{fmtBnVND(ocfSum)}</div>
            <div className={`text-sm ${yoyClass(ocfYoy)} mb-1`}>YoY {fmtYoY(ocfYoy)}</div>
            <div className="text-xs text-slate-300">OCF (tổng năm)</div>
          </div>

          <div className="p-5 bg-gradient-to-br from-blue-500/15 to-blue-600/5 rounded-xl border border-blue-400/30">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-blue-400">Dòng tiền Đầu tư</h4>
              <TrendingDown className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{fmtBnVND(invSum)}</div>
            <div className={`text-sm ${yoyClass(invYoy)} mb-1`}>YoY {fmtYoY(invYoy)}</div>
            <div className="text-xs text-slate-300">Investing CF (tổng năm)</div>
          </div>

          <div className="p-5 bg-gradient-to-br from-purple-500/15 to-purple-600/5 rounded-xl border border-purple-400/30">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-purple-400">Dòng tiền Tài chính</h4>
              <Activity className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{fmtBnVND(finSum)}</div>
            <div className={`text-sm ${yoyClass(finYoy)} mb-1`}>YoY {fmtYoY(finYoy)}</div>
            <div className="text-xs text-slate-300">Financing CF (tổng năm)</div>
          </div>

          <div className="p-5 bg-gradient-to-br from-cyan-500/15 to-cyan-600/5 rounded-xl border border-cyan-400/30">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-cyan-400">Tiền & TĐT cuối kỳ</h4>
              <Wallet className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{fmtBnVND(cashEnd ?? null)}</div>
            <div className={`text-sm ${yoyClass(cashEndYoY)} mb-1`}>YoY {fmtYoY(cashEndYoY)}</div>
            <div className="text-xs text-slate-300">So cùng quý năm trước</div>
          </div>
        </div>

        {/* BẢNG LCTT */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
              <FileBarChart className="w-5 h-5" />
              Báo cáo lưu chuyển tiền tệ (Consolidated Cash Flow Statement)
            </h4>
            <div className="text-sm text-slate-400">Đơn vị: Tỷ VND | Dữ liệu theo quý</div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-600/40">
            <table className="w-full text-sm border-collapse bg-slate-900/20">
              <thead>
                <tr className="border-b-2 border-slate-600/60 bg-slate-800/50">
                  <th className="text-left p-4 text-slate-200 font-semibold min-w-[300px]">Khoản mục</th>
                  <th className="text-right p-4 text-slate-200 font-semibold w-[100px]">Quý 1</th>
                  <th className="text-right p-4 text-slate-200 font-semibold w-[100px]">Quý 2</th>
                  <th className="text-right p-4 text-slate-200 font-semibold w-[100px]">Quý 3</th>
                  <th className="text-right p-4 text-slate-200 font-semibold w-[100px]">Quý 4</th>
                  <th className="text-right p-4 text-slate-200 font-semibold w-[100px]">% YoY</th>
                </tr>
              </thead>

              <tbody>
                {/* I. OPERATING */}
                <tr className="bg-emerald-500/8 border-b border-emerald-400/20">
                  <td className="p-4 font-bold text-emerald-400 text-base" colSpan={6}>
                    I. HOẠT ĐỘNG KINH DOANH (OPERATING ACTIVITIES)
                  </td>
                </tr>
                {OPERATING_ROWS.map((m) => (
                  <MetricRow key={m.field as string} {...m} />
                ))}
                <TotalRow
                  label="Lưu chuyển tiền thuần từ HĐKD"
                  field="net_cash_inflows_outflows_from_operating_activities"
                  color="emerald"
                  yoy="annual"
                />

                {/* II. INVESTING */}
                <tr className="bg-blue-500/8 border-b border-blue-400/20">
                  <td className="p-4 font-bold text-blue-400 text-base" colSpan={6}>
                    II. HOẠT ĐỘNG ĐẦU TƯ (INVESTING ACTIVITIES)
                  </td>
                </tr>
                {INVESTING_ROWS.map((m) => (
                  <MetricRow key={m.field as string} {...m} />
                ))}
                <TotalRow
                  label="Lưu chuyển tiền thuần từ HĐĐT"
                  field="net_cash_flows_from_investing_activities"
                  color="blue"
                  yoy="annual"
                />

                {/* III. FINANCING */}
                <tr className="bg-purple-500/8 border-b border-purple-400/20">
                  <td className="p-4 font-bold text-purple-400 text-base" colSpan={6}>
                    III. HOẠT ĐỘNG TÀI CHÍNH (FINANCING ACTIVITIES)
                  </td>
                </tr>
                {FINANCING_ROWS.map((m) => (
                  <MetricRow key={m.field as string} {...m} />
                ))}
                <TotalRow
                  label="Lưu chuyển tiền thuần từ HĐTC"
                  field="cash_flows_from_financial_activities"
                  color="purple"
                  yoy="annual"
                />

                {/* IV. CASH POSITION */}
                <tr className="bg-cyan-500/8 border-b border-cyan-400/20">
                  <td className="p-4 font-bold text-cyan-400 text-base" colSpan={6}>
                    IV. TÌNH HÌNH TIỀN MẶT VÀ TƯƠNG ĐƯƠNG TIỀN
                  </td>
                </tr>
                {CASH_ROWS.map((m) => (
                  <MetricRow key={m.field as string} {...m} />
                ))}
                <TotalRow
                  label="Tiền và tương đương tiền cuối kỳ"
                  field="cash_and_cash_equivalents_at_the_end_of_period"
                  color="cyan"
                  yoy="quarter-latest" // so cùng quý năm trước
                />
              </tbody>
            </table>
          </div>
        </div>

        {/* ======= Bạn có thể giữ/tuỳ biến các phần phân tích dưới đây (tĩnh hoặc nối thêm dữ liệu) ======= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="p-6 bg-gradient-to-br from-emerald-500/8 to-emerald-600/5 rounded-xl border border-emerald-400/30">
            <h4 className="text-lg font-semibold text-emerald-400 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Điểm mạnh (Key Strengths)
            </h4>
            <ul className="space-y-3 text-sm text-slate-200">
              <li className="flex items-start gap-3 p-3 bg-emerald-500/10 rounded-lg">
                <span className="text-emerald-400 font-bold mt-1 text-lg">•</span>
                <div>
                  <strong className="text-white">OCF tích cực:</strong>
                  <p className="text-slate-300 mt-1">Tổng OCF năm {year ?? "—"}: {fmtBnVND(ocfSum)} ({fmtYoY(ocfYoy)} YoY)</p>
                </div>
              </li>
              <li className="flex items-start gap-3 p-3 bg-emerald-500/10 rounded-lg">
                <span className="text-emerald-400 font-bold mt-1 text-lg">•</span>
                <div>
                  <strong className="text-white">Tiền mặt cuối kỳ:</strong>
                  <p className="text-slate-300 mt-1">Cuối quý {latestQ ?? "—"} năm {year ?? "—"}: {fmtBnVND(cashEnd)} ({fmtYoY(cashEndYoY)} YoY)</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="p-6 bg-gradient-to-br from-yellow-500/8 to-orange-500/5 rounded-xl border border-yellow-400/30">
            <h4 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Điểm cần lưu ý (Areas of Concern)
            </h4>
            <ul className="space-y-3 text-sm text-slate-200">
              <li className="flex items-start gap-3 p-3 bg-yellow-500/10 rounded-lg">
                <span className="text-yellow-400 font-bold mt-1 text-lg">•</span>
                <div>
                  <strong className="text-white">Dòng tiền đầu tư:</strong>
                  <p className="text-slate-300 mt-1">Tổng HĐĐT năm {year ?? "—"}: {fmtBnVND(invSum)} ({fmtYoY(invYoy)} YoY)</p>
                </div>
              </li>
              <li className="flex items-start gap-3 p-3 bg-yellow-500/10 rounded-lg">
                <span className="text-yellow-400 font-bold mt-1 text-lg">•</span>
                <div>
                  <strong className="text-white">Dòng tiền tài chính:</strong>
                  <p className="text-slate-300 mt-1">Tổng HĐTC năm {year ?? "—"}: {fmtBnVND(finSum)} ({fmtYoY(finYoy)} YoY)</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Benchmark (tuỳ bạn nối thêm số thật nếu có) */}
        <div className="p-6 bg-gradient-to-r from-slate-800/50 to-slate-700/30 rounded-xl border border-slate-600/40">
          <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <BarChart className="w-5 h-5" />
            So sánh ngành (Industry Benchmark)
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-slate-700/40 rounded-lg">
              <div className="text-slate-400 mb-2 text-sm">OCF (năm)</div>
              <div className="text-2xl font-bold text-emerald-400 mb-1">{fmtBnVND(ocfSum)}</div>
              <Badge className="bg-emerald-500/20 text-emerald-400 text-xs">YoY {fmtYoY(ocfYoy)}</Badge>
            </div>
            <div className="text-center p-4 bg-slate-700/40 rounded-lg">
              <div className="text-slate-400 mb-2 text-sm">HĐĐT (năm)</div>
              <div className="text-2xl font-bold text-blue-400 mb-1">{fmtBnVND(invSum)}</div>
              <Badge className="bg-blue-500/20 text-blue-400 text-xs">YoY {fmtYoY(invYoy)}</Badge>
            </div>
            <div className="text-center p-4 bg-slate-700/40 rounded-lg">
              <div className="text-slate-400 mb-2 text-sm">HĐTC (năm)</div>
              <div className="text-2xl font-bold text-purple-400 mb-1">{fmtBnVND(finSum)}</div>
              <Badge className="bg-purple-500/20 text-purple-400 text-xs">YoY {fmtYoY(finYoy)}</Badge>
            </div>
            <div className="text-center p-4 bg-slate-700/40 rounded-lg">
              <div className="text-slate-400 mb-2 text-sm">Tiền cuối kỳ</div>
              <div className="text-2xl font-bold text-cyan-400 mb-1">{fmtBnVND(cashEnd)}</div>
              <Badge className="bg-cyan-500/20 text-cyan-400 text-xs">YoY {fmtYoY(cashEndYoY)}</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
