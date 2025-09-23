"use client";

import React, { useMemo, useState, useEffect } from "react";
import dayjs from "dayjs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // ⬅️ badge của bạn (ví dụ shadcn)
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import {
  Activity,
  AlertTriangle,
  BarChart,
  Building2,
  Calculator,
  Calendar,
  CheckCircle,
  FileBarChart,
  Star,
  TrendingDown,
  TrendingUp,
  Wallet,
  Waves,
} from "lucide-react";

import type { CompanyDetails } from "../types";

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

type Props = {
  data?: CompanyDetails | null;
  loading?: boolean;
  error?: string | null;
};

type YoYMode = "annual" | "quarter-latest";
type Metric = {
  label: string;
  field: keyof CashFlowRow;
  yoy?: YoYMode;
  strong?: boolean;
};

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
  pct == null || !Number.isFinite(pct)
    ? "text-slate-400"
    : pct >= 0
      ? "text-emerald-400"
      : "text-red-400";

const fmtYoY = (pct?: number | null) =>
  pct == null || !Number.isFinite(pct)
    ? "—"
    : `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`;

/** Helper: record theo năm/quý */
const getQuarterRow = (rows: CashFlowRow[], year: number, quarter: Quarter) =>
  rows.find((r) => r.year === year && r.quarter === quarter);

/** Danh sách năm giảm dần */
const getYearsDesc = (rows: CashFlowRow[]) =>
  Array.from(new Set(rows.map((r) => r.year))).sort((a, b) => b - a);

/** Tổng 4 quý của 1 năm cho 1 field */
const sumYear = (rows: CashFlowRow[], year: number, field: keyof CashFlowRow) =>
  rows
    .filter((r) => r.year === year)
    .reduce((s, r) => s + (Number(r[field]) || 0), 0);

/** Quý mới nhất có dữ liệu trong 1 năm */
// const latestQuarterOfYear = (rows: CashFlowRow[], year: number): Quarter | null => {
//   const qs = rows.filter((r) => r.year === year).map((r) => r.quarter);
//   if (!qs.length) return null;
//   return qs.sort((a, b) => b - a)[0] ?? null;
// };
const latestQuarterOfYear = (
  rows: CashFlowRow[],
  year: number
): Quarter | null => {
  const qs = rows.filter((r) => r.year === year).map((r) => r.quarter);
  if (!qs.length) return null;

  const max = Math.max(...qs);
  return [1, 2, 3, 4].includes(max) ? (max as Quarter) : null; // ✅ an toàn
};

/** YoY tổng năm */
const yoyAnnual = (
  rows: CashFlowRow[],
  year: number,
  field: keyof CashFlowRow
) => {
  const cur = sumYear(rows, year, field);
  const prev = sumYear(rows, year - 1, field);
  if (!Number.isFinite(prev) || prev === 0) return null;
  return ((cur - prev) / Math.abs(prev)) * 100;
};

/** YoY theo quý mới nhất (so cùng quý năm trước) */
const yoyQuarterLatest = (
  rows: CashFlowRow[],
  year: number,
  field: keyof CashFlowRow
) => {
  const q = latestQuarterOfYear(rows, year);
  if (!q) return null;
  const cur = getQuarterRow(rows, year, q)?.[field] as number | undefined;
  const prev = getQuarterRow(rows, year - 1, q)?.[field] as number | undefined;
  if (cur == null || prev == null || prev === 0) return null;
  return ((cur - prev) / Math.abs(prev)) * 100;
};

/** Cấu hình các dòng trong bảng */
const OPERATING_ROWS: Metric[] = [
  {
    label: "Lợi nhuận trước thuế",
    field: "net_profit_loss_before_tax",
    yoy: "annual",
    strong: true,
  },
  {
    label: "Khấu hao và phân bổ",
    field: "depreciation_and_amortisation",
    yoy: "annual",
  },
  {
    label: "Chi phí dự phòng rủi ro tín dụng",
    field: "provision_for_credit_losses",
    yoy: "annual",
  },
  {
    label: "Lãi/lỗ chênh lệch tỷ giá (chưa thực hiện)",
    field: "unrealized_foreign_exchange_gain_loss",
    yoy: "annual",
  },
  {
    label: "Lãi/lỗ từ HĐ đầu tư",
    field: "profit_loss_from_investing_activities",
    yoy: "annual",
  },
  { label: "Chi phí lãi vay", field: "interest_expense", yoy: "annual" },
  {
    label: "LN từ HĐKD trước thay đổi VLĐ",
    field: "operating_profit_before_changes_in_working_capital",
    yoy: "annual",
    strong: true,
  },
  {
    label: "Tăng/giảm phải thu KH",
    field: "increase_decrease_in_receivables",
    yoy: "annual",
  },
  {
    label: "Tăng/giảm hàng tồn kho",
    field: "increase_decrease_in_inventories",
    yoy: "annual",
  },
  {
    label: "Tăng/giảm phải trả NB",
    field: "increase_decrease_in_payables",
    yoy: "annual",
  },
  {
    label: "Tăng/giảm chi phí trả trước",
    field: "increase_decrease_in_prepaid_expenses",
    yoy: "annual",
  },
  { label: "Tiền lãi vay đã trả", field: "interest_paid", yoy: "annual" },
  {
    label: "Thuế TNDN đã nộp",
    field: "business_income_tax_paid",
    yoy: "annual",
  },
];

const INVESTING_ROWS: Metric[] = [
  { label: "Mua sắm TSCĐ", field: "purchase_of_fixed_assets", yoy: "annual" },
  {
    label: "Thu từ thanh lý TSCĐ",
    field: "proceeds_from_disposal_of_fixed_assets",
    yoy: "annual",
  },
  {
    label: "Cho vay/Mua công cụ nợ",
    field: "loans_granted_purchases_of_debt_instruments_bn_vnd",
    yoy: "annual",
  },
  {
    label: "Thu hồi cho vay/Bán công cụ nợ",
    field: "collection_of_loans_proceeds_sales_instruments_vnd",
    yoy: "annual",
  },
  {
    label: "Đầu tư vào đơn vị khác",
    field: "investment_in_other_entities",
    yoy: "annual",
  },
  {
    label: "Thu từ thoái vốn",
    field: "proceeds_from_divestment_in_other_entities",
    yoy: "annual",
  },
  {
    label: "Cổ tức/Lợi nhuận nhận được",
    field: "gain_on_dividend",
    yoy: "annual",
  },
];

