import { Badge } from "./ui/badge";
import { Shield } from "lucide-react";

interface RiskAssessmentProps {
  riskData: any;
}

export function RiskAssessment({ riskData }: RiskAssessmentProps) {
  return (
    <div className="bg-slate-800/60 border border-blue-400/30 rounded-xl p-6">
      <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
        <Shield className="w-5 h-5" />
        Đánh giá rủi ro
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-slate-700/30 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-white">Rủi ro tín dụng</h4>
            <Badge className={`${riskData.creditRisk.level === 'Thấp' ? 'bg-emerald-500/20 text-emerald-400' : riskData.creditRisk.level === 'Trung bình' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'} border-0`}>
              {riskData.creditRisk.level}
            </Badge>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">NPL Ratio:</span>
              <span className="text-emerald-400 font-medium">{riskData.creditRisk.nplRatio}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Provision Coverage:</span>
              <span className="text-emerald-400 font-medium">{riskData.creditRisk.provisionCoverage}</span>
            </div>
          </div>
          <p className="text-xs text-slate-300 mt-3">{riskData.creditRisk.description}</p>
        </div>

        <div className="p-4 bg-slate-700/30 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-white">Rủi ro thị trường</h4>
            <Badge className={`${riskData.marketRisk.level === 'Thấp' ? 'bg-emerald-500/20 text-emerald-400' : riskData.marketRisk.level === 'Trung bình' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'} border-0`}>
              {riskData.marketRisk.level}
            </Badge>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">VaR:</span>
              <span className="text-yellow-400 font-medium">{riskData.marketRisk.var}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Độ nhạy:</span>
              <span className="text-yellow-400 font-medium">{riskData.marketRisk.sensitivity}</span>
            </div>
          </div>
          <p className="text-xs text-slate-300 mt-3">{riskData.marketRisk.description}</p>
        </div>

        <div className="p-4 bg-slate-700/30 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-white">Rủi ro vận hành</h4>
            <Badge className={`${riskData.operationalRisk.level === 'Thấp' ? 'bg-emerald-500/20 text-emerald-400' : riskData.operationalRisk.level === 'Trung bình' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'} border-0`}>
              {riskData.operationalRisk.level}
            </Badge>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Cyber Security:</span>
              <span className="text-emerald-400 font-medium">{riskData.operationalRisk.cyberSecurity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Compliance:</span>
              <span className="text-emerald-400 font-medium">{riskData.operationalRisk.compliance}</span>
            </div>
          </div>
          <p className="text-xs text-slate-300 mt-3">{riskData.operationalRisk.description}</p>
        </div>

        <div className="p-4 bg-slate-700/30 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-white">Rủi ro thanh khoản</h4>
            <Badge className={`${riskData.liquidityRisk.level === 'Thấp' ? 'bg-emerald-500/20 text-emerald-400' : riskData.liquidityRisk.level === 'Trung bình' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'} border-0`}>
              {riskData.liquidityRisk.level}
            </Badge>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">LDR:</span>
              <span className="text-emerald-400 font-medium">{riskData.liquidityRisk.ldr}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Liquidity Buffer:</span>
              <span className="text-emerald-400 font-medium">{riskData.liquidityRisk.liquidityBuffer}</span>
            </div>
          </div>
          <p className="text-xs text-slate-300 mt-3">{riskData.liquidityRisk.description}</p>
        </div>
      </div>
    </div>
  );
}