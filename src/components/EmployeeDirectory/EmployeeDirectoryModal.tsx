import React, { useState } from 'react';
import {
  Users,
  Search,
  X,
  MapPin,
  Sparkles,
  PlusCircle,
  Sun,
  ArrowUpCircle,
  Monitor,
  VolumeX,
  Building,
  UserCheck,
  UserX,
  ExternalLink
} from 'lucide-react';
import { useSeating } from '../../context/SeatingContext';
import { Department, Employee } from '../../types';

const DEPARTMENTS: Department[] = [
  'Engineering',
  'Design',
  'Product',
  'Marketing',
  'Sales',
  'HR',
  'Finance',
  'Operations',
  'Executive',
];

export const EmployeeDirectoryModal: React.FC = () => {
  const {
    employees,
    floors,
    isEmployeeDirectoryOpen,
    setIsEmployeeDirectoryOpen,
    setIsAddEmployeeOpen,
    setActiveFloorId,
    setHighlightedDeskIds,
    vacateSeat,
    setSelectedDeskId,
  } = useSeating();

  const [search, setSearch] = useState<string>('');
  const [deptFilter, setDeptFilter] = useState<Department | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Seated' | 'Unassigned'>('All');

  if (!isEmployeeDirectoryOpen) return null;

  const filteredEmployees = employees.filter((emp) => {
    if (deptFilter !== 'All' && emp.department !== deptFilter) return false;
    if (statusFilter === 'Seated' && !emp.deskId) return false;
    if (statusFilter === 'Unassigned' && emp.deskId) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        emp.name.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q) ||
        emp.role.toLowerCase().includes(q) ||
        emp.department.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleLocateOnMap = (emp: Employee) => {
    if (emp.floorId && emp.deskId) {
      setActiveFloorId(emp.floorId);
      setHighlightedDeskIds([emp.deskId]);
      setSelectedDeskId(emp.deskId);
      setIsEmployeeDirectoryOpen(false);
      setTimeout(() => setHighlightedDeskIds([]), 3500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-5xl h-[85vh] rounded-3xl bg-slate-900 border border-white/15 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-['Outfit']">Staff Directory & Seating Matrix</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono">
                  {employees.length} Total Members
                </span>
              </div>
              <p className="text-xs text-slate-400">View desk allocations, roles, preferences, and reassign personnel</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsEmployeeDirectoryOpen(false);
                setIsAddEmployeeOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Employee</span>
            </button>
            <button
              onClick={() => setIsEmployeeDirectoryOpen(false)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 border-b border-white/10 bg-slate-950/40 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, role, or department..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value as any)}
              className="px-3 py-2 text-xs rounded-xl bg-slate-900 border border-white/10 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Departments</option>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>

            <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setStatusFilter('All')}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                  statusFilter === 'All' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All ({employees.length})
              </button>
              <button
                onClick={() => setStatusFilter('Seated')}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                  statusFilter === 'Seated' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Seated ({employees.filter(e => e.deskId).length})
              </button>
              <button
                onClick={() => setStatusFilter('Unassigned')}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                  statusFilter === 'Unassigned' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Bench ({employees.filter(e => !e.deskId).length})
              </button>
            </div>
          </div>
        </div>

        {/* Directory Table */}
        <div className="flex-1 overflow-y-auto p-4">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-950/60 sticky top-0 z-10 border-b border-white/10">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Department & Role</th>
                <th className="py-3 px-4">Current Desk</th>
                <th className="py-3 px-4">Preferences</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredEmployees.map((emp) => {
                const desk = floors.flatMap(f => f.desks).find(d => d.id === emp.deskId);
                return (
                  <tr key={emp.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={emp.avatar}
                          alt={emp.name}
                          className="w-9 h-9 rounded-xl object-cover ring-1 ring-white/20"
                        />
                        <div>
                          <div className="font-bold text-white text-sm">{emp.name}</div>
                          <div className="text-[11px] text-slate-400">{emp.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-slate-200">{emp.role}</span>
                        <span className="text-[10px] w-fit px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                          {emp.department}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      {desk ? (
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg text-xs">
                            {desk.code}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            (Floor {desk.floorId})
                          </span>
                        </div>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-semibold">
                          Unassigned (Bench)
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {emp.preferences?.wantsWindow && (
                          <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-amber-300">
                            <Sun className="w-2.5 h-2.5" /> Window
                          </span>
                        )}
                        {emp.preferences?.wantsStandingDesk && (
                          <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-blue-300">
                            <ArrowUpCircle className="w-2.5 h-2.5" /> Standing
                          </span>
                        )}
                        {emp.preferences?.wantsDualMonitors && (
                          <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-purple-300">
                            <Monitor className="w-2.5 h-2.5" /> Dual
                          </span>
                        )}
                        {emp.preferences?.prefersQuietZone && (
                          <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-emerald-300">
                            <VolumeX className="w-2.5 h-2.5" /> Quiet
                          </span>
                        )}
                        {!emp.preferences?.wantsWindow && !emp.preferences?.wantsStandingDesk && !emp.preferences?.wantsDualMonitors && (
                          <span className="text-[10px] text-slate-500">Standard</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {emp.deskId ? (
                          <>
                            <button
                              onClick={() => handleLocateOnMap(emp)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/30 text-xs transition-all"
                              title="Locate Desk on Canvas"
                            >
                              <MapPin className="w-3 h-3" />
                              <span>Locate</span>
                            </button>
                            <button
                              onClick={() => vacateSeat(emp.id, 'Admin Directory')}
                              className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/30 text-rose-400 border border-rose-500/20 text-xs transition-all"
                              title="Vacate Seat"
                            >
                              Vacate
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-amber-400/80 italic">
                            Drag from bench
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};
