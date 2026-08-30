import React from 'react';
import {
  Sparkles,
  Users,
  BarChart3,
  History,
  Settings,
  RotateCcw,
  Search,
  Building2,
  PlusCircle,
  Download,
  Upload
} from 'lucide-react';
import { useSeating } from '../context/SeatingContext';
import { Department } from '../types';

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

export const Header: React.FC = () => {
  const {
    floors,
    employees,
    activeFloorId,
    setActiveFloorId,
    searchQuery,
    setSearchQuery,
    selectedDepartmentFilter,
    setSelectedDepartmentFilter,
    setIsAiDrawerOpen,
    setIsEmployeeDirectoryOpen,
    setIsAddEmployeeOpen,
    setIsSettingsOpen,
    setIsAnalyticsOpen,
    setIsAuditLogOpen,
    resetToDefaults,
    exportLayoutToJson,
    importLayoutFromJson,
    aiSettings,
  } = useSeating();

  const currentFloor = floors.find(f => f.id === activeFloorId) || floors[0];
  const occupiedDesks = currentFloor?.desks.filter(d => d.status === 'occupied').length || 0;
  const totalDesks = currentFloor?.desks.length || 0;
  const occupancyPercent = totalDesks > 0 ? Math.round((occupiedDesks / totalDesks) * 100) : 0;
  const unassignedCount = employees.filter(e => e.deskId === null).length;

  const handleExport = () => {
    const dataStr = exportLayoutToJson();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus_seating_layout_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = importLayoutFromJson(content);
        if (ok) alert('Layout imported successfully!');
        else alert('Invalid layout JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-30 px-4 lg:px-6 py-3 transition-all">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        
        {/* Left: Brand & Floor Tabs */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25 ring-1 ring-white/20">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-blue-300 bg-clip-text text-transparent font-['Outfit']">
                  NexusSeating
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  AI Workplace OS
                </span>
              </div>
              <p className="text-xs text-slate-400">Intelligent Seating & Space Management</p>
            </div>
          </div>

          <div className="h-6 w-px bg-white/10 hidden sm:block" />

          {/* Multi-Floor Switcher */}
          <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-white/10 shadow-inner">
            {floors.map((floor) => {
              const isActive = floor.id === activeFloorId;
              const fOccupied = floor.desks.filter(d => d.status === 'occupied').length;
              const fTotal = floor.desks.length;
              const fPct = Math.round((fOccupied / fTotal) * 100);

              return (
                <button
                  key={floor.id}
                  onClick={() => setActiveFloorId(floor.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <span>Floor {floor.id}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-black/30 text-blue-100' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {fPct}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center: Search & Filter */}
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search employee, desk (e.g. F1-ENG-01), role..."
              className="w-full pl-9 pr-8 py-1.5 text-xs rounded-xl bg-slate-900/90 border border-white/10 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          <select
            value={selectedDepartmentFilter}
            onChange={(e) => setSelectedDepartmentFilter(e.target.value as any)}
            className="px-2.5 py-1.5 text-xs rounded-xl bg-slate-900/90 border border-white/10 text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="All">All Teams</option>
            {DEPARTMENTS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Right: Actions & AI Trigger */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          
          {/* AI Copilot Highlighted Button */}
          <button
            onClick={() => setIsAiDrawerOpen(true)}
            className="relative group flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-semibold shadow-lg shadow-indigo-500/25 border border-white/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-300" />
            <span>AI Seating Copilot</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/20 text-white font-mono">
              {aiSettings.provider === 'local' ? 'Auto' : aiSettings.provider.toUpperCase()}
            </span>
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-500"></span>
            </span>
          </button>

          {/* Directory & Bench Button */}
          <button
            onClick={() => setIsEmployeeDirectoryOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-200 text-xs font-medium transition-all"
            title="Employee Directory & Unassigned Bench"
          >
            <Users className="w-3.5 h-3.5 text-blue-400" />
            <span>Staff</span>
            {unassignedCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {unassignedCount} bench
              </span>
            )}
          </button>

          {/* Add Employee Button */}
          <button
            onClick={() => setIsAddEmployeeOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-200 text-xs font-medium transition-all"
            title="Add New Employee"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Add</span>
          </button>

          {/* Analytics */}
          <button
            onClick={() => setIsAnalyticsOpen(true)}
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white transition-all"
            title="Seating Analytics & Capacity"
          >
            <BarChart3 className="w-4 h-4 text-purple-400" />
          </button>

          {/* Audit Log / History */}
          <button
            onClick={() => setIsAuditLogOpen(true)}
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white transition-all"
            title="Audit Trail & 1-Click Undo"
          >
            <History className="w-4 h-4 text-amber-400" />
          </button>

          {/* Settings */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white transition-all"
            title="AI Engine & API Settings"
          >
            <Settings className="w-4 h-4 text-slate-400" />
          </button>

            {/* Direct ZIP Archive Download */}
            <a
              href="/seating-management-system.zip"
              download="seating-management-system.zip"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md transition-all"
              title="Download Full Project Source Code (ZIP)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ZIP</span>
            </a>

            <button
              onClick={handleExport}
              className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-400 hover:text-slate-200 transition-all"
              title="Export Seating Layout (JSON)"
            >
              <Download className="w-3.5 h-3.5" />
            </button>

            <label
              className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
              title="Import Seating Layout (JSON)"
            >
              <Upload className="w-3.5 h-3.5" />
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>

            <button
              onClick={() => {
                if (confirm('Reset office seating layout and employees to default?')) {
                  resetToDefaults();
                }
              }}
              className="p-1.5 rounded-xl bg-slate-900 hover:bg-rose-950/40 border border-white/10 hover:border-rose-500/30 text-slate-400 hover:text-rose-400 transition-all"
              title="Reset to Initial Layout"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
    </header>
  );
};
