import { Badge } from "./ui/badge";
import { CheckCircle, Gavel } from "lucide-react";

interface LegalComplianceProps {
  legalData: any;
}

export function LegalCompliance({ legalData }: LegalComplianceProps) {
  return (
    <div className="bg-slate-800/60 border border-blue-400/30 rounded-xl p-6">
      <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
        <Gavel className="w-5 h-5" />
        Thông tin pháp lý & tuân thủ
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <div className="text-slate-400 text-sm mb-3">Giấy phép hoạt động:</div>
            <div className="space-y-3">
              {legalData.licenses.map((license: any, index: number) => (
                <div key={index} className="p-4 bg-slate-700/30 rounded-xl border border-slate-400/20">
                  <div className="font-medium text-white mb-2">{license.type}</div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Số:</span>
                      <div className="font-semibold text-slate-300">{license.number}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Hiệu lực:</span>
                      <div className="font-semibold text-slate-300">{license.validUntil}</div>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400">Cơ quan cấp:</span>
                      <div className="font-semibold text-slate-300">{license.issuer}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="text-slate-400 text-sm mb-3">Tuân thủ quốc tế:</div>
            <div className="space-y-2">
              {Object.entries(legalData.compliance).map(([key, value], index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-400/20">
                  <span className="text-slate-300 font-medium">{key.toUpperCase()}</span>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-400/50 border">
                    {value as string}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-4 bg-slate-700/30 rounded-xl border border-slate-400/20">
            <div className="text-slate-400 text-sm mb-2">Vấn đề pháp lý:</div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-slate-300">{legalData.legalIssues}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}