const FINANCING_ROWS: Metric[] = [
  {
    label: "Tăng vốn điều lệ",
    field: "increase_in_charter_captial",
    yoy: "annual",
  },
  {
    label: "Chi mua lại cổ phiếu quỹ",
    field: "payments_for_share_repurchases",
    yoy: "annual",
  },
  {
    label: "Tiền vay nhận được",
    field: "proceeds_from_borrowings",
    yoy: "annual",
  },
  { label: "Trả nợ gốc vay", field: "repayment_of_borrowings", yoy: "annual" },
  {
    label: "Thanh toán nợ gốc thuê TC",
    field: "finance_lease_principal_payments",
    yoy: "annual",
  },
  { label: "Cổ tức đã trả", field: "dividends_paid", yoy: "annual" },
];

const CASH_ROWS: Metric[] = [
  {
    label: "Tăng/giảm tiền thuần trong kỳ",
    field: "net_increase_decrease_in_cash_and_cash_equivalents",
    yoy: "annual",
    strong: true,
  },
  {
    label: "Tiền & TĐT đầu kỳ",
    field: "cash_and_cash_equivalents",
    yoy: "quarter-latest",
  },
  {
    label: "Ảnh hưởng thay đổi tỷ giá",
    field: "foreign_exchange_differences_adjustment",
    yoy: "annual",
  },
];

