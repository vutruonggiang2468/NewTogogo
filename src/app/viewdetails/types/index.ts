import type { stockDatabase } from "@/constants/stockDatabase";

export type StockAnalysis = (typeof stockDatabase)[keyof typeof stockDatabase];

export interface IndustryInfo {
  readonly name: string;
  readonly updated_at?: string | null;
}

export interface CompanyEvent {
  readonly event_title?: string;
  readonly issue_date?: string | null;
  readonly public_date?: string | null;
  readonly source_url?: string | null;
}

export interface CompanyOfficer {
  readonly officer_name: string;
  readonly position_short_name?: string | null;
  readonly officer_position?: string | null;
  readonly officer_owner_percent?: number;
  readonly updated_at?: string;
}

export interface CompanyShareholder {
  readonly share_holder: string;
  readonly share_own_percent: number;
}

export interface CompanySubsidiary {
  readonly company_name: string;
  readonly sub_own_percent: number;
}

export interface NewsItem {
  readonly type?: string;
  readonly priority?: string;
  readonly category?: string;
  readonly title: string;
  readonly public_date: number;
  readonly price_change_pct?: number;
  readonly news_source_link?: string | null;
}

export interface CompanyInfo {
  readonly company_name: string;
  readonly history?: string;
  readonly company_profile?: string;
  readonly industry?: string;
  readonly website?: string;
  readonly no_employees?: number | string;
  readonly charter_capital?: number | string;
  readonly financial_ratio_issue_share?: number | string;
  readonly events?: CompanyEvent[];
  readonly officers?: CompanyOfficer[];
  readonly shareholders?: CompanyShareholder[];
  readonly subsidiaries?: CompanySubsidiary[];
  readonly news?: NewsItem[];
}

export interface SymbolIndustryData {
  readonly industries?: IndustryInfo[];
  name: string;
  exchange?: string;
  company?: CompanyInfo | CompanyInfo[];
}

export interface BalanceSheetEntry {
  readonly year: number;
  readonly quarter: number;
  readonly symbol?: { exchange?: string };
  readonly total_assets?: number | null;
  readonly current_assets?: number | null;
  readonly long_term_assets?: number | null;
  readonly liabilities?: number | null;
  readonly owners_equity?: number | null;
  readonly total_resources?: number | null;
  readonly cash_and_cash_equivalents?: number | null;
  readonly short_term_investments?: number | null;
  readonly accounts_receivable?: number | null;
  readonly net_inventories?: number | null;
  readonly prepayments_to_suppliers?: number | null;
  readonly fixed_assets?: number | null;
  readonly long_term_investments?: number | null;
  readonly long_term_prepayments?: number | null;
  readonly other_long_term_receivables?: number | null;
  readonly long_term_trade_receivables?: number | null;
  readonly current_liabilities?: number | null;
  readonly short_term_borrowings?: number | null;
  readonly advances_from_customers?: number | null;
  readonly long_term_liabilities?: number | null;
  readonly long_term_borrowings?: number | null;
  readonly paid_in_capital?: number | null;
  readonly undistributed_earnings?: number | null;
  readonly investment_and_development_funds?: number | null;
  readonly common_shares?: number | null;
  readonly [key: string]: number | string | null | undefined | { exchange?: string };
}

export interface IncomeStatementEntry {
  readonly year: number;
  readonly quarter: number;
  readonly revenue: number;
  readonly revenue_yoy: number;
  readonly net_profit_for_the_year: number;
  readonly attribute_to_parent_company: number;
  readonly attribute_to_parent_company_yoy: number;
  readonly profit_before_tax: number;
  readonly business_income_tax_current: number;
  readonly business_income_tax_deferred: number;
  readonly minority_interest: number;
  readonly net_other_income_expenses?: number;
  readonly general_admin_expenses?: number;
  readonly [key: string]: number | string | null | undefined;
}

export interface CashflowSnapshot {
  readonly net_profit_loss_before_tax?: number | string | null;
  readonly [key: string]: number | string | null | undefined;
}

export interface RatioData {
  readonly year: number;
  readonly quarter: number;
  readonly p_e?: number | null;
  readonly roe_percent?: number | null;
  readonly current_ratio?: number | null;
  readonly eps_vnd?: number | null;
  readonly [key: string]: number | string | null | undefined;
}

export interface CompanyDetails {
  readonly company?: CompanyInfo;
  readonly symbolData?: SymbolIndustryData;
  readonly incomeData?: IncomeStatementEntry[];
  readonly balanceData?: BalanceSheetEntry[];
  readonly cashflowData?: CashflowSnapshot | CashflowSnapshot[];
  readonly ratiosData?: RatioData[];
  readonly exchange?: string;
  readonly stock?: { code?: string };
  [key: string]: unknown;
}

export interface SymbolItem {
  readonly id: number;
  readonly name: string;
  readonly company?: CompanyInfo;
  readonly [key: string]: unknown;
}
