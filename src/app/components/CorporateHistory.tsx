import { Badge } from "./ui/badge";
import { BookOpen } from "lucide-react";

interface CorporateHistoryProps {
  history: any[];
}

export function CorporateHistory({ history }: CorporateHistoryProps) {
  return (
    <div className="bg-slate-800/60 border border-blue-400/30 rounded-xl p-6">
      <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
        <BookOpen className="w-5 h-5" />
        Lịch sử phát triển
      </h3>
      
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400 to-blue-400"></div>
        
        <div className="space-y-6">
          {history.map((event, index) => (
            <div key={index} className="flex items-start gap-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm ${
                event.type === 'milestone' ? 'bg-gradient-to-br from-emerald-500 to-teal-500' :
                event.type === 'listing' ? 'bg-gradient-to-br from-blue-500 to-indigo-500' :
                event.type === 'innovation' ? 'bg-gradient-to-br from-purple-500 to-pink-500' :
                event.type === 'achievement' ? 'bg-gradient-to-br from-yellow-500 to-orange-500' :
                'bg-gradient-to-br from-slate-500 to-slate-600'
              }`}>
                {event.year.slice(-2)}
              </div>
              <div className="flex-1 pb-2">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-bold text-white">{event.event}</h4>
                  <Badge variant="outline" className={`text-xs ${
                    event.type === 'milestone' ? 'text-emerald-400 border-emerald-400/50 bg-emerald-400/10' :
                    event.type === 'listing' ? 'text-blue-400 border-blue-400/50 bg-blue-400/10' :
                    event.type === 'innovation' ? 'text-purple-400 border-purple-400/50 bg-purple-400/10' :
                    event.type === 'achievement' ? 'text-yellow-400 border-yellow-400/50 bg-yellow-400/10' :
                    'text-slate-400 border-slate-400/50 bg-slate-400/10'
                  }`}>
                    {event.year}
                  </Badge>
                </div>
                <p className="text-sm text-slate-300">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}