/** ========== COMPONENT ========== */
export default function CashFlow({ data, loading, error }: Props) {
  // State for selected year and quarter in ratio analysis
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [selectedQuarter, setSelectedQuarter] = useState<number>(2);

  /** Sắp xếp để hiển thị ổn định */
  const cashflowRaw = data?.cashflowData;

  const rows = useMemo<CashFlowRow[]>(() => {
    if (!cashflowRaw) return [];
    const list = Array.isArray(cashflowRaw) ? cashflowRaw : [cashflowRaw];

    return list
      .map((row) => {
        const partial = row as Partial<CashFlowRow> & {
          symbol?: unknown;
          year?: number | string;
          quarter?: number | string;
        };
        const yearNum = Number(partial.year);
        const yearInt = Number.isFinite(yearNum)
          ? Math.trunc(yearNum)
          : Number.NaN;
        const quarterNum = Number(partial.quarter);
        const quarterInt = Number.isFinite(quarterNum)
          ? Math.trunc(quarterNum)
          : Number.NaN;

        if (!Number.isFinite(yearInt) || ![1, 2, 3, 4].includes(quarterInt)) {
          return null;
        }

        const {
          symbol: _symbol,
          year: _year,
          quarter: _quarter,
          ...rest
        } = partial as Partial<CashFlowRow> & { symbol?: unknown };

        const numericRest = Object.entries(
          rest as Record<string, unknown>
        ).reduce<Partial<CashFlowRow>>((acc, [key, value]) => {
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
  }, [cashflowRaw]);

  /** Danh sách năm & năm đang chọn */
  const yearsDesc = useMemo(() => getYearsDesc(rows), [rows]);
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    if (!year && yearsDesc.length) setYear(yearsDesc[0]); // auto chọn năm mới nhất
  }, [yearsDesc, year]);

  /** Cell hiển thị theo quý */
  const Cell = (
    q: Quarter,
    field: keyof CashFlowRow,
    y: number | null,
    strong = false
  ) => {
    if (!y) return <td className="p-4 text-right text-slate-400">—</td>;
    const v = getQuarterRow(rows, y, q)?.[field] as number | undefined;
    return (
      <td
        className={`p-4 text-right ${amountClass(v)} ${strong ? "font-bold" : ""
          }`}
      >
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
  const MetricRow: React.FC<Metric> = ({
    label,
    field,
    yoy = "annual",
    strong,
  }) => {
    const pct = yoyValue(field, yoy);
    return (
      <tr className="hover:bg-slate-700/20 transition-colors border-b border-slate-700/40">
        <td
          className={`p-4 pl-8 ${strong ? "text-slate-200 font-medium" : "text-slate-300"
            }`}
        >
          {label}
        </td>
        {Cell(1, field, year, !!strong)}
        {Cell(2, field, year)}
        {Cell(3, field, year)}
        {Cell(4, field, year)}
        <td className={`p-4 text-right font-semibold ${yoyClass(pct)}`}>
          {fmtYoY(pct)}
        </td>
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
      emerald: {
        text: "text-emerald-400",
        bg: "bg-emerald-500/15",
        border: "border-emerald-400/40",
      },
      blue: {
        text: "text-blue-400",
        bg: "bg-blue-500/15",
        border: "border-blue-400/40",
      },
      purple: {
        text: "text-purple-400",
        bg: "bg-purple-500/15",
        border: "border-purple-400/40",
      },
      cyan: {
        text: "text-cyan-400",
        bg: "bg-cyan-500/15",
        border: "border-cyan-400/40",
      },
    }[color];

    return (
      <tr className={`${mapColor.bg} ${mapColor.border} font-bold border-b-2`}>
        <td className={`p-5 pl-6 ${mapColor.text} text-base`}>{label}</td>
        {Cell(1, field, year, true)}
        {Cell(2, field, year)}
        {Cell(3, field, year)}
        {Cell(4, field, year)}
        <td className={`p-5 text-right font-bold ${yoyClass(pct)}`}>
          {fmtYoY(pct)}
        </td>
      </tr>
    );
  };

  /** Loading / Error / Empty */
  if (loading)
    return <div className="p-6 text-slate-300">Đang tải dữ liệu…</div>;
  if (error) return <div className="p-6 text-red-400">Lỗi: {error}</div>;
  if (!rows.length)
    return (
      <div className="p-6 text-slate-300">Không có dữ liệu để hiển thị</div>
    );

  /** KPI (ví dụ động cơ bản) */
  const ocfSum = year
    ? sumYear(rows, year, "net_cash_inflows_outflows_from_operating_activities")
    : null;
  const ocfYoy = year
    ? yoyAnnual(
      rows,
      year,
      "net_cash_inflows_outflows_from_operating_activities"
    )
    : null;

  const invSum = year
    ? sumYear(rows, year, "net_cash_flows_from_investing_activities")
    : null;
  const invYoy = year
    ? yoyAnnual(rows, year, "net_cash_flows_from_investing_activities")
    : null;

  const finSum = year
    ? sumYear(rows, year, "cash_flows_from_financial_activities")
    : null;
  const finYoy = year
    ? yoyAnnual(rows, year, "cash_flows_from_financial_activities")
    : null;

  const latestQ = year ? latestQuarterOfYear(rows, year) : null;
  const cashEnd =
    latestQ && year
      ? getQuarterRow(rows, year, latestQ)
        ?.cash_and_cash_equivalents_at_the_end_of_period
      : null;
  const cashEndYoY = year
    ? yoyQuarterLatest(
      rows,
      year,
      "cash_and_cash_equivalents_at_the_end_of_period"
    )
    : null;

  console.log("CashFlow rows:", data);
  return (
    <Card className="bg-slate-800/60 border border-blue-500/30">
      {/* Comprehensive Financial Ratios Analysis */}
      <Card className="bg-slate-800/60 border border-blue-400/30">
        <CardContent className="p-4 sm:p-6 lg:p-8">
          {/* Financial Ratios Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-white" />
                </div>
                <span className="hidden sm:inline">Phân Tích Chỉ Số Tài Chính</span>
                <span className="sm:hidden">Chỉ Số Tài Chính</span>
              </h3>
              <p className="text-slate-400 text-sm">Comprehensive Financial Ratios Analysis</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Badge className="bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 text-emerald-400 px-4 py-2 border border-emerald-400/30">
                <CheckCircle className="w-3 h-3 mr-2" />
                Q{selectedQuarter} {selectedYear}
              </Badge>
              <Badge className="bg-gradient-to-r from-blue-500/20 to-cyan-500/10 text-cyan-400 px-4 py-2 border border-cyan-400/30">
                <Star className="w-3 h-3 mr-2" />
                ABS - HSX
              </Badge>
            </div>
          </div>

          {(() => {
            // Generate Financial Data for Ratio Analysis
            const generateBalanceSheetData = (year: number, quarter: number) => {
              const yearFactor = 1 + (year - 2025) * 0.15;
              const quarterFactor = 1 + (quarter - 2) * 0.05;
              const totalFactor = yearFactor * quarterFactor;
              const yearVariation = { 2023: 0.7, 2024: 0.85, 2025: 1.0, 2026: 1.2 }[year] || 1.0;
              const adjustedFactor = totalFactor * yearVariation;

              const data = {
                year, quarter,
                symbol: { id: 1, name: "ABS", exchange: "HSX", company: { company_name: "Công ty Cổ phần Dịch vụ Nông nghiệp Bình Thuận", outstanding_share: 80000000, charter_capital: 800000000000 } },
                current_assets: Math.round(687434000000 * adjustedFactor),
                cash_and_cash_equivalents: Math.round(139000000 * adjustedFactor * 1.2),
                short_term_investments: Math.round(1120000 * adjustedFactor),
                accounts_receivable: Math.round(686000000000 * adjustedFactor * 0.95),
                net_inventories: Math.round(1130000000 * adjustedFactor),
                prepayments_to_suppliers: Math.round(23520000000 * adjustedFactor),
                other_current_assets: 0,
                long_term_assets: Math.round(13550000000 * adjustedFactor * 1.1),
                fixed_assets: Math.round(9400000000 * adjustedFactor * 1.1),
                long_term_investments: Math.round(adjustedFactor > 1 ? 2000000000 * (adjustedFactor - 1) : 0),
                long_term_prepayments: Math.round(4150000000 * adjustedFactor),
                other_long_term_assets: 0,
                other_long_term_receivables: 0,
                long_term_trade_receivables: 0,
                total_assets: 0,
                liabilities: Math.round(79464000000 * adjustedFactor * 0.9),
                current_liabilities: Math.round(78880000000 * adjustedFactor * 0.9),
                short_term_borrowings: Math.round(61240000000 * adjustedFactor * 0.85),
                advances_from_customers: Math.round(17640000000 * adjustedFactor),
                long_term_liabilities: Math.round(584000000 * adjustedFactor * 0.8),
                long_term_borrowings: Math.round(584000000 * adjustedFactor * 0.8),
                owners_equity: 0,
                capital_and_reserves: 0,
                common_shares: 80000000,
                paid_in_capital: 800000000000,
                undistributed_earnings: Math.round(-221100000000 + (adjustedFactor - 1) * 300000000000),
                investment_and_development_funds: Math.round(59520000 * adjustedFactor),
                total_resources: 0
              };

              data.total_assets = data.current_assets + data.long_term_assets;
              data.owners_equity = data.total_assets - data.liabilities;
              data.capital_and_reserves = data.owners_equity;
              data.total_resources = data.total_assets;

              return data;
            };

            const generateCashFlowData = (year: number, quarter: number) => {
              const yearFactor = 1 + (year - 2025) * 0.12;
              const quarterFactor = 1 + (quarter - 2) * 0.08;
              const totalFactor = yearFactor * quarterFactor;
              const yearVariation = { 2023: 0.75, 2024: 0.88, 2025: 1.0, 2026: 1.15 }[year] || 1.0;
              const adjustedFactor = totalFactor * yearVariation;

              return {
                net_income: Math.round(45000000000 * adjustedFactor),
                depreciation_amortization: Math.round(8500000000 * adjustedFactor),
                working_capital_changes: Math.round(-12000000000 * adjustedFactor * 0.8),
                accounts_receivable_change: Math.round(-35000000000 * adjustedFactor * 0.9),
                inventory_change: Math.round(-2500000000 * adjustedFactor),
                accounts_payable_change: Math.round(18000000000 * adjustedFactor),
                other_operating_activities: Math.round(3200000000 * adjustedFactor),
                capital_expenditures: Math.round(-8500000000 * adjustedFactor * 1.1),
                business_acquisitions: Math.round(adjustedFactor > 1.1 ? -15000000000 * (adjustedFactor - 1) : 0),
                asset_disposals: Math.round(2500000000 * adjustedFactor),
                investment_purchases: Math.round(-5500000000 * adjustedFactor),
                investment_sales: Math.round(3800000000 * adjustedFactor),
                other_investing_activities: Math.round(-1200000000 * adjustedFactor),
                debt_issuance: Math.round(25000000000 * adjustedFactor * 0.7),
                debt_repayment: Math.round(-35000000000 * adjustedFactor),
                equity_issuance: Math.round(adjustedFactor > 1.05 ? 10000000000 * (adjustedFactor - 1) : 0),
                dividend_payments: Math.round(-8500000000 * adjustedFactor * 1.05),
                share_repurchases: Math.round(-2800000000 * adjustedFactor),
                other_financing_activities: Math.round(-1500000000 * adjustedFactor),
                beginning_cash: Math.round(125000000 * adjustedFactor * 0.9),
                foreign_exchange_effect: Math.round(850000000 * adjustedFactor * 0.3),
              };
            };

            const generateFinancialData = (balanceSheet: any, cashFlow: any) => {
              const revenue = 248000000000 * (1 + (selectedYear - 2025) * 0.12 + (selectedQuarter - 2) * 0.03);
              const grossProfit = revenue * 0.28;
              const ebit = grossProfit * 0.65;
              const ebitda = ebit + cashFlow.depreciation_amortization;
              const netIncome = cashFlow.net_income;
              const interestExpense = 4200000000 * (1 + (selectedYear - 2025) * 0.08);
              const totalBorrowing = balanceSheet.short_term_borrowings + balanceSheet.long_term_borrowings;
              const marketPrice = 75000;
              const outstandingShares = balanceSheet.common_shares;
              const marketCap = marketPrice * outstandingShares;
              const bookValue = balanceSheet.owners_equity;
              const eps = netIncome / outstandingShares;
              const dividendPerShare = 2800;

              return { revenue, grossProfit, ebit, ebitda, netIncome, interestExpense, totalBorrowing, marketPrice, outstandingShares, marketCap, bookValue, eps, dividendPerShare };
            };

            const balanceSheetData = generateBalanceSheetData(selectedYear, selectedQuarter);
            const cashFlowData = generateCashFlowData(selectedYear, selectedQuarter);
            const financialData = generateFinancialData(balanceSheetData, cashFlowData);

            const operatingCashFlow = cashFlowData.net_income + cashFlowData.depreciation_amortization + cashFlowData.working_capital_changes + cashFlowData.other_operating_activities;

            // Calculate all financial ratios
            const ratios = {
              // Capital Structure Ratios
              totalDebtToEquity: ((balanceSheetData.short_term_borrowings + balanceSheetData.long_term_borrowings) / balanceSheetData.owners_equity),
              debtToEquity: (financialData.totalBorrowing / balanceSheetData.owners_equity),
              fixedAssetToEquity: (balanceSheetData.fixed_assets / balanceSheetData.owners_equity),
              equityToCharterCapital: (balanceSheetData.owners_equity / balanceSheetData.paid_in_capital),

              // Efficiency Ratios
              assetTurnover: (financialData.revenue / balanceSheetData.total_assets),
              fixedAssetTurnover: (financialData.revenue / balanceSheetData.fixed_assets),
              daysSalesOutstanding: (balanceSheetData.accounts_receivable / financialData.revenue) * 365,
              daysInventoryOutstanding: (balanceSheetData.net_inventories / (financialData.revenue * 0.72)) * 365,
              daysPayableOutstanding: (balanceSheetData.current_liabilities * 0.6 / (financialData.revenue * 0.72)) * 365,
              inventoryTurnover: ((financialData.revenue * 0.72) / balanceSheetData.net_inventories),

              // Profitability Ratios
              ebitMargin: (financialData.ebit / financialData.revenue) * 100,
              grossProfitMargin: (financialData.grossProfit / financialData.revenue) * 100,
              netProfitMargin: (financialData.netIncome / financialData.revenue) * 100,
              roe: (financialData.netIncome / balanceSheetData.owners_equity) * 100,
              roic: (financialData.ebit * 0.75 / (balanceSheetData.owners_equity + financialData.totalBorrowing)) * 100,
              roa: (financialData.netIncome / balanceSheetData.total_assets) * 100,
              dividendYield: (financialData.dividendPerShare / financialData.marketPrice) * 100,

              // Liquidity Ratios
              currentRatio: (balanceSheetData.current_assets / balanceSheetData.current_liabilities),
              cashRatio: (balanceSheetData.cash_and_cash_equivalents / balanceSheetData.current_liabilities),
              quickRatio: ((balanceSheetData.current_assets - balanceSheetData.net_inventories) / balanceSheetData.current_liabilities),
              interestCoverage: (financialData.ebit / financialData.interestExpense),
              financialLeverage: (balanceSheetData.total_assets / balanceSheetData.owners_equity),

              // Valuation Ratios
              pe: (financialData.marketPrice / financialData.eps),
              pb: (financialData.marketPrice / (balanceSheetData.owners_equity / balanceSheetData.common_shares)),
              ps: (financialData.marketCap / financialData.revenue),
              pCashFlow: (financialData.marketCap / operatingCashFlow)
            };

            // ratios.cashCycle = ratios.daysSalesOutstanding + ratios.daysInventoryOutstanding - ratios.daysPayableOutstanding;

            const formatVND = (amount: number) => {
              if (amount >= 1000000000000) {
                return `₫${(amount / 1000000000000).toFixed(1)}T`;
              } else if (amount >= 1000000000) {
                return `₫${(amount / 1000000000).toFixed(1)}B`;
              } else if (amount >= 1000000) {
                return `₫${(amount / 1000000).toFixed(1)}M`;
              }
              return `₫${amount.toLocaleString()}`;
            };

            const calculatePercentage = (value: number, total: number) => {
              return ((value / total) * 100).toFixed(1);
            };

            return (
              <div className="space-y-8">
                {/* Financial Ratios Period Selector */}
                <div className="p-6 bg-gradient-to-r from-slate-900/80 to-slate-800/60 rounded-xl border border-slate-500/50">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Report Meta Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-sm text-slate-400 mb-2">Mã chứng khoán (Ticker)</div>
                        <div className="text-xl font-bold text-cyan-400">ABS</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-slate-400 mb-2">Năm báo cáo (Year Report)</div>
                        <div className="text-xl font-bold text-white">{selectedYear}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-slate-400 mb-2">Kỳ báo cáo (Report Period)</div>
                        <div className="text-xl font-bold text-white">Q{selectedQuarter}</div>
                      </div>
                    </div>

                    {/* Period Selection Controls */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm font-medium text-slate-300">Chọn kỳ báo cáo:</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <select
                          value={selectedYear}
                          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                          className="px-3 py-2 bg-slate-700/60 border border-slate-600/50 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-all"
                        >
                          <option value="2023">2023</option>
                          <option value="2024">2024</option>
                          <option value="2025">2025</option>
                          <option value="2026">2026</option>
                        </select>

                        <div className="flex items-center gap-1 p-1 bg-slate-700/60 rounded-lg border border-slate-600/50">
                          {[1, 2, 3, 4].map((quarter) => (
                            <button
                              key={quarter}
                              onClick={() => setSelectedQuarter(quarter)}
                              className={`px-3 py-1.5 text-xs font-medium rounded transition-all ${selectedQuarter === quarter
                                ? 'bg-gradient-to-r from-cyan-500/30 to-blue-500/30 text-cyan-400 border border-cyan-400/30'
                                : 'text-slate-400 hover:text-white hover:bg-slate-600/50'
                                }`}
                            >
                              Q{quarter}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="text-sm text-slate-400">
                        {(() => {
                          const quarterEndDates = { 1: '31/03', 2: '30/06', 3: '30/09', 4: '31/12' };
                          const endDate = quarterEndDates[selectedQuarter as keyof typeof quarterEndDates];
                          return `Kết thúc: ${endDate}/${selectedYear}`;
                        })()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Capital Structure Ratios */}
                <div>
                  <h5 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Chỉ tiêu cơ cấu nguồn vốn (Capital Structure)
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-600/50">
                      <div className="text-sm text-slate-400 mb-2">Nợ ngắn + dài hạn / VCSH</div>
                      <div className="text-xl font-bold text-emerald-400 mb-1">
                        {ratios.totalDebtToEquity.toFixed(2)}x
                      </div>
                      <div className="text-xs text-slate-500">(ST+LT borrowings)/Equity</div>
                    </div>

                    <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-600/50">
                      <div className="text-sm text-slate-400 mb-2">Tỷ lệ Nợ/Vốn (D/E)</div>
                      <div className="text-xl font-bold text-blue-400 mb-1">
                        {ratios.debtToEquity.toFixed(2)}x
                      </div>
                      <div className="text-xs text-slate-500">Debt/Equity</div>
                    </div>

                    <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-600/50">
                      <div className="text-sm text-slate-400 mb-2">TSCĐ / VCSH</div>
                      <div className="text-xl font-bold text-purple-400 mb-1">
                        {ratios.fixedAssetToEquity.toFixed(2)}x
                      </div>
                      <div className="text-xs text-slate-500">Fixed Asset-To-Equity</div>
                    </div>

                    <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-600/50">
                      <div className="text-sm text-slate-400 mb-2">VCSH / Vốn điều lệ</div>
                      <div className="text-xl font-bold text-cyan-400 mb-1">
                        {ratios.equityToCharterCapital.toFixed(2)}x
                      </div>
                      <div className="text-xs text-slate-500">Owners' Equity/Charter Capital</div>
                    </div>
                  </div>
                </div>

                {/* Efficiency Ratios */}
                <div>
                  <h5 className="text-lg font-bold text-orange-400 mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Chỉ tiêu hiệu quả hoạt động (Operating Efficiency)
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-600/50">
                      <div className="text-sm text-slate-400 mb-2">Vòng quay tài sản</div>
                      <div className="text-xl font-bold text-orange-400 mb-1">
                        {ratios.assetTurnover.toFixed(2)}x
                      </div>
                      <div className="text-xs text-slate-500">Asset Turnover</div>
                    </div>

                    <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-600/50">
                      <div className="text-sm text-slate-400 mb-2">Vòng quay TSCĐ</div>
                      <div className="text-xl font-bold text-blue-400 mb-1">
                        {ratios.fixedAssetTurnover.toFixed(2)}x
                      </div>
                      <div className="text-xs text-slate-500">Fixed Asset Turnover</div>
                    </div>

                    <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-600/50">
                      <div className="text-sm text-slate-400 mb-2">Số ngày phải thu BQ</div>
                      <div className="text-xl font-bold text-emerald-400 mb-1">
                        {Math.round(ratios.daysSalesOutstanding)} ngày
                      </div>
                      <div className="text-xs text-slate-500">Days Sales Outstanding</div>
                    </div>

                    <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-600/50">
                      <div className="text-sm text-slate-400 mb-2">Số ngày tồn kho BQ</div>
                      <div className="text-xl font-bold text-purple-400 mb-1">
                        {Math.round(ratios.daysInventoryOutstanding)} ngày
                      </div>
                      <div className="text-xs text-slate-500">Days Inventory Outstanding</div>
                    </div>

                    <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-600/50">
                      <div className="text-sm text-slate-400 mb-2">Số ngày phải trả BQ</div>
                      <div className="text-xl font-bold text-cyan-400 mb-1">
                        {Math.round(ratios.daysPayableOutstanding)} ngày
                      </div>
                      <div className="text-xs text-slate-500">Days Payable Outstanding</div>
                    </div>

                    <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-600/50">
                      <div className="text-sm text-slate-400 mb-2">Chu kỳ chuyển đổi tiền</div>
                      {/* <div className={`text-xl font-bold mb-1 ${ratios.cashCycle < 50 ? 'text-emerald-400' : ratios.cashCycle < 90 ? 'text-yellow-400' : 'text-red-400'}`}>
                                    {Math.round(ratios.cashCycle)} ngày
                                  </div> */}
                      <div className="text-xs text-slate-500">Cash Cycle</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4">
                    <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-600/50">
                      <div className="text-sm text-slate-400 mb-2">Vòng quay hàng tồn kho</div>
                      <div className="text-xl font-bold text-indigo-400 mb-1">
                        {ratios.inventoryTurnover.toFixed(2)}x
                      </div>
                      <div className="text-xs text-slate-500">Inventory Turnover</div>
                    </div>
                  </div>
                </div>

                {/* Profitability Ratios */}
                <div>
                  <h5 className="text-lg font-bold text-green-400 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Chỉ tiêu khả năng sinh lợi (Profitability)
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-600/50">
                      <div className="text-sm text-slate-400 mb-2">Biên lợi nhuận EBIT</div>
                      <div className="text-xl font-bold text-green-400 mb-1">
                        {ratios.ebitMargin.toFixed(1)}%
                      </div>
                      <div className="text-xs text-slate-500">EBIT Margin (%)</div>
                    </div>

                    <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-600/50">
                      <div className="text-sm text-slate-400 mb-2">Biên lợi nhuận gộp</div>
                      <div className="text-xl font-bold text-emerald-400 mb-1">
                        {ratios.grossProfitMargin.toFixed(1)}%
                      </div>
                      <div className="text-xs text-slate-500">Gross Profit Margin (%)</div>
                    </div>

                    <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-600/50">
                      <div className="text-sm text-slate-400 mb-2">Biên lợi nhuận ròng</div>
                      <div className="text-xl font-bold text-blue-400 mb-1">
                        {ratios.netProfitMargin.toFixed(1)}%
                      </div>
                      <div className="text-xs text-slate-500">Net Profit Margin (%)</div>
                    </div>

                    <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-600/50">
                      <div className="text-sm text-slate-400 mb-2">Tỷ suất LN trên VCSH</div>
                      <div className="text-xl font-bold text-purple-400 mb-1">
                        {ratios.roe.toFixed(1)}%
                      </div>
                      <div className="text-xs text-slate-500">ROE (%)</div>
                    </div>

                    <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-600/50">
                      <div className="text-sm text-slate-400 mb-2">Tỷ suất LN trên vốn ĐT</div>
                      <div className="text-xl font-bold text-cyan-400 mb-1">
                        {ratios.roic.toFixed(1)}%
                      </div>
                      <div className="text-xs text-slate-500">ROIC (%)</div>
                    </div>

                    <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-600/50">
                      <div className="text-sm text-slate-400 mb-2">Tỷ suất LN trên tổng TS</div>
                      <div className="text-xl font-bold text-orange-400 mb-1">
                        {ratios.roa.toFixed(1)}%
                      </div>
                      <div className="text-xs text-slate-500">ROA (%)</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-600/50">
                      <div className="text-sm text-slate-400 mb-2">EBITDA</div>
                      <div className="text-xl font-bold text-green-400 mb-1">
                        {formatVND(financialData.ebitda)}
                      </div>
                      <div className="text-xs text-slate-500">EBITDA (Bn. VND)</div>
                    </div>

                    <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-600/50">
                      <div className="text-sm text-slate-400 mb-2">EBIT</div>
                      <div className="text-xl font-bold text-emerald-400 mb-1">
                        {formatVND(financialData.ebit)}
                      </div>
                      <div className="text-xs text-slate-500">EBIT (Bn. VND)</div>
                    </div>

                    <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-600/50">
                      <div className="text-sm text-slate-400 mb-2">Tỷ suất cổ tức</div>
                      <div className="text-xl font-bold text-blue-400 mb-1">
                        {ratios.dividendYield.toFixed(1)}%
                      </div>
                      <div className="text-xs text-slate-500">Dividend yield (%)</div>
                    </div>
                  </div>
                </div>

                {/* Liquidity Ratios */}
                <div>
                  <h5 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2">
                    <Waves className="w-5 h-5" />
                    Chỉ tiêu thanh khoản (Liquidity)
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-600/50">
                      <div className="text-sm text-slate-400 mb-2">Hệ số TT hiện hành</div>
                      <div className="text-xl font-bold text-blue-400 mb-1">
                        {ratios.currentRatio.toFixed(2)}x
                      </div>
                      <div className="text-xs text-slate-500">Current Ratio</div>
                    </div>

                    <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-600/50">
                      <div className="text-sm text-slate-400 mb-2">Hệ số TT tiền mặt</div>
                      <div className="text-xl font-bold text-cyan-400 mb-1">
                        {ratios.cashRatio.toFixed(2)}x
                      </div>
                      <div className="text-xs text-slate-500">Cash Ratio</div>
                    </div>

                    <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-600/50">
                      <div className="text-sm text-slate-400 mb-2">Hệ số TT nhanh</div>
                      <div className="text-xl font-bold text-emerald-400 mb-1">
                        {ratios.quickRatio.toFixed(2)}x
                      </div>
                      <div className="text-xs text-slate-500">Quick Ratio</div>
                    </div>

                    <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-600/50">
                      <div className="text-sm text-slate-400 mb-2">Khả năng TT lãi vay</div>
                      <div className="text-xl font-bold text-purple-400 mb-1">
                        {ratios.interestCoverage.toFixed(1)}x
                      </div>
                      <div className="text-xs text-slate-500">Interest Coverage</div>
                    </div>

                    <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-600/50">
                      <div className="text-sm text-slate-400 mb-2">Đòn bẩy tài chính</div>
                      <div className="text-xl font-bold text-orange-400 mb-1">
                        {ratios.financialLeverage.toFixed(2)}x
                      </div>
                      <div className="text-xs text-slate-500">Financial Leverage</div>
                    </div>
                  </div>
                </div>

                {/* Valuation Ratios */}
                <div>
                  <h5 className="text-lg font-bold text-yellow-400 mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Chỉ tiêu định giá (Valuation)
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-600/50">
                      <div className="text-sm text-slate-400 mb-2">Vốn hóa thị trường</div>
                      <div className="text-xl font-bold text-yellow-400 mb-1">
                        {formatVND(financialData.marketCap)}
                      </div>
                      <div className="text-xs text-slate-500">Market Capital (Bn. VND)</div>
                    </div>

                    <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-600/50">
                      <div className="text-sm text-slate-400 mb-2">Số CP lưu hành</div>
                      <div className="text-xl font-bold text-cyan-400 mb-1">
                        {(financialData.outstandingShares / 1000000).toFixed(1)}M
                      </div>
                      <div className="text-xs text-slate-500">Outstanding Share (Mil. Shares)</div>
                    </div>

                    <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-600/50">
                      <div className="text-sm text-slate-400 mb-2">Chỉ số P/E</div>
                      <div className="text-xl font-bold text-blue-400 mb-1">
                        {ratios.pe.toFixed(1)}x
                      </div>
                      <div className="text-xs text-slate-500">P/E</div>
                    </div>

                    <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-600/50">
                      <div className="text-sm text-slate-400 mb-2">Chỉ số P/B</div>
                      <div className="text-xl font-bold text-emerald-400 mb-1">
                        {ratios.pb.toFixed(1)}x
                      </div>
                      <div className="text-xs text-slate-500">P/B</div>
                    </div>

                    <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-600/50">
                      <div className="text-sm text-slate-400 mb-2">Chỉ số P/S</div>
                      <div className="text-xl font-bold text-purple-400 mb-1">
                        {ratios.ps.toFixed(1)}x
                      </div>
                      <div className="text-xs text-slate-500">P/S</div>
                    </div>

                    <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-600/50">
                      <div className="text-sm text-slate-400 mb-2">Chỉ số P/Cash Flow</div>
                      <div className="text-xl font-bold text-orange-400 mb-1">
                        {ratios.pCashFlow.toFixed(1)}x
                      </div>
                      <div className="text-xs text-slate-500">P/Cash Flow</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4">
                    <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-600/50">
                      <div className="text-sm text-slate-400 mb-2">Lãi cơ bản trên cổ phiếu</div>
                      <div className="text-xl font-bold text-indigo-400 mb-1">
                        ₫{Math.round(financialData.eps).toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-500">EPS (VND)</div>
                    </div>
                  </div>
                </div>

                {/* Ratio Summary & Insights */}
                <div className="p-6 bg-gradient-to-r from-slate-900/80 to-slate-800/60 rounded-xl border border-slate-500/50">
                  <h5 className="font-semibold text-white mb-4 flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    Đánh giá tổng quan chỉ số tài chính (Financial Ratios Summary)
                  </h5>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h6 className="font-medium text-emerald-400">Điểm mạnh (Strengths)</h6>
                      <ul className="space-y-2 text-sm text-slate-300">
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span>Tỷ suất sinh lời ROE cao {ratios.roe.toFixed(1)}% cho thấy hiệu quả sử dụng vốn tốt</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span>Khả năng thanh toán lãi vay mạnh với hệ số {ratios.interestCoverage.toFixed(1)}x</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span>Tỷ lệ thanh khoản hiện hành ổn định tại {ratios.currentRatio.toFixed(2)}x</span>
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <h6 className="font-medium text-orange-400">Cần chú ý (Areas to Watch)</h6>
                      <ul className="space-y-2 text-sm text-slate-300">
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                          {/* <span>Chu kỳ chuyển đổi tiền mặt {Math.round(ratios.cashCycle)} ngày cần tối ưu hóa</span> */}
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span>Đòn bẩy tài chính {ratios.financialLeverage.toFixed(2)}x cần kiểm soát rủi ro</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span>P/E ratio {ratios.pe.toFixed(1)}x so với ngành cần theo dõi</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </CardContent>
      </Card>
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
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "white",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "white",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "white",
                        },
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
                <Badge className="bg-cyan-500/20 text-cyan-400 px-3 py-1">
                  Báo cáo {year ?? "—"}
                </Badge>
                <Badge className="bg-emerald-500/20 text-emerald-400 px-3 py-1">
                  Đã kiểm toán
                </Badge>
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
              <div className="text-3xl font-bold text-white mb-1">
                {fmtBnVND(ocfSum)}
              </div>
              <div className={`text-sm ${yoyClass(ocfYoy)} mb-1`}>
                YoY {fmtYoY(ocfYoy)}
              </div>
              <div className="text-xs text-slate-300">OCF (tổng năm)</div>
            </div>

            <div className="p-5 bg-gradient-to-br from-blue-500/15 to-blue-600/5 rounded-xl border border-blue-400/30">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-blue-400">Dòng tiền Đầu tư</h4>
                <TrendingDown className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {fmtBnVND(invSum)}
              </div>
              <div className={`text-sm ${yoyClass(invYoy)} mb-1`}>
                YoY {fmtYoY(invYoy)}
              </div>
              <div className="text-xs text-slate-300">
                Investing CF (tổng năm)
              </div>
            </div>

            <div className="p-5 bg-gradient-to-br from-purple-500/15 to-purple-600/5 rounded-xl border border-purple-400/30">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-purple-400">
                  Dòng tiền Tài chính
                </h4>
                <Activity className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {fmtBnVND(finSum)}
              </div>
              <div className={`text-sm ${yoyClass(finYoy)} mb-1`}>
                YoY {fmtYoY(finYoy)}
              </div>
              <div className="text-xs text-slate-300">
                Financing CF (tổng năm)
              </div>
            </div>

            <div className="p-5 bg-gradient-to-br from-cyan-500/15 to-cyan-600/5 rounded-xl border border-cyan-400/30">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-cyan-400">
                  Tiền & TĐT cuối kỳ
                </h4>
                <Wallet className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {fmtBnVND(cashEnd ?? null)}
              </div>
              <div className={`text-sm ${yoyClass(cashEndYoY)} mb-1`}>
                YoY {fmtYoY(cashEndYoY)}
              </div>
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
              <div className="text-sm text-slate-400">
                Đơn vị: Tỷ VND | Dữ liệu theo quý
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-600/40">
              <table className="w-full text-sm border-collapse bg-slate-900/20">
                <thead>
                  <tr className="border-b-2 border-slate-600/60 bg-slate-800/50">
                    <th className="text-left p-4 text-slate-200 font-semibold min-w-[300px]">
                      Khoản mục
                    </th>
                    <th className="text-right p-4 text-slate-200 font-semibold w-[100px]">
                      Quý 1
                    </th>
                    <th className="text-right p-4 text-slate-200 font-semibold w-[100px]">
                      Quý 2
                    </th>
                    <th className="text-right p-4 text-slate-200 font-semibold w-[100px]">
                      Quý 3
                    </th>
                    <th className="text-right p-4 text-slate-200 font-semibold w-[100px]">
                      Quý 4
                    </th>
                    <th className="text-right p-4 text-slate-200 font-semibold w-[100px]">
                      % YoY
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {/* I. OPERATING */}
                  <tr className="bg-emerald-500/8 border-b border-emerald-400/20">
                    <td
                      className="p-4 font-bold text-emerald-400 text-base"
                      colSpan={6}
                    >
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
                    <td
                      className="p-4 font-bold text-blue-400 text-base"
                      colSpan={6}
                    >
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
                    <td
                      className="p-4 font-bold text-purple-400 text-base"
                      colSpan={6}
                    >
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
                    <td
                      className="p-4 font-bold text-cyan-400 text-base"
                      colSpan={6}
                    >
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
                  <span className="text-emerald-400 font-bold mt-1 text-lg">
                    •
                  </span>
                  <div>
                    <strong className="text-white">OCF tích cực:</strong>
                    <p className="text-slate-300 mt-1">
                      Tổng OCF năm {year ?? "—"}: {fmtBnVND(ocfSum)} (
                      {fmtYoY(ocfYoy)} YoY)
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3 p-3 bg-emerald-500/10 rounded-lg">
                  <span className="text-emerald-400 font-bold mt-1 text-lg">
                    •
                  </span>
                  <div>
                    <strong className="text-white">Tiền mặt cuối kỳ:</strong>
                    <p className="text-slate-300 mt-1">
                      Cuối quý {latestQ ?? "—"} năm {year ?? "—"}:{" "}
                      {fmtBnVND(cashEnd)} ({fmtYoY(cashEndYoY)} YoY)
                    </p>
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
                  <span className="text-yellow-400 font-bold mt-1 text-lg">
                    •
                  </span>
                  <div>
                    <strong className="text-white">Dòng tiền đầu tư:</strong>
                    <p className="text-slate-300 mt-1">
                      Tổng HĐĐT năm {year ?? "—"}: {fmtBnVND(invSum)} (
                      {fmtYoY(invYoy)} YoY)
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3 p-3 bg-yellow-500/10 rounded-lg">
                  <span className="text-yellow-400 font-bold mt-1 text-lg">
                    •
                  </span>
                  <div>
                    <strong className="text-white">Dòng tiền tài chính:</strong>
                    <p className="text-slate-300 mt-1">
                      Tổng HĐTC năm {year ?? "—"}: {fmtBnVND(finSum)} (
                      {fmtYoY(finYoy)} YoY)
                    </p>
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
                <div className="text-2xl font-bold text-emerald-400 mb-1">
                  {fmtBnVND(ocfSum)}
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-400 text-xs">
                  YoY {fmtYoY(ocfYoy)}
                </Badge>
              </div>
              <div className="text-center p-4 bg-slate-700/40 rounded-lg">
                <div className="text-slate-400 mb-2 text-sm">HĐĐT (năm)</div>
                <div className="text-2xl font-bold text-blue-400 mb-1">
                  {fmtBnVND(invSum)}
                </div>
                <Badge className="bg-blue-500/20 text-blue-400 text-xs">
                  YoY {fmtYoY(invYoy)}
                </Badge>
              </div>
              <div className="text-center p-4 bg-slate-700/40 rounded-lg">
                <div className="text-slate-400 mb-2 text-sm">HĐTC (năm)</div>
                <div className="text-2xl font-bold text-purple-400 mb-1">
                  {fmtBnVND(finSum)}
                </div>
                <Badge className="bg-purple-500/20 text-purple-400 text-xs">
                  YoY {fmtYoY(finYoy)}
                </Badge>
              </div>
              <div className="text-center p-4 bg-slate-700/40 rounded-lg">
                <div className="text-slate-400 mb-2 text-sm">Tiền cuối kỳ</div>
                <div className="text-2xl font-bold text-cyan-400 mb-1">
                  {fmtBnVND(cashEnd)}
                </div>
                <Badge className="bg-cyan-500/20 text-cyan-400 text-xs">
                  YoY {fmtYoY(cashEndYoY)}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Card>
  );
}
