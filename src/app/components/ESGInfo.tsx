import { Badge } from "./ui/badge";
import { CheckCircle, Award, Leaf } from "lucide-react";

interface ESGInfoProps {
  esgData: any;
}

export function ESGInfo({ esgData }: ESGInfoProps) {
  return (
    <div className="bg-slate-800/60 border border-blue-400/30 rounded-xl p-6">
      <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
        <Leaf className="w-5 h-5" />
        ESG & Phát triển bền vững
        <Badge variant="outline" className="text-emerald-400 border-emerald-400/50 bg-emerald-400/10">
          {esgData.overallRating}
        </Badge>
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="text-center p-4 bg-gradient-to-br from-slate-700/30 to-emerald-500/20 rounded-xl border border-emerald-400/30">
            <div className="text-sm text-slate-400 mb-2">ESG Overall Rating</div>
            <div className="text-2xl font-bold text-emerald-400 mb-2">{esgData.overallRating}</div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <div className="text-slate-400">E</div>
                <div className="font-bold text-emerald-400">{esgData.environmentalScore}</div>
              </div>
              <div>
                <div className="text-slate-400">S</div>
                <div className="font-bold text-emerald-400">{esgData.socialScore}</div>
              </div>
              <div>
                <div className="text-slate-400">G</div>
                <div className="font-bold text-emerald-400">{esgData.governanceScore}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="text-slate-400 text-sm mb-3">Sáng kiến ESG:</div>
            <div className="space-y-2">
              {esgData.initiatives.map((initiative: string, index: number) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg border border-emerald-400/20">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-300">{initiative}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <div className="text-slate-400 text-sm mb-3">Chứng nhận:</div>
            <div className="flex flex-wrap gap-2">
              {esgData.certifications.map((cert: string, index: number) => (
                <Badge key={index} variant="outline" className="text-emerald-400 border-emerald-400/50 bg-emerald-400/10">
                  <Award className="w-3 h-3 mr-1" />
                  {cert}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}