import React from 'react';
import {
  Users,
  GripVertical,
  Sparkles,
  PlusCircle,
  Sun,
  ArrowUpCircle,
  Monitor,
  VolumeX,
  X
} from 'lucide-react';
import { useSeating } from '../../context/SeatingContext';
import { Employee } from '../../types';

export const EmployeeBenchDrawer: React.FC = () => {
  const {
    employees,
    floors,
    activeFloorId,
    reassignSeat,
    setIsAddEmployeeOpen,
    setIsAiDrawerOpen,
  } = useSeating();

  const unassignedEmployees = employees.filter(e => e.deskId === null);

  const handleDragStart = (e: React.DragEvent, emp: Employee) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({
      type: 'EMPLOYEE_MOVE',
      employeeId: emp.id,
      fromDeskId: null,
      employeeName: emp.name,
    }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleAutoSeatWithAi = (emp: Employee) => {
    // Find best available desk on current floor or any floor
    const currentFloor = floors.find(f => f.id === activeFloorId) || floors[0];
    const availableDesk = currentFloor.desks.find(d => d.status === 'available');

    if (availableDesk) {
      reassignSeat(emp.id, availableDesk.id, 'AI Auto Allocator');
    } else {
      // Find on any floor
      const anyDesk = floors.flatMap(f => f.desks).find(d => d.status === 'available');
      if (anyDesk) {
        reassignSeat(emp.id, anyDesk.id, 'AI Auto Allocator');
      }
    }
  };

  if (unassignedEmployees.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 max-w-4xl w-[94%] bg-slate-900/90 backdrop-blur-xl border border-white/15 rounded-3xl p-3 shadow-2xl animate-in slide-in-from-bottom duration-200">
      <div className="flex items-center justify-between px-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold font-mono">
            <Users className="w-3.5 h-3.5" />
            <span>UNASSIGNED BENCH ({unassignedEmployees.length})</span>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Drag any card directly onto an available desk on the map
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddEmployeeOpen(true)}
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* Draggable Cards Row */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1 pt-1 px-1 scrollbar-thin">
        {unassignedEmployees.map((emp) => (
          <div
            key={emp.id}
            draggable
            onDragStart={(e) => handleDragStart(e, emp)}
            className="group shrink-0 w-64 p-2.5 rounded-2xl bg-slate-950/80 hover:bg-slate-900 border border-white/10 hover:border-blue-500/50 shadow-md cursor-grab active:cursor-grabbing transition-all hover:-translate-y-1 flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <GripVertical className="w-4 h-4 text-slate-600 group-hover:text-blue-400 shrink-0" />
              <img
                src={emp.avatar}
                alt={emp.name}
                className="w-9 h-9 rounded-xl object-cover ring-1 ring-white/20 shrink-0"
              />
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">{emp.name}</div>
                <div className="text-[10px] text-blue-400 truncate">{emp.role}</div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[8px] px-1.5 py-0.2 rounded bg-white/5 text-slate-400 font-medium">
                    {emp.department}
                  </span>
                  {emp.preferences?.wantsWindow && <span title="Wants Window"><Sun className="w-2.5 h-2.5 text-amber-400" /></span>}
                  {emp.preferences?.wantsStandingDesk && <span title="Wants Standing Desk"><ArrowUpCircle className="w-2.5 h-2.5 text-blue-400" /></span>}
                  {emp.preferences?.wantsDualMonitors && <span title="Wants Dual Monitors"><Monitor className="w-2.5 h-2.5 text-purple-400" /></span>}
                </div>
              </div>
            </div>

            <button
              onClick={() => handleAutoSeatWithAi(emp)}
              className="p-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 border border-purple-500/30 transition-all shrink-0"
              title="Auto-Seat on available desk"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
