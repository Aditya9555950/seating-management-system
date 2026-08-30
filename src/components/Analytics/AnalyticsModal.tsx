import React from 'react';
import { X, BarChart3, Building, Users, Sparkles, TrendingUp, Monitor, Sun, ArrowUpCircle } from 'lucide-react';
import { useSeating } from '../../context/SeatingContext';
import { Department } from '../../types';

export const AnalyticsModal: React.FC = () => {
  const { isAnalyticsOpen, setIsAnalyticsOpen, floors, employees } = useSeating();

  if (!isAnalyticsOpen) return null;

  const allDesks = floors.flatMap(f => f.desks);
  const totalDesks = allDesks.length;
  const occupiedDesks = allDesks.filter(d => d.status === 'occupied').length;
  const availableDesks = allDesks.filter(d => d.status === 'available').length;
  const maintenanceDesks = allDesks.filter(d => d.status === 'maintenance' || d.status === 'reserved').length;
  const overallOccupancyPct = totalDesks > 0 ? Math.round((occupiedDesks / totalDesks) * 100) : 0;

  // Department counts
  const deptCounts: Record<string, number> = {};
  employees.forEach(e => {
    deptCounts[e.department] = (deptCounts[e.department] || 0) + 1;
  });

  // Amenity counts
  const standingDesks = allDesks.filter(d => d.amenities.includes('standing_desk')).length;
  const windowDesks = allDesks.filter(d => d.amenities.includes('window_view')).length;
  const dualMonitors = allDesks.filter(d => d.amenities.includes('dual_monitors')).length;
  const quietPods = allDesks.filter(d => d.amenities.includes('quiet_pod')).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-3xl rounded-3xl bg-slate-900 border border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-['Outfit']">Workspace Analytics & Space Density</h3>
              <p className="text-xs text-slate-400">Real-time office utilization, capacity metrics, and department distribution</p>
            </div>
          </div>
          <button
            onClick={() => setIsAnalyticsOpen(false)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* Top KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 flex flex-col justify-between">
              <span className="text-xs text-slate-400 font-medium">Overall Occupancy</span>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-2xl font-extrabold text-blue-400 font-['Outfit']">{overallOccupancyPct}%</span>
                <span className="text-[10px] text-slate-500 font-mono">density</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: `${overallOccupancyPct}%` }} />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 flex flex-col justify-between">
              <span className="text-xs text-slate-400 font-medium">Total Desks</span>
              <div className="text-2xl font-extrabold text-white font-['Outfit'] mt-2">{totalDesks}</div>
              <span className="text-[10px] text-slate-400 mt-2">Across 3 floors</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 flex flex-col justify-between">
              <span className="text-xs text-slate-400 font-medium">Available Seats</span>
              <div className="text-2xl font-extrabold text-emerald-400 font-['Outfit'] mt-2">{availableDesks}</div>
              <span className="text-[10px] text-emerald-400/80 mt-2">Ready for allocation</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 flex flex-col justify-between">
              <span className="text-xs text-slate-400 font-medium">Unassigned Staff</span>
              <div className="text-2xl font-extrabold text-amber-400 font-['Outfit'] mt-2">
                {employees.filter(e => !e.deskId).length}
              </div>
              <span className="text-[10px] text-amber-400/80 mt-2">On bench pool</span>
            </div>
          </div>

          {/* Floor-by-Floor Breakdown */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-400" /> Floor Capacity & Utilization
            </h4>
            <div className="space-y-3">
              {floors.map(floor => {
                const fOccupied = floor.desks.filter(d => d.status === 'occupied').length;
                const fTotal = floor.desks.length;
                const fPct = Math.round((fOccupied / fTotal) * 100);

                return (
                  <div key={floor.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">{floor.name}</span>
                      <span className="text-slate-400 font-mono">
                        {fOccupied} / {fTotal} seats ({fPct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          fPct > 80 ? 'bg-rose-500' : fPct > 50 ? 'bg-blue-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${fPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Department Headcount & Amenity Coverage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Department Breakdown */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-purple-400" /> Department Distribution
              </h4>
              <div className="space-y-1.5 max-h-44 overflow-y-auto">
                {Object.entries(deptCounts).map(([dept, count]) => (
                  <div key={dept} className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-slate-900">
                    <span className="text-slate-300 font-medium">{dept}</span>
                    <span className="text-blue-400 font-bold font-mono">{count} members</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenity Breakdown */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" /> Desk Amenities Inventory
              </h4>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs py-1.5 px-2 rounded-lg bg-slate-900">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <Sun className="w-3.5 h-3.5 text-amber-400" /> Window View Desks
                  </span>
                  <span className="text-amber-400 font-bold font-mono">{windowDesks} desks</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1.5 px-2 rounded-lg bg-slate-900">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <ArrowUpCircle className="w-3.5 h-3.5 text-blue-400" /> Standing Desks
                  </span>
                  <span className="text-blue-400 font-bold font-mono">{standingDesks} desks</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1.5 px-2 rounded-lg bg-slate-900">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <Monitor className="w-3.5 h-3.5 text-purple-400" /> Dual Monitor Setups
                  </span>
                  <span className="text-purple-400 font-bold font-mono">{dualMonitors} desks</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1.5 px-2 rounded-lg bg-slate-900">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Quiet Focus Pods
                  </span>
                  <span className="text-emerald-400 font-bold font-mono">{quietPods} desks</